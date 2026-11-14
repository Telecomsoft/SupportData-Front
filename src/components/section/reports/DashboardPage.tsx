/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Box, Button, IconButton, Paper, Skeleton, Tooltip, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import TimerIcon from '@mui/icons-material/TimerOutlined'
import VerifiedIcon from '@mui/icons-material/VerifiedUserOutlined'
import EventBusyIcon from '@mui/icons-material/EventBusyOutlined'
import SwapIcon from '@mui/icons-material/SwapHorizOutlined'
import BuildIcon from '@mui/icons-material/BuildOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { num } from '@components/section/statements/statementFormat'
import { TASK_STATES, TASK_STATE_COLOR } from '@src/data/type/lookups'

type Dict = Record<string, string>
type Tone = 'primary' | 'error' | 'warning' | 'success' | 'info'

/** One number on the page. A click opens the list it counts (when the user may open it). */
const StatCard = ({ label, value, hint, icon, tone = 'primary', to }: { label: string; value: string; hint?: string; icon: ReactNode; tone?: Tone; to?: string }) => {
    const navigate = useNavigate()
    return (
        <Paper
            elevation={0}
            onClick={to ? () => navigate({ to }) : undefined}
            sx={(t) => ({
                p: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                cursor: to ? 'pointer' : 'default',
                transition: 'box-shadow .15s, border-color .15s',
                '&:hover': to ? { borderColor: t.palette[tone].main, boxShadow: `0 2px 10px ${t.palette[tone].main}22` } : undefined,
            })}
        >
            <Box
                sx={(t) => ({
                    width: 46, height: 46, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    color: t.palette[tone].main, bgcolor: `${t.palette[tone].main}18`,
                })}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>{label}</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.3, color: tone === 'primary' ? 'text.primary' : `${tone}.main` }}>{value}</Typography>
                {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
            </Box>
        </Paper>
    )
}

type Item = { name: string; count: number; color?: string }

/**
 * A ranked list: the name, a bar as long as its share of the biggest one, and the number. Plain HTML instead of a chart library,
 * so it reads the same in right-to-left (the chart put the names on top of the bars) and long names get their own line.
 */
const RankBars = ({ title, subtitle, data, limit = 8 }: { title: string; subtitle?: string; data: Item[]; limit?: number }) => {
    const theme = useTheme()
    const [all, setAll] = useState(false)
    const rows = all ? data : data.slice(0, limit)
    const max = Math.max(1, ...data.map((d) => d.count))
    return (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            {data.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>داده‌ای برای نمایش نیست</Typography>
            ) : (
                <Box sx={{ mt: 1.5, display: 'grid', gap: 1.25 }}>
                    {rows.map((r) => (
                        <Box key={r.name} sx={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 36%) 1fr 44px', alignItems: 'center', gap: 1.5 }}>
                            <Tooltip title={r.name} placement="top-start">
                                <Typography variant="body2" noWrap>{r.name}</Typography>
                            </Tooltip>
                            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover', overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', width: `${Math.max(3, (r.count / max) * 100)}%`, borderRadius: 5, bgcolor: r.color ?? theme.palette.primary.main }} />
                            </Box>
                            <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'end' }}>{num(r.count)}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
            {data.length > limit && (
                <Button size="small" onClick={() => setAll((v) => !v)} sx={{ mt: 1.5 }}>
                    {all ? 'نمایش کمتر' : `نمایش همه (${num(data.length)})`}
                </Button>
            )}
        </Paper>
    )
}

const SkeletonPage = () => (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton width={140} height={36} sx={{ mb: 2 }} />
        <Grid container spacing={2} sx={{ mb: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}><Skeleton variant="rounded" height={92} /></Grid>)}
        </Grid>
        <Grid container spacing={2}>
            {Array.from({ length: 2 }).map((_, i) => <Grid key={i} size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" height={260} /></Grid>)}
        </Grid>
    </Box>
)

/**
 * The home dashboard (GET api/Report/Dashboard): open tasks by state and technician, overdue tasks, the average time to finish,
 * the most picked errors, warranty counts, pending part movements and open repairs. A customer user gets their own
 * numbers only (and no errors, parts or repairs), so those cards are not shown to them.
 */
const DashboardPage = () => {
    const theme = useTheme()
    const { isCustomer } = useUserScope()
    const { accessCheck } = useAccessCheck()
    const dashboard = useGetData<any>('api/Report/Dashboard', 'rp-dashboard')
    // the state names come from the server (shared cache key with the work task screens); the built-in list is the fallback
    const enums = useGetData<{ states?: Dict }>('api/WorkTask/Lookups', 'wt-enums')

    if (dashboard.isLoading) return <SkeletonPage />
    const d = dashboard.data?.value
    if (!d) {
        return (
            <Alert severity="error" sx={{ m: 3 }} action={<Button color="inherit" size="small" onClick={() => dashboard.refetch()}>تلاش دوباره</Button>}>
                {dashboard.data?.errorMessage ?? 'دریافت داشبورد انجام نشد'}
            </Alert>
        )
    }

    const stateName = (id: number) =>
        enums.data?.value?.states?.[String(id)] ?? TASK_STATES.find((s) => s.id === id)?.name ?? String(id)
    const stateColor = (id: number) => {
        const c = TASK_STATE_COLOR[id]
        return c && c !== 'default' ? (theme.palette as any)[c]?.main : theme.palette.grey[500]
    }
    const byState: Item[] = Object.entries(d.openTasksByState ?? {})
        .map(([id, count]) => ({ name: stateName(Number(id)), count: count as number, color: stateColor(Number(id)) }))
        .sort((a, b) => b.count - a.count)
    const openTotal = byState.reduce((a, s) => a + s.count, 0)
    // a technician called "." (or empty) is how the old data marks "nobody in particular"
    const byTech: Item[] = (d.openTasksByTechnician ?? []).map((t: any) => ({ name: (t.name ?? '').trim().length > 1 ? t.name : 'بدون ارجاع مشخص', count: t.count }))
    const topErrors: Item[] = (d.topErrorsLast30Days ?? []).map((t: any) => ({ name: t.name, count: t.count, color: theme.palette.warning.main }))

    const link = (accessID: number, path: string) => (accessCheck({ accessInfoId: accessID, KindAccessInfo: 'readAccess' }) ? path : undefined)
    const updated = new Date(dashboard.dataUpdatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>داشبورد</Typography>
                    <Typography variant="caption" color="text.secondary">آخرین بروزرسانی: {updated}</Typography>
                </Box>
                <Tooltip title="بروزرسانی">
                    <span>
                        <IconButton onClick={() => dashboard.refetch()} disabled={dashboard.isFetching} aria-label="بروزرسانی">
                            {dashboard.isFetching ? <CustomCircularProgress thickness={3} size={20} /> : <RefreshIcon />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            {/* what needs attention */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="فعالیت‌های باز" value={num(openTotal)} icon={<AssignmentIcon />} tone="primary" to={link(111, '/workTasksList')} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        label="فعالیت‌های دیرکرد"
                        value={num(d.overdueTasks)}
                        hint={d.overdueTasks > 0 ? 'نیاز به پیگیری' : 'همه در مهلت'}
                        icon={d.overdueTasks > 0 ? <WarningIcon /> : <CheckIcon />}
                        tone={d.overdueTasks > 0 ? 'error' : 'success'}
                        to={link(111, '/workTasksList')}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard label="میانگین زمان تا اتمام" value={`${num(d.avgHoursToFinishLast30Days)} ساعت`} hint="۳۰ روز اخیر" icon={<TimerIcon />} tone="info" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        label="گارانتی در حال اتمام"
                        value={num(d.kiosksWarrantyEndingIn30Days)}
                        hint="۳۰ روز آینده"
                        icon={<EventBusyIcon />}
                        tone={d.kiosksWarrantyEndingIn30Days > 0 ? 'warning' : 'success'}
                    />
                </Grid>
            </Grid>

            {/* the rest of the numbers */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid size={{ xs: 12, sm: isCustomer ? 12 : 4 }}>
                    <StatCard label="کیوسک‌های تحت گارانتی" value={num(d.kiosksUnderWarranty)} icon={<VerifiedIcon />} tone="success" to={link(110, '/kiosksList')} />
                </Grid>
                {!isCustomer && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <StatCard label="انتقال‌های قطعه در انتظار" value={num(d.partTransfersPending)} icon={<SwapIcon />} tone="info" to={link(112, '/partTransfersList')} />
                    </Grid>
                )}
                {!isCustomer && (
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <StatCard label="تعمیرات باز" value={num(d.repairsOpen)} icon={<BuildIcon />} tone="primary" to={link(113, '/repairsList')} />
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}><RankBars title="فعالیت‌های باز بر اساس وضعیت" data={byState} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><RankBars title="فعالیت‌های باز بر اساس تکنسین" subtitle="بیشترین بار کاری در بالا" data={byTech} /></Grid>
                {!isCustomer && (
                    <Grid size={{ xs: 12 }}><RankBars title="پرتکرارترین خطاها" subtitle="۳۰ روز اخیر" data={topErrors} limit={10} /></Grid>
                )}
            </Grid>
        </Box>
    )
}

export default DashboardPage
