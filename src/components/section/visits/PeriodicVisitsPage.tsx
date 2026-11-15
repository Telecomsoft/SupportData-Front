/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
    Alert, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, Tabs, TextField, Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import PlayArrowIcon from '@mui/icons-material/PlayArrowRounded'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import StyledTextField from '@components/general/input/StyledTextField'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { useGetData } from '@hooks/useGetData'
import { usePostData } from '@hooks/usePostData'
import { useAccessCheck } from '@utility/accessCheck'
import { dateFn } from '@utility/dateConverter'
import { snackbarOpenType } from '@type/snackbarOpen'
import { ResType } from '@type/resType'
import { day, num } from '@components/section/statements/statementFormat'

type Row = {
    kioskID: number; kioskSerial: string; branchName?: string | null; contractID: number; contractName: string
    dueDate: string; createOn: string; status: number; workTaskID?: number | null
    assignedToID?: number | null; assignedToName?: string | null; unassigned: boolean
}
type Plan = { asOf: string; rows: Row[]; kiosksWithoutStart: number; contractsInPlan: number; kiosksInPlan: number }
type Status = { jobEnabled: boolean; runAtHour: number; catchUpDays: number; lastRunAt?: string | null; lastRunCreated?: number | null; nextRunAt?: string | null }
type Run = { id: number; startedAt: string; finishedAt?: string | null; trigger: string; userID?: number | null; created: number; unassigned: number; skipped: number; failed: number; message?: string | null }
type RunResult = { created: number; unassigned: number; skipped: number; failed: number; truncated: boolean }

// the server's VisitPlanStatus
const CREATE = 1, UPCOMING = 2, GENERATED = 3, EXISTING = 4
const STATUS: Record<number, { label: string; color: 'warning' | 'default' | 'success' | 'info' }> = {
    [CREATE]: { label: 'باید ساخته شود', color: 'warning' },
    [UPCOMING]: { label: 'پیش‌رو', color: 'info' },
    [GENERATED]: { label: 'ساخته‌شده', color: 'success' },
    [EXISTING]: { label: 'قبلاً ثبت شده', color: 'default' },
}

// the theme's button variants have a fixed height; one explicit size keeps labels from wrapping and being clipped
const btnSx = { height: 'auto', minHeight: 38, px: 2.5, py: 1, fontSize: 14, whiteSpace: 'nowrap', gap: 0.5 } as const

/**
 * The periodic visit plan: every visit around today, what will be created, what already exists, and a button to create the due
 * ones now. The list is the server's dry run, so "باید ساخته شود" rows are exactly what the button creates.
 */
const PeriodicVisitsPage = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { accessCheck } = useAccessCheck()
    const canRun = accessCheck({ accessInfoId: 270, KindAccessInfo: 'writeAccess' })
    const canOpenTask = accessCheck({ accessInfoId: 111, KindAccessInfo: 'readAccess' })
    const canOpenKiosk = accessCheck({ accessInfoId: 110, KindAccessInfo: 'readAccess' })

    const [tab, setTab] = useState<'plan' | 'runs'>('plan')
    const [look, setLook] = useState(60)
    const [contract, setContract] = useState<number | ''>('')
    const [filter, setFilter] = useState<number | 0>(0)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)
    const [per, setPer] = useState(25)
    const [confirm, setConfirm] = useState(false)

    const plan = useGetData<Plan>(`api/PeriodicVisit/Plan?lookaheadDays=${look}`, 'visit-plan', { ids: [String(look)] })
    const status = useGetData<Status>('api/PeriodicVisit/Status', 'visit-status')
    const runs = useGetData<Run[]>('api/PeriodicVisit/Runs?take=30', 'visit-runs', { enabled: tab === 'runs' })
    const run = usePostData<{ contractID?: number }, ResType & { value?: RunResult }>('api/PeriodicVisit/Run', 'visit-run')

    const rows = useMemo(() => plan.data?.value?.rows ?? [], [plan.data])
    const contracts = useMemo(() => Array.from(new Map(rows.map((r) => [r.contractID, r.contractName])).entries()), [rows])
    const inContract = useMemo(() => rows.filter((r) => contract === '' || r.contractID === contract), [rows, contract])
    const count = (s: number) => inContract.filter((r) => r.status === s).length
    const shown = useMemo(() => {
        const q = search.trim().toLowerCase()
        return inContract.filter((r) => (filter === 0 || r.status === filter) &&
            (!q || `${r.kioskSerial} ${r.branchName ?? ''} ${r.contractName} ${r.assignedToName ?? ''}`.toLowerCase().includes(q)))
    }, [inContract, filter, search])
    const pageRows = shown.slice(page * per, page * per + per)

    const toCreate = inContract.filter((r) => r.status === CREATE)
    const toCreateUnassigned = toCreate.filter((r) => r.unassigned).length

    const refresh = () => { plan.refetch(); status.refetch(); if (tab === 'runs') runs.refetch() }
    const doRun = () =>
        run.mutateAsync({ contractID: contract === '' ? undefined : contract }).then((res) => {
            setConfirm(false)
            if (res.error === 0 && res.value) {
                snackbarOpen(`${num(res.value.created)} فعالیت بازدید ساخته شد` + (res.value.failed ? ` (${num(res.value.failed)} مورد ناموفق)` : ''),
                    res.value.failed ? SNACKBAR_SEVERITIES.WARNING : SNACKBAR_SEVERITIES.SUCCESS)
                refresh()
            } else snackbarOpen(`${res.errorMessage}`, SNACKBAR_SEVERITIES.ERROR)
        }).catch((e: Error) => { setConfirm(false); snackbarOpen(e.message, SNACKBAR_SEVERITIES.ERROR) })

    if (plan.isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', height: '50vh', width: '100%' }}><CustomCircularProgress thickness={2} size={50} /></Box>
    if (plan.data && plan.data.error !== 0) return <Alert severity="error" sx={{ m: 3, width: '100%' }}>{plan.data.errorMessage}</Alert>

    const st = status.data?.value
    const p = plan.data?.value
    const card = { borderRadius: 3, border: '1px solid', borderColor: 'divider' } as const

    return (
        <Box sx={{ width: '100%', p: { xs: 1, md: 1 }, pb: 10 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5} sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>بازدیدهای دوره‌ای</Typography>
                    <Typography variant="caption" color="text.secondary">فعالیت بازدید هر کیوسک بر اساس قرارداد ساخته می‌شود؛ هیچ بازدیدی دوبار ساخته نمی‌شود.</Typography>
                </Box>
                {canRun && (
                    <Button variant="main" startIcon={<PlayArrowIcon />} sx={btnSx} disabled={toCreate.length === 0 || run.isPending} onClick={() => setConfirm(true)}>
                        {toCreate.length === 0 ? 'بازدید موعد رسیده‌ای نیست' : `ساخت بازدیدهای موعد رسیده (${num(toCreate.length)})`}
                    </Button>
                )}
            </Stack>

            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip color={st?.jobEnabled ? 'success' : 'default'} variant="outlined"
                    label={st?.jobEnabled ? `ساخت خودکار روزانه: روشن (ساعت ${num(st.runAtHour)})` : 'ساخت خودکار روزانه: خاموش (فقط با دکمه)'} />
                {st?.lastRunAt && <Chip variant="outlined" label={`آخرین اجرا: ${dateFn(st.lastRunAt)} - ${num(st.lastRunCreated ?? 0)} فعالیت`} />}
                {st?.jobEnabled && st.nextRunAt && <Chip variant="outlined" label={`اجرای بعدی: ${dateFn(st.nextRunAt)}`} />}
                {p && <Chip variant="outlined" label={`${num(p.kiosksInPlan)} کیوسک از ${num(p.contractsInPlan)} قرارداد`} />}
            </Stack>

            {!!p?.kiosksWithoutStart && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {num(p.kiosksWithoutStart)} کیوسک در برنامه نیستند چون تاریخ شروع ندارند (تاریخ نصب کیوسک یا تاریخ شروع قرارداد را کامل کنید).
                </Alert>
            )}
            {toCreateUnassigned > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {num(toCreateUnassigned)} بازدید موعد رسیده کیوسکی دارد که مسئول پیش‌فرض ندارد؛ فعالیت آن بدون ارجاع ساخته می‌شود و باید ارجاع داده شود.
                </Alert>
            )}

            <Paper elevation={0} sx={{ ...card, overflow: 'hidden' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Tab value="plan" label="برنامه" />
                    <Tab value="runs" label="سابقه‌ی اجرا" />
                </Tabs>

                {tab === 'plan' ? (
                    <>
                        <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} alignItems={{ md: 'center' }} flexWrap="wrap" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <StyledTextField size="small" label="جستجو" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} sx={{ width: { md: 220 } }} />
                            <TextField select size="small" label="قرارداد" value={contract} onChange={(e) => { setContract(e.target.value === '' ? '' : Number(e.target.value)); setPage(0) }} sx={{ minWidth: 200 }}>
                                <MenuItem value="">همه‌ی قراردادها</MenuItem>
                                {contracts.map(([id, name]) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                            </TextField>
                            <TextField select size="small" label="نمایش تا" value={look} onChange={(e) => { setLook(Number(e.target.value)); setPage(0) }} sx={{ minWidth: 150 }}>
                                {[30, 60, 120, 200].map((d) => <MenuItem key={d} value={d}>{num(d)} روز آینده</MenuItem>)}
                            </TextField>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                                <Chip label={`همه (${num(inContract.length)})`} clickable color={filter === 0 ? 'primary' : 'default'} variant={filter === 0 ? 'filled' : 'outlined'} onClick={() => { setFilter(0); setPage(0) }} />
                                {[CREATE, UPCOMING, GENERATED, EXISTING].map((s) => (
                                    <Chip key={s} label={`${STATUS[s].label} (${num(count(s))})`} clickable color={filter === s ? 'primary' : 'default'} variant={filter === s ? 'filled' : 'outlined'} onClick={() => { setFilter(s); setPage(0) }} />
                                ))}
                            </Stack>
                        </Stack>
                        <TableContainer sx={{ maxHeight: 'calc(100vh - 430px)', minHeight: 200 }}>
                            <Table stickyHeader sx={{ '& .MuiTableCell-head': { fontWeight: 700, bgcolor: 'background.paper', whiteSpace: 'nowrap' }, '& .MuiTableCell-root': { py: 1 } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>کیوسک</TableCell><TableCell>قرارداد</TableCell><TableCell>موعد بازدید</TableCell><TableCell>تاریخ ساخت فعالیت</TableCell>
                                        <TableCell>وضعیت</TableCell><TableCell>مسئول</TableCell><TableCell>فعالیت</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pageRows.map((r) => (
                                        <TableRow key={`${r.kioskID}-${r.dueDate}`} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700}
                                                    sx={{ cursor: canOpenKiosk ? 'pointer' : 'default', color: canOpenKiosk ? 'primary.main' : 'inherit' }}
                                                    onClick={canOpenKiosk ? () => navigate({ to: `/kioskDetail/${r.kioskID}` }) : undefined}>{r.kioskSerial}</Typography>
                                                {r.branchName && <Typography variant="caption" color="text.secondary">{r.branchName}</Typography>}
                                            </TableCell>
                                            <TableCell>{r.contractName}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{day(r.dueDate)}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{day(r.createOn)}</TableCell>
                                            <TableCell><Chip size="small" color={STATUS[r.status].color} variant={r.status === EXISTING ? 'outlined' : 'filled'} label={STATUS[r.status].label} /></TableCell>
                                            <TableCell>
                                                {r.unassigned ? <Chip size="small" variant="outlined" color="warning" label="بدون مسئول" /> : (r.assignedToName || `#${r.assignedToID}`)}
                                            </TableCell>
                                            <TableCell>
                                                {r.workTaskID ? (
                                                    <Typography variant="body2" sx={{ cursor: canOpenTask ? 'pointer' : 'default', color: canOpenTask ? 'primary.main' : 'inherit' }}
                                                        onClick={canOpenTask ? () => navigate({ to: `/workTaskDetail/${r.workTaskID}` }) : undefined}>{`#${r.workTaskID}`}</Typography>
                                                ) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {shown.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>بازدیدی پیدا نشد</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination component="div" count={shown.length} page={page} onPageChange={(_, v) => setPage(v)} rowsPerPage={per}
                            onRowsPerPageChange={(e) => { setPer(Number(e.target.value)); setPage(0) }} rowsPerPageOptions={[25, 50, 100]} labelRowsPerPage="تعداد در صفحه" />
                    </>
                ) : (
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 330px)', minHeight: 200 }}>
                        {runs.isLoading ? <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}><CustomCircularProgress thickness={2} size={36} /></Box> : (
                            <Table stickyHeader sx={{ '& .MuiTableCell-head': { fontWeight: 700, bgcolor: 'background.paper', whiteSpace: 'nowrap' }, '& .MuiTableCell-root': { py: 1 } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>زمان</TableCell><TableCell>اجرا توسط</TableCell><TableCell>ساخته شد</TableCell><TableCell>بدون مسئول</TableCell>
                                        <TableCell>رد شد</TableCell><TableCell>ناموفق</TableCell><TableCell>پیام</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(runs.data?.value ?? []).map((r) => (
                                        <TableRow key={r.id} hover>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{dateFn(r.startedAt)}</TableCell>
                                            <TableCell><Chip size="small" variant="outlined" label={r.trigger === 'schedule' ? 'خودکار (روزانه)' : 'دستی'} /></TableCell>
                                            <TableCell>{num(r.created)}</TableCell>
                                            <TableCell>{num(r.unassigned)}</TableCell>
                                            <TableCell>{num(r.skipped)}</TableCell>
                                            <TableCell sx={{ color: r.failed ? 'error.main' : undefined }}>{num(r.failed)}</TableCell>
                                            <TableCell>{r.message ?? '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(runs.data?.value ?? []).length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>هنوز اجرایی انجام نشده است</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={confirm} onClose={() => !run.isPending && setConfirm(false)} fullWidth maxWidth="sm">
                <DialogTitle>ساخت بازدیدهای موعد رسیده</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {num(toCreate.length)} فعالیت بازدید ساخته می‌شود{contract !== '' ? ` (قرارداد ${contracts.find(([id]) => id === contract)?.[1]})` : ''}.
                    </Typography>
                    {toCreateUnassigned > 0 && <Typography variant="body2" color="text.secondary">{num(toCreateUnassigned)} مورد بدون مسئول ساخته می‌شود و باید ارجاع داده شود.</Typography>}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>به هر مسئول یک پیام (در بله) درباره‌ی فعالیت‌هایش ارسال می‌شود. ساخت دوباره‌ی همین بازدیدها ممکن نیست.</Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    <Button variant="cancel" sx={btnSx} disabled={run.isPending} onClick={() => setConfirm(false)}>انصراف</Button>
                    <Button variant="main" sx={btnSx} disabled={run.isPending} onClick={doRun}>
                        {run.isPending ? <CustomCircularProgress size={18} color="white.0" /> : 'ساخت فعالیت‌ها'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PeriodicVisitsPage
