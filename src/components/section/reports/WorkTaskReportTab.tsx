/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import {
    Alert, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
    ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { snackbarOpenType } from '@type/snackbarOpen'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import StyledTextField from '@components/general/input/StyledTextField'
import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete'
import { useReportLookups } from '@hooks/useReportLookups'
import { useReportExport } from '@hooks/useReportExport'
import { usePostQuery } from '@hooks/usePostQuery'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { dateFn } from '@utility/dateConverter'
import { sizeConverter } from '@utility/sizeConverter'
import { num } from '@components/section/statements/statementFormat'
import { nameOf } from '@src/data/type/lookups'
import JalaliFilterDate from '@components/general/JalaliFilterDate'

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

type Cell = { key: string; node: ReactNode }

/** "all / yes / no" for a filter that is true, false or not used */
const TriButtons = ({ label, value, onChange }: { label: string; value: Tri; onChange: (v: Tri) => void }) => (
    <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: sizeConverter(11) }}>{label}</Typography>
        <ToggleButtonGroup size="small" exclusive sx={{ height: sizeConverter(30, 'height') }}
            value={value === null ? 'all' : value ? 'yes' : 'no'} onChange={(_, v) => v && onChange(v === 'all' ? null : v === 'yes')}>
            <ToggleButton value="all" sx={{ px: 1, py: 0, fontSize: sizeConverter(12) }}>همه</ToggleButton>
            <ToggleButton value="yes" sx={{ px: 1, py: 0, fontSize: sizeConverter(12) }}>بله</ToggleButton>
            <ToggleButton value="no" sx={{ px: 1, py: 0, fontSize: sizeConverter(12) }}>خیر</ToggleButton>
        </ToggleButtonGroup>
    </Stack>
)

/** One column of the totals: a small heading and its chips. */
const ChipGroup = ({ title, children }: { title: string; children: ReactNode }) => (
    <Box>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5, fontSize: sizeConverter(11) }}>{title}</Typography>
        <Stack direction="row" gap={0.5} flexWrap="wrap">{children}</Stack>
    </Box>
)
const chipSx = { height: sizeConverter(22, 'height'), fontSize: sizeConverter(12) }

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

    const inputHeight = sizeConverter(30, 'height')
    const combo = (label: string, options: Opt[], value: Opt | null, onChange: (o: Opt | null) => void) => (
        <StyledAutoComplete
            size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { height: inputHeight } }} options={options} value={value}
            getOptionLabel={(o: any) => o.name} isOptionEqualToValue={(a: any, b: any) => a.id === b.id}
            onChange={(_, o: any) => onChange(o)} renderInput={(p) => <StyledTextField {...p} label={label} />}
        />
    )
    const multi = (label: string, options: Opt[], value: Opt[], onChange: (o: Opt[]) => void) => (
        <StyledAutoComplete
            multiple size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { minHeight: inputHeight, height: 'auto' } }} options={options} value={value} limitTags={1}
            getOptionLabel={(o: any) => o.name} isOptionEqualToValue={(a: any, b: any) => a.id === b.id}
            onChange={(_, o: any) => onChange(o)} renderInput={(p) => <StyledTextField {...p} label={label} />}
        />
    )
    const text = (label: string, key: 'kioskSerial' | 'branchCode' | 'text') => (
        <StyledTextField size="small" fullWidth label={label} value={draft[key]} onChange={(e) => set(key, e.target.value)} />
    )
    const days = (label: string, key: 'delayFrom' | 'delayTo') => (
        <StyledTextField size="small" fullWidth label={label} value={draft[key]} onChange={(e) => set(key, e.target.value.replace(/\D/g, ''))} />
    )
    const date = (label: string, current: string | null, onChange: (iso: string | null) => void, end: boolean) => (
        <JalaliFilterDate label={label} value={current} onChange={onChange} endOfDay={end} width={sizeConverter(170, 'width')} />
    )

    // The filter is three rows of a 12-column Grid; each row is split evenly between its items, so nothing is left empty.
    // (a customer user has fewer filters, so the rows simply have fewer items)
    const row1 = [
        { key: 'states', node: multi('وضعیت', lookups.options.states, draft.states, (v) => set('states', v)) },
        { key: 'types', node: multi('نوع', lookups.options.types, draft.types, (v) => set('types', v)) },
        !isCustomer && { key: 'customer', node: combo('مشتری', lookups.options.customerID, draft.customer, (v) => set('customer', v)) },
        { key: 'city', node: combo('شهر', lookups.options.cityID, draft.city, (v) => set('city', v)) },
        !isCustomer && { key: 'assignedTo', node: combo('ارجاع‌شده به', lookups.options.assignedToID, draft.assignedTo, (v) => set('assignedTo', v)) },
        { key: 'serial', node: text('سریال کیوسک', 'kioskSerial') },
        { key: 'branch', node: text('کد شعبه', 'branchCode') },
    ]
    const row2 = [
        { key: 'from', node: date('گزارش از', draft.from, (v) => set('from', v), false) },
        { key: 'to', node: date('گزارش تا', draft.to, (v) => set('to', v), true) },
        !isCustomer && { key: 'error', node: combo('خطا', lookups.options.errorID, draft.error, (v) => set('error', v)) },
        { key: 'workItem', node: combo('کار انجام‌شده', lookups.options.workItemIDs, draft.workItem, (v) => set('workItem', v)) },
        !isCustomer && { key: 'partModel', node: combo('قطعه‌ی تعویض‌شده', lookups.options.deviceModelID, draft.partModel, (v) => set('partModel', v)) },
        { key: 'delayFrom', node: days('تاخیر از (روز)', 'delayFrom') },
        { key: 'delayTo', node: days('تاخیر تا (روز)', 'delayTo') },
    ]
    const row3 = [
        { key: 'text', node: text('جستجو در شرح و توضیحات', 'text') },
        { key: 'overdue', node: <TriButtons label="فقط دیرکردها" value={draft.overdueOnly ? true : null} onChange={(v) => set('overdueOnly', v === true)} /> },
        { key: 'serviceForm', node: <TriButtons label="فرم سرویس دریافت‌شده" value={draft.serviceForm} onChange={(v) => set('serviceForm', v)} /> },
        { key: 'warranty', node: <TriButtons label="تحت گارانتی (روز گزارش)" value={draft.underWarranty} onChange={(v) => set('underWarranty', v)} /> },
        { key: 'attachments', node: <TriButtons label="دارای پیوست" value={draft.hasAttachments} onChange={(v) => set('hasAttachments', v)} /> },
    ]
    const cells = (row: (Cell | false)[]) => {
        const list = row.filter((c): c is Cell => !!c)
        return list.map((c) => <Grid key={c.key} size={{ xs: 12, sm: 6, md: 12 / list.length }}>{c.node}</Grid>)
    }

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
    const buttonSx = { height: inputHeight, borderRadius: 2 }

    return (
        <Box>
            {/* ---- the filter ---- */}
            <Paper elevation={0} sx={{ p: sizeConverter(12, 'spaceX'), mb: sizeConverter(8, 'spaceY'), borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={sizeConverter(8, 'spaceX')} alignItems="center">
                    {cells(row1)}
                    {cells(row2)}
                    {cells(row3)}
                </Grid>
                <Stack direction="row" gap={1} sx={{ mt: sizeConverter(8, 'spaceY') }}>
                    <Button variant="contained" onClick={apply} sx={{ ...buttonSx, boxShadow: 'none' }}>نمایش</Button>
                    <Button variant="outlined" onClick={clear} sx={buttonSx}>پاک کردن</Button>
                    <Button variant="outlined" onClick={exportAll} disabled={exporting || !total} sx={buttonSx}>
                        {exporting ? 'در حال ساخت فایل…' : 'خروجی Excel (همه‌ی نتایج)'}
                    </Button>
                </Stack>
            </Paper>

            {/* ---- the totals: the groups side by side (not under each other), so they take one short band ---- */}
            {sum && (
                <Paper elevation={0} sx={{ p: sizeConverter(12, 'spaceX'), mb: sizeConverter(8, 'spaceY'), borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Grid container spacing={sizeConverter(12, 'spaceX')} alignItems="flex-start">
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Typography variant="subtitle1" fontWeight={700}>جمع: {num(sum.total)} فعالیت</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: isCustomer ? 5 : 4 }}>
                            <ChipGroup title="وضعیت">
                                {Object.entries(sum.byState ?? {}).map(([id, n]) => <Chip key={`s${id}`} size="small" color="primary" variant="outlined" sx={chipSx} label={`${nameOf(lookups.options.states, Number(id)) || id}: ${num(n as number)}`} />)}
                            </ChipGroup>
                        </Grid>
                        <Grid size={{ xs: 12, md: isCustomer ? 5 : 3 }}>
                            <ChipGroup title="نوع">
                                {Object.entries(sum.byType ?? {}).map(([id, n]) => <Chip key={`t${id}`} size="small" variant="outlined" sx={chipSx} label={`${nameOf(lookups.options.types, Number(id)) || id}: ${num(n as number)}`} />)}
                            </ChipGroup>
                        </Grid>
                        {!isCustomer && (
                            <Grid size={{ xs: 12, md: 3 }}>
                                <ChipGroup title="ارجاع‌شده به">
                                    {(sum.byTechnician ?? []).map((t: any) => <Chip key={t.name} size="small" sx={chipSx} label={`${t.name}: ${num(t.count)}`} />)}
                                </ChipGroup>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* ---- the rows ---- */}
            {rows.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                : failed ? <Alert severity="error">{rows.data?.errorMessage ?? 'دریافت گزارش انجام نشد'}</Alert>
                : (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box sx={{ overflowX: 'auto' }}>
                            {/* tighter cells: more rows on the screen */}
                            <Table size="small" sx={{ '& .MuiTableCell-root': { py: sizeConverter(4, 'spaceY'), px: sizeConverter(8, 'spaceX') } }}>
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
                                            <TableCell>{r.underWarranty ? <Chip size="small" color="success" label="بله" sx={chipSx} /> : <Chip size="small" label="خیر" sx={chipSx} />}</TableCell>
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
