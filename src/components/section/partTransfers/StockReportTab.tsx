/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Alert, Autocomplete, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useGetData } from '@hooks/useGetData'
import { usePartTransferLookups } from '@hooks/usePartTransferLookups'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }
const WAREHOUSE = 1
const TECHNICIAN = 2

/** "How many of this part does X hold?": GET api/PartTransfer/Stock, one number. */
const StockQuestion = () => {
    const lookups = usePartTransferLookups()
    const [model, setModel] = useState<Opt | null>(null)
    const [location, setLocation] = useState<Opt>({ id: WAREHOUSE, name: 'انبار' })
    const [technician, setTechnician] = useState<Opt | null>(null)
    const [asked, setAsked] = useState<{ model: number; location: number; technician: number | null } | null>(null)

    const url = asked
        ? `api/PartTransfer/Stock?deviceModelID=${asked.model}&location=${asked.location}${asked.technician ? `&technicianID=${asked.technician}` : ''}`
        : ''
    const stock = useGetData<number>(url, 'pt-stock', { ids: [url], enabled: !!asked })

    const needsTechnician = location.id === TECHNICIAN
    const canAsk = !!model && (!needsTechnician || !!technician)

    return (
        <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>موجودی یک قطعه</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                <Autocomplete
                    size="small" sx={{ minWidth: 220 }} options={lookups.options.deviceModelID} value={model}
                    getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                    onChange={(_, o) => setModel(o)} renderInput={(p) => <StyledTextField {...p} label="مدل قطعه" />}
                />
                <Autocomplete
                    size="small" sx={{ minWidth: 150 }} disableClearable
                    options={[{ id: WAREHOUSE, name: 'انبار' }, { id: TECHNICIAN, name: 'تکنسین' }]} value={location}
                    getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                    onChange={(_, o) => { setLocation(o); if (o.id !== TECHNICIAN) setTechnician(null) }}
                    renderInput={(p) => <StyledTextField {...p} label="کجا" />}
                />
                {needsTechnician && (
                    <Autocomplete
                        size="small" sx={{ minWidth: 200 }} options={lookups.options.technicianID} value={technician}
                        getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, o) => setTechnician(o)} renderInput={(p) => <StyledTextField {...p} label="تکنسین" />}
                    />
                )}
                <Button variant="contained" disabled={!canAsk || stock.isFetching} sx={{ borderRadius: 2, boxShadow: 'none' }}
                    onClick={() => setAsked({ model: model!.id, location: location.id, technician: needsTechnician ? technician!.id : null })}>
                    نمایش
                </Button>
            </Stack>
            {asked && (
                <Box sx={{ mt: 1.5 }}>
                    {stock.isFetching ? <CustomCircularProgress thickness={2} size={24} />
                        : stock.data?.error === 0 ? <Typography variant="h6">موجودی: {Number(stock.data.value).toLocaleString('fa-IR')}</Typography>
                            : <Alert severity="error">{stock.data?.errorMessage ?? 'دریافت موجودی انجام نشد'}</Alert>}
                </Box>
            )}
        </Paper>
    )
}

/** The warehouse stock and every technician's holding for each model (GET api/PartTransfer/StockReport), plus the one-part question above. */
const StockReportTab = () => {
    const report = useGetData<any[]>('api/PartTransfer/StockReport', 'pt-stock-report')
    const [search, setSearch] = useState('')

    if (report.isLoading) return <CustomCircularProgress thickness={2} size={40} />

    const rows = (report.data?.value ?? []).filter((r) => !search || (r.deviceModelName ?? '').toLowerCase().includes(search.toLowerCase()))
    const num = (n: number) => Number(n).toLocaleString('fa-IR')

    return (
        <Box>
            <StockQuestion />
            {report.data?.error !== 0 && report.data?.errorMessage && <Alert severity="error" sx={{ mb: 1 }}>{report.data.errorMessage}</Alert>}
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1.5, p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <StyledTextField size="medium" label="جستجوی مدل قطعه" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 1, width: 260 }} />
            </Grid>
            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>مدل قطعه</TableCell><TableCell>انبار</TableCell><TableCell>نزد تکنسین‌ها</TableCell><TableCell>جمع</TableCell><TableCell>تکنسین‌ها</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((r) => {
                            const withTechs = (r.holdings ?? []).reduce((a: number, h: any) => a + h.quantity, 0)
                            return (
                                <TableRow key={r.deviceModelID}>
                                    <TableCell>{r.deviceModelName ?? `#${r.deviceModelID}`}</TableCell>
                                    <TableCell>{num(r.warehouse)}</TableCell>
                                    <TableCell>{num(withTechs)}</TableCell>
                                    <TableCell><b>{num(r.warehouse + withTechs)}</b></TableCell>
                                    <TableCell>
                                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                                            {(r.holdings ?? []).map((h: any) => <Chip key={h.technicianID} size="small" label={`${h.technicianName ?? `#${h.technicianID}`}: ${num(h.quantity)}`} />)}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {rows.length === 0 && <TableRow><TableCell colSpan={5} align="center">قطعه‌ای در انبار یا نزد تکنسین‌ها نیست</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default StockReportTab
