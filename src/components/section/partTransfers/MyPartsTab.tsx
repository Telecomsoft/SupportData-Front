/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Alert, Autocomplete, Box, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useGetData } from '@hooks/useGetData'
import { usePartTransferLookups } from '@hooks/usePartTransferLookups'
import { useUserScope } from '@hooks/useUserScope'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }

/**
 * What a technician holds now (GET api/PartTransfer/MyParts). A field technician always sees their own;
 * staff see their own too, or pick any technician (?technicianID=).
 */
const MyPartsTab = () => {
    const { isFieldTechnician } = useUserScope()
    const lookups = usePartTransferLookups()
    const [technician, setTechnician] = useState<Opt | null>(null)

    const url = technician ? `api/PartTransfer/MyParts?technicianID=${technician.id}` : 'api/PartTransfer/MyParts'
    const parts = useGetData<any[]>(url, 'pt-my-parts', { ids: [url] })

    return (
        <Box>
            {!isFieldTechnician && (
                <Grid container  sx={{ mb: 1.5,p:1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Autocomplete
                        size="small" sx={{ width: 280, mb: 1.5 }} options={lookups.options.technicianID} value={technician}
                        getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, o) => setTechnician(o)}
                        renderInput={(p) => <StyledTextField size="small" {...p} label="تکنسین (خالی = قطعات خودم)" />}
                    />
                </Grid>
            )}

            {parts.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                : parts.data?.error !== 0 ? <Alert severity="warning">{parts.data?.errorMessage ?? 'دریافت قطعات انجام نشد'}</Alert>
                    : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead><TableRow><TableCell>مدل قطعه</TableCell><TableCell>تعداد</TableCell><TableCell>سریال‌ها</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {(parts.data?.value ?? []).map((p) => (
                                        <TableRow key={p.deviceModelID}>
                                            <TableCell>{p.deviceModelName ?? `#${p.deviceModelID}`}</TableCell>
                                            <TableCell>{Number(p.quantity).toLocaleString('fa-IR')}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" gap={0.5} flexWrap="wrap">
                                                    {(p.serials ?? []).length === 0 ? '-' : (p.serials as string[]).map((s) => <Chip key={s} size="small" variant="outlined" label={s} sx={{ direction: 'ltr' }} />)}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(parts.data?.value ?? []).length === 0 && <TableRow><TableCell colSpan={3} align="center">قطعه‌ای نزد این تکنسین نیست</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
        </Box>
    )
}

export default MyPartsTab
