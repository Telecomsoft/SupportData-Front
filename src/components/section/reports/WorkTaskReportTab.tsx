/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
    Alert, Autocomplete, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
    TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { snackbarOpenType } from '@type/snackbarOpen'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { useReportLookups } from '@hooks/useReportLookups'
import { useReportExport } from '@hooks/useReportExport'
import { usePostQuery } from '@hooks/usePostQuery'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { dateFn } from '@utility/dateConverter'
import { num } from '@components/section/statements/statementFormat'
import { nameOf } from '@src/data/type/lookups'

type Opt = { id: number; name: string }
type Tri = boolean | null

// What the person is choosing. Nothing is sent until "نمایش" is pressed: some of these filters make the server work in memory.
type Draft = {
    states: Opt[]; types: Opt[]; customer: Opt | null; city: Opt | null; assignedTo: Opt | null
    kioskSerial: string; branchCode: string; text: string
    from: string | null; to: string | null
    overdueOnly: boolean; serviceForm: Tri; underWarranty: Tri; hasAttachments: Tri
    error: Opt | null; workItem: Opt | null; partModel: Opt | null
    delayFrom: string; delayTo: string
}

const EMPTY: Draft = {
    states: [], types: [], customer: null, city: null, assignedTo: null, kioskSerial: '', branchCode: '', text: '',
    from: null, to: null, overdueOnly: false, serviceForm: null, underWarranty: null, hasAttachments: null,
    error: null, workItem: null, partModel: null, delayFrom: '', delayTo: '',
}

// the exact body of POST api/Report/WorkTaskReport (WorkTaskReportFilter) without the page
const toBody = (d: Draft): Record<string, unknown> => ({
    states: d.states.length ? d.states.map((s) => s.id) : null,
    types: d.types.length ? d.types.map((t) => t.id) : null,
    customerID: d.customer?.id ?? null,
    cityID: d.city?.id ?? null,
    assignedToID: d.assignedTo?.id ?? null,
    kioskSerial: d.kioskSerial.trim() || null,
    branchCode: d.branchCode.trim() || null,
    text: d.text.trim() || null,
    reportedFrom: d.from,
    reportedTo: d.to,
    overdueOnly: d.overdueOnly ? true : null,
    serviceFormReceived: d.serviceForm,
    underWarranty: d.underWarranty,
    hasAttachments: d.hasAttachments,
    errorID: d.error?.id ?? null,
    workItemID: d.workItem?.id ?? null,
    partDeviceModelID: d.partModel?.id ?? null,
    delayFrom: d.delayFrom === '' ? null : Number(d.delayFrom),
    delayTo: d.delayTo === '' ? null : Number(d.delayTo),
})

const PAGE_SIZE = 50
const pad = (n: number) => String(n).padStart(2, '0')
const toIsoDay = (d: DateObject, end: boolean) => {
    const g = d.toDate()
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}T${end ? '23:59:59' : '00:00:00'}`
}

/** "all / yes / no" for a filter that is true, false or not used */
const TriButtons = ({ label, value, onChange }: { label: string; value: Tri; onChange: (v: Tri) => void }) => (
    <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <ToggleButtonGroup size="small" exclusive value={value === null ? 'all' : value ? 'yes' : 'no'} onChange={(_, v) => v && onChange(v === 'all' ? null : v === 'yes')}>
            <ToggleButton value="all">همه</ToggleButton>
            <ToggleButton value="yes">بله</ToggleButton>
            <ToggleButton value="no">خیر</ToggleButton>
        </ToggleButtonGroup>
    </Stack>
)

/**
 * The work task activity report: POST api/Report/WorkTaskReport (the rows, paged), POST api/Report/WorkTaskReportSummary
 * (the totals) and an Excel export of every matching row. The report filter is the work task filter plus the
 * report-only ones (warranty on the report day, error, work item, part model, delay, attachments).
 */
const WorkTaskReportTab = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { isCustomer } = useUserScope()
    const { accessCheck } = useAccessCheck()
    const lookups = useReportLookups()
    const exporter = useReportExport()
    const canOpenTask = accessCheck({ accessInfoId: 111, KindAccessInfo: 'readAccess' })

    const [draft, setDraft] = useState<Draft>(EMPTY)
    const [applied, setApplied] = useState<Draft>(EMPTY)
    const [page, setPage] = useState(0)
    const [exporting, setExporting] = useState(false)

    const filterBody = useMemo(() => toBody(applied), [applied])
    const rows = usePostQuery<{ items: any[]; total: number }>('api/Report/WorkTaskReport', 'rp-worktask-report', { ...filterBody, index: page * PAGE_SIZE, number: PAGE_SIZE })
    const summary = usePostQuery<any>('api/Report/WorkTaskReportSummary', 'rp-worktask-summary', filterBody)

    const set = <K extends keyof Draft>(key: K, v: Draft[K]) => setDraft((d) => ({ ...d, [key]: v }))
    const apply = () => { setPage(0); setApplied(draft) }
    const clear = () => { setDraft(EMPTY); setPage(0); setApplied(EMPTY) }

    const combo = (label: string, options: Opt[], value: Opt | null, onChange: (o: Opt | null) => void) => (
        <Autocomplete
            size="small" sx={{ minWidth: 180 }} options={options} value={value}
            getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => onChange(o)} renderInput={(p) => <TextField {...p} label={label} />}
        />
    )
    const multi = (label: string, options: Opt[], value: Opt[], onChange: (o: Opt[]) => void) => (
        <Autocomplete
            multiple size="small" sx={{ minWidth: 220 }} options={options} value={value} limitTags={1}
            getOptionLabel={(o) => o.name} isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => onChange(o)} renderInput={(p) => <TextField {...p} label={label} />}
        />
    )
    const date = (label: string, current: string | null, onChange: (iso: string | null) => void, end: boolean) => (
        <DatePicker
            calendar={persian} locale={persian_fa} value={current ? new Date(current) : ''}
            onChange={(d: DateObject | null) => onChange(d instanceof DateObject ? toIsoDay(d, end) : null)}
            render={<TextField size="small" label={label} sx={{ width: 140 }} InputLabelProps={{ shrink: !!current || undefined }} />}
        />
    )

    // every matching row, not just the page on screen
    const exportAll = async () => {
        setExporting(true)
        try {
            const all = await exporter.fetchAllPages<any>('api/Report/WorkTaskReport', filterBody)
            exporter.exportXlsx(
                all.map((r) => ({
                    'شماره': r.workTaskID, 'نوع': r.typeName, 'وضعیت': r.stateName, 'سریال کیوسک': r.kioskSerial, 'شعبه': r.branchName,
                    'شهر': r.cityName, 'مشتری': r.customerName, 'ارجاع‌شده به': r.assignedToName,
                    'زمان گزارش': r.reportedAt ? dateFn(r.reportedAt) : '', 'زمان اتمام': r.finishedAt ? dateFn(r.finishedAt) : '',
                    'روز تاخیر': r.delayDays, 'تحت گارانتی': r.underWarranty ? 'بله' : 'خیر', 'مبلغ مشتری': r.customerTotal,
                })),
                'گزارش فعالیت', 'work-task-report'
            )
        } catch (e) {
            snackbarOpen((e as Error).message || 'خروجی گرفته نشد', SNACKBAR_SEVERITIES.ERROR)
        } finally {
            setExporting(false)
        }
    }

    const items = rows.data?.value?.items ?? []
    const total = rows.data?.value?.total ?? 0
    const sum = summary.data?.value
    const failed = rows.data && rows.data.error !== 0

    return (
        <Box>
            {/* ---- the filter ---- */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                    {multi('وضعیت', lookups.options.states, draft.states, (v) => set('states', v))}
                    {multi('نوع', lookups.options.types, draft.types, (v) => set('types', v))}
                    {!isCustomer && combo('مشتری', lookups.options.customerID, draft.customer, (v) => set('customer', v))}
                    {combo('شهر', lookups.options.cityID, draft.city, (v) => set('city', v))}
                    {!isCustomer && combo('ارجاع‌شده به', lookups.options.assignedToID, draft.assignedTo, (v) => set('assignedTo', v))}
                    <TextField size="small" label="سریال کیوسک" value={draft.kioskSerial} onChange={(e) => set('kioskSerial', e.target.value)} sx={{ width: 150 }} />
                    <TextField size="small" label="کد شعبه" value={draft.branchCode} onChange={(e) => set('branchCode', e.target.value)} sx={{ width: 120 }} />
                    {date('گزارش از', draft.from, (v) => set('from', v), false)}
                    {date('گزارش تا', draft.to, (v) => set('to', v), true)}
                    {!isCustomer && combo('خطا', lookups.options.errorID, draft.error, (v) => set('error', v))}
                    {combo('کار انجام‌شده', lookups.options.workItemIDs, draft.workItem, (v) => set('workItem', v))}
                    {!isCustomer && combo('قطعه‌ی تعویض‌شده', lookups.options.deviceModelID, draft.partModel, (v) => set('partModel', v))}
                    <TextField size="small" label="تاخیر از (روز)" value={draft.delayFrom} onChange={(e) => set('delayFrom', e.target.value.replace(/\D/g, ''))} sx={{ width: 110 }} />
                    <TextField size="small" label="تاخیر تا (روز)" value={draft.delayTo} onChange={(e) => set('delayTo', e.target.value.replace(/\D/g, ''))} sx={{ width: 110 }} />
                    <TextField size="small" label="جستجو در شرح و توضیحات" value={draft.text} onChange={(e) => set('text', e.target.value)} sx={{ width: 220 }} />
                    <TriButtons label="فقط دیرکردها" value={draft.overdueOnly ? true : null} onChange={(v) => set('overdueOnly', v === true)} />
                    <TriButtons label="فرم سرویس دریافت‌شده" value={draft.serviceForm} onChange={(v) => set('serviceForm', v)} />
                    <TriButtons label="تحت گارانتی (روز گزارش)" value={draft.underWarranty} onChange={(v) => set('underWarranty', v)} />
                    <TriButtons label="دارای پیوست" value={draft.hasAttachments} onChange={(v) => set('hasAttachments', v)} />
                </Stack>
                <Stack direction="row" gap={1} sx={{ mt: 1.5 }}>
                    <Button variant="contained" onClick={apply} sx={{ borderRadius: 2, boxShadow: 'none' }}>نمایش</Button>
                    <Button variant="outlined" onClick={clear} sx={{ borderRadius: 2 }}>پاک کردن</Button>
                    <Button variant="outlined" onClick={exportAll} disabled={exporting || !total} sx={{ borderRadius: 2 }}>
                        {exporting ? 'در حال ساخت فایل…' : 'خروجی Excel (همه‌ی نتایج)'}
                    </Button>
                </Stack>
            </Paper>

            {/* ---- the totals ---- */}
            {sum && (
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={700}>جمع: {num(sum.total)} فعالیت</Typography>
                    <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                        {Object.entries(sum.byState ?? {}).map(([id, n]) => <Chip key={`s${id}`} size="small" color="primary" variant="outlined" label={`${nameOf(lookups.options.states, Number(id)) || id}: ${num(n as number)}`} />)}
                    </Stack>
                    <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                        {Object.entries(sum.byType ?? {}).map(([id, n]) => <Chip key={`t${id}`} size="small" variant="outlined" label={`${nameOf(lookups.options.types, Number(id)) || id}: ${num(n as number)}`} />)}
                    </Stack>
                    {!isCustomer && (
                        <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                            {(sum.byTechnician ?? []).map((t: any) => <Chip key={t.name} size="small" label={`${t.name}: ${num(t.count)}`} />)}
                        </Stack>
                    )}
                </Paper>
            )}

            {/* ---- the rows ---- */}
            {rows.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                : failed ? <Alert severity="error">{rows.data?.errorMessage ?? 'دریافت گزارش انجام نشد'}</Alert>
                : (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>شماره</TableCell><TableCell>نوع</TableCell><TableCell>وضعیت</TableCell><TableCell>کیوسک</TableCell>
                                        <TableCell>شعبه</TableCell><TableCell>شهر</TableCell>{!isCustomer && <TableCell>مشتری</TableCell>}
                                        {!isCustomer && <TableCell>ارجاع‌شده به</TableCell>}<TableCell>زمان گزارش</TableCell><TableCell>زمان اتمام</TableCell>
                                        <TableCell>تاخیر</TableCell><TableCell>گارانتی</TableCell><TableCell>مبلغ مشتری</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((r) => (
                                        <TableRow key={r.workTaskID} hover>
                                            <TableCell>
                                                {canOpenTask ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => navigate({ to: `/workTaskDetail/${r.workTaskID}` })}>#{r.workTaskID}</Button> : `#${r.workTaskID}`}
                                            </TableCell>
                                            <TableCell>{r.typeName ?? '-'}</TableCell>
                                            <TableCell>{r.stateName ?? '-'}</TableCell>
                                            <TableCell dir="ltr" sx={{ textAlign: 'right' }}>{r.kioskSerial ?? '-'}</TableCell>
                                            <TableCell>{r.branchName ?? '-'}</TableCell>
                                            <TableCell>{r.cityName ?? '-'}</TableCell>
                                            {!isCustomer && <TableCell>{r.customerName ?? '-'}</TableCell>}
                                            {!isCustomer && <TableCell>{r.assignedToName ?? '-'}</TableCell>}
                                            <TableCell>{r.reportedAt ? dateFn(r.reportedAt) : '-'}</TableCell>
                                            <TableCell>{r.finishedAt ? dateFn(r.finishedAt) : '-'}</TableCell>
                                            <TableCell>{num(r.delayDays)}</TableCell>
                                            <TableCell>{r.underWarranty ? <Chip size="small" color="success" label="بله" /> : <Chip size="small" label="خیر" />}</TableCell>
                                            <TableCell>{num(r.customerTotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && <TableRow><TableCell colSpan={13} align="center">موردی پیدا نشد</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </Box>
                        <TablePagination
                            component="div" count={total} page={page} rowsPerPage={PAGE_SIZE} rowsPerPageOptions={[PAGE_SIZE]}
                            onPageChange={(_, p) => setPage(p)} labelRowsPerPage="" labelDisplayedRows={({ from, to, count }) => `${from}–${to} از ${count}`}
                        />
                    </Paper>
                )}
        </Box>
    )
}

export default WorkTaskReportTab
