/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import { Alert, Autocomplete, Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { snackbarOpenType } from '@type/snackbarOpen'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { PRINT_CSS, openPrintWindow } from '@components/section/reports/printUtil'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useReportExport } from '@hooks/useReportExport'
import { usePostQuery } from '@hooks/usePostQuery'
import { useUserScope } from '@hooks/useUserScope'
import { day, num, rial } from '@components/section/statements/statementFormat'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }

const pad = (n: number) => String(n).padStart(2, '0')
const toIsoDay = (d: DateObject) => {
    const g = d.toDate()
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}T00:00:00`
}

/**
 * The customer billing report (POST api/Report/CustomerBillingReport): what to invoice a customer for the tasks
 * finished (or approved) in a date range, with the customer's charges, what was received and what is paid.
 * Staff must choose a customer; a customer user always gets their own. Can be exported to Excel and printed.
 */
const CustomerBillingTab = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const { isCustomer } = useUserScope()
    const lookups = useWorkTaskLookups()
    const exporter = useReportExport()
    const sheet = useRef<HTMLDivElement>(null)

    const [customer, setCustomer] = useState<Opt | null>(null)
    const [from, setFrom] = useState<string | null>(null)
    const [to, setTo] = useState<string | null>(null)
    // nothing is asked until "نمایش" is pressed, and the asked filter is kept so editing the form does not re-run it
    const [asked, setAsked] = useState<{ customerID: number | null; from: string; to: string } | null>(null)

    const result = usePostQuery<any>('api/Report/CustomerBillingReport', 'rp-billing', asked ?? {}, { enabled: !!asked })

    const canAsk = !!from && !!to && (isCustomer || !!customer)
    const show = () => {
        if (!canAsk) return snackbarOpen(isCustomer ? 'بازه‌ی تاریخ را انتخاب کن' : 'مشتری و بازه‌ی تاریخ را انتخاب کن', SNACKBAR_SEVERITIES.ERROR)
        setAsked({ customerID: isCustomer ? null : customer!.id, from: from!, to: to! })
    }

    const data = asked ? result.data?.value : undefined
    const rows: any[] = data?.rows ?? []
    const totals = data?.totals

    const exportFile = () =>
        exporter.exportXlsx(
            rows.map((r) => ({
                'دستورکار': r.workTaskID, 'نوع': r.typeName, 'سریال کیوسک': r.kioskSerial, 'شعبه': r.branchName, 'شهر': r.cityName,
                'زمان اتمام': r.finishedAt ? day(r.finishedAt) : '', 'کارشناسی': r.inspectionCost, 'ایاب و ذهاب': r.transportationCost,
                'قطعه': r.partCost, 'سایر': r.otherCost, 'جمع': r.total, 'دریافتی': r.receivedAmount, 'شماره فاکتور': r.invoiceNo ?? '',
                'پرداخت': r.isPaid ? 'پرداخت شده' : 'نشده', 'مبلغ پرداخت‌شده': r.paidAmount,
            })),
            'صورت‌حساب مشتری', `customer-billing-${data?.customerName ?? ''}`
        )

    const printIt = () => {
        if (sheet.current && !openPrintWindow('صورت‌حساب مشتری', sheet.current.innerHTML)) snackbarOpen('پنجره‌ی چاپ باز نشد؛ مسدودکننده‌ی پنجره را بررسی کن', SNACKBAR_SEVERITIES.ERROR)
    }

    const date = (label: string, current: string | null, set: (v: string | null) => void) => (
        <DatePicker
            calendar={persian} locale={persian_fa} value={current ? new Date(current) : ''}
            onChange={(d: DateObject | null) => set(d instanceof DateObject ? toIsoDay(d) : null)}
            render={<StyledTextField size="small" label={label} sx={{ width: 150 }} InputLabelProps={{ shrink: !!current || undefined }} />}
        />
    )

    return (
        <Box>
            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {!isCustomer && (
                    <Autocomplete
                        size="small" sx={{ minWidth: 220 }} options={lookups.options.customerID} value={customer}
                        getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
                        onChange={(_, o) => setCustomer(o)} renderInput={(p) => <StyledTextField {...p} label="مشتری" required />}
                    />
                )}
                {date('اتمام از', from, setFrom)}
                {date('اتمام تا', to, setTo)}
                <Button variant="contained" onClick={show} sx={{ borderRadius: 2, boxShadow: 'none' }}>نمایش</Button>
                <Button variant="outlined" onClick={exportFile} disabled={rows.length === 0} sx={{ borderRadius: 2 }}>خروجی Excel</Button>
                <Button variant="outlined" onClick={printIt} disabled={rows.length === 0} sx={{ borderRadius: 2 }}>چاپ</Button>
            </Stack>

            {!asked ? <Typography variant="body2" color="text.secondary">{isCustomer ? 'بازه‌ی تاریخ اتمام را انتخاب کن.' : 'مشتری و بازه‌ی تاریخ اتمام را انتخاب کن.'} دستورکارهای «اتمام» و «تایید نهایی» همین بازه نمایش داده می‌شوند.</Typography>
                : result.isFetching && !result.data ? <CustomCircularProgress thickness={2} size={40} />
                : result.data?.error !== 0 ? <Alert severity="error">{result.data?.errorMessage ?? 'دریافت گزارش انجام نشد'}</Alert>
                : (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', p: 2 }}>
                        <div ref={sheet}>
                            <style>{PRINT_CSS}</style>
                            <div className="rp-print">
                                <h2>صورت‌حساب مشتری — {data?.customerName ?? ''}</h2>
                                <div className="box">بازه‌ی اتمام: {day(asked.from)} تا {day(asked.to)} — تعداد دستورکار: {num(totals?.count)}</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>دستورکار</th><th>نوع</th><th>کیوسک</th><th>شعبه</th><th>شهر</th><th>اتمام</th><th>کارشناسی</th><th>ایاب و ذهاب</th>
                                            <th>قطعه</th><th>سایر</th><th>جمع</th><th>دریافتی</th><th>فاکتور</th><th>پرداخت</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((r) => (
                                            <tr key={r.workTaskID}>
                                                <td>{r.workTaskID}</td><td>{r.typeName}</td><td dir="ltr">{r.kioskSerial}</td><td>{r.branchName}</td><td>{r.cityName}</td>
                                                <td>{r.finishedAt ? day(r.finishedAt) : ''}</td><td>{num(r.inspectionCost)}</td><td>{num(r.transportationCost)}</td>
                                                <td>{num(r.partCost)}</td><td>{num(r.otherCost)}</td><td>{num(r.total)}</td><td>{num(r.receivedAmount)}</td>
                                                <td dir="ltr">{r.invoiceNo ?? ''}</td>
                                                <td>{r.isPaid ? `پرداخت شده (${num(r.paidAmount)})` : 'نشده'}</td>
                                            </tr>
                                        ))}
                                        {rows.length === 0 && <tr><td colSpan={14}>دستورکاری در این بازه نیست</td></tr>}
                                        {totals && rows.length > 0 && (
                                            <tr className="sum">
                                                <td colSpan={6}>جمع ({num(totals.count)} دستورکار)</td><td>{num(totals.inspection)}</td><td>{num(totals.transportation)}</td>
                                                <td>{num(totals.part)}</td><td>{num(totals.other)}</td><td>{num(totals.total)}</td><td>{num(totals.received)}</td>
                                                <td></td><td>{num(totals.paid)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {totals && <div className="total">مبلغ قابل فاکتور: {rial(totals.total)} — دریافت‌شده: {rial(totals.received)} — پرداخت‌شده: {rial(totals.paid)}</div>}
                            </div>
                        </div>
                        {totals && rows.length > 0 && (
                            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                                <Chip color="primary" label={`قابل فاکتور: ${rial(totals.total)}`} />
                                <Chip label={`دریافتی: ${rial(totals.received)}`} />
                                <Chip label={`پرداخت‌شده: ${rial(totals.paid)}`} />
                            </Stack>
                        )}
                    </Paper>
                )}
        </Box>
    )
}

export default CustomerBillingTab
