/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Alert, Autocomplete, Box, Button, Paper, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Typography } from '@mui/material'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useReportExport } from '@hooks/useReportExport'
import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { num } from '@components/section/statements/statementFormat'

type Opt = { id: number; name: string }

/**
 * The warranty report (GET api/Report/WarrantyReport?customerID=): per customer and kiosk model, how many active kiosks
 * are under warranty, end within 30 / 60 / 90 days, have ended or have no warranty data. A customer user always gets their own.
 */
const WarrantyReportTab = () => {
    const { isCustomer } = useUserScope()
    const lookups = useWorkTaskLookups()
    const exporter = useReportExport()
    const [customer, setCustomer] = useState<Opt | null>(null)

    const url = `api/Report/WarrantyReport${customer ? `?customerID=${customer.id}` : ''}`
    const report = useGetData<any[]>(url, 'rp-warranty', { ids: [url] })
    const rows = report.data?.value ?? []

    const keys = ['kiosksTotal', 'underWarranty', 'expiring30', 'expiring60', 'expiring90', 'expired', 'noWarrantyData']
    const sum = (key: string) => rows.reduce((a, r) => a + Number(r[key] ?? 0), 0)

    const exportFile = () =>
        exporter.exportXlsx(
            rows.map((r) => ({
                'مشتری': r.customerName ?? '-', 'مدل کیوسک': r.kioskModelName ?? '-', 'کل کیوسک‌ها': r.kiosksTotal, 'تحت گارانتی': r.underWarranty,
                'پایان تا ۳۰ روز': r.expiring30, 'پایان تا ۶۰ روز': r.expiring60, 'پایان تا ۹۰ روز': r.expiring90,
                'گارانتی تمام‌شده': r.expired, 'بدون اطلاعات گارانتی': r.noWarrantyData,
            })),
            'گزارش گارانتی', 'warranty-report'
        )

    return (
        <Box>
            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                {!isCustomer && (
                    <Autocomplete
                        size="small" sx={{ minWidth: 220 }} options={lookups.options.customerID} value={customer}
                        getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, o) => setCustomer(o)} renderInput={(p) => <TextField {...p} label="مشتری (خالی = همه)" />}
                    />
                )}
                <Button variant="outlined" onClick={exportFile} disabled={rows.length === 0} sx={{ borderRadius: 2 }}>خروجی Excel</Button>
            </Stack>

            {report.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                : report.data?.error !== 0 ? <Alert severity="error">{report.data?.errorMessage ?? 'دریافت گزارش انجام نشد'}</Alert>
                : (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>مشتری</TableCell><TableCell>مدل کیوسک</TableCell><TableCell>کل</TableCell><TableCell>تحت گارانتی</TableCell>
                                        <TableCell>پایان تا ۳۰ روز</TableCell><TableCell>تا ۶۰ روز</TableCell><TableCell>تا ۹۰ روز</TableCell>
                                        <TableCell>تمام‌شده</TableCell><TableCell>بدون اطلاعات</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((r) => (
                                        <TableRow key={`${r.customerID}-${r.kioskModelID}`} hover>
                                            <TableCell>{r.customerName ?? '-'}</TableCell>
                                            <TableCell>{r.kioskModelName ?? '-'}</TableCell>
                                            {keys.map((k) => <TableCell key={k}>{num(r[k])}</TableCell>)}
                                        </TableRow>
                                    ))}
                                    {rows.length === 0 && <TableRow><TableCell colSpan={9} align="center">کیوسک فعالی پیدا نشد</TableCell></TableRow>}
                                </TableBody>
                                {rows.length > 0 && (
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={2}><b>جمع</b></TableCell>
                                            {keys.map((k) => <TableCell key={k}><b>{num(sum(k))}</b></TableCell>)}
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </Table>
                        </Box>
                    </Paper>
                )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                «پایان تا ۶۰ روز» و «تا ۹۰ روز» شامل کیوسک‌های «تا ۳۰ روز» هم هستند.
            </Typography>
        </Box>
    )
}

export default WarrantyReportTab
