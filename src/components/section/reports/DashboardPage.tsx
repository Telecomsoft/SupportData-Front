/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router'
import { Alert, Box, Paper, Stack, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { num } from '@components/section/statements/statementFormat'
import { TASK_STATES } from '@src/data/type/lookups'

type Dict = Record<string, string>

/** One number on the page; a click opens the list it counts (when the user may open it). */
const StatCard = ({ label, value, color, to }: { label: string; value: string; color?: string; to?: string }) => {
    const navigate = useNavigate()
    return (
        <Paper
            elevation={0}
            onClick={to ? () => navigate({ to }) : undefined}
            sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', cursor: to ? 'pointer' : 'default', height: '100%', '&:hover': to ? { bgcolor: 'action.hover' } : undefined }}
        >
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: color ?? 'text.primary' }}>{value}</Typography>
        </Paper>
    )
}

/** A horizontal bar chart: one bar per name, the length is the count. */
const BarCard = ({ title, data }: { title: string; data: { name: string; count: number }[] }) => {
    const theme = useTheme()
    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
            {data.length === 0 ? <Typography variant="body2" color="text.secondary">داده‌ای نیست</Typography> : (
                <ResponsiveContainer width="100%" height={Math.max(160, data.length * 34)}>
                    <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" name="تعداد" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Paper>
    )
}

/**
 * The home dashboard (GET api/Report/Dashboard): open tasks by state and technician, overdue tasks, the average time to finish,
 * the most picked errors, warranty counts, pending part movements and open repairs. A customer user gets their own
 * numbers only (and no errors, parts or repairs), so those cards are not shown to them.
 */
const DashboardPage = () => {
    const { isCustomer } = useUserScope()
    const { accessCheck } = useAccessCheck()
    const dashboard = useGetData<any>('api/Report/Dashboard', 'rp-dashboard')
    // the state names come from the server (shared cache key with the work task screens); the built-in list is the fallback
    const enums = useGetData<{ states?: Dict }>('api/WorkTask/Lookups', 'wt-enums')

    if (dashboard.isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CustomCircularProgress thickness={2} size={60} /></Box>
    }
    const d = dashboard.data?.value
    if (!d) return <Alert severity="error" sx={{ m: 3 }}>{dashboard.data?.errorMessage ?? 'دریافت داشبورد انجام نشد'}</Alert>

    const stateName = (id: number) =>
        enums.data?.value?.states?.[String(id)] ?? TASK_STATES.find((s) => s.id === id)?.name ?? String(id)
    const byState = Object.entries(d.openTasksByState ?? {}).map(([id, count]) => ({ name: stateName(Number(id)), count: count as number }))
    const openTotal = byState.reduce((a, s) => a + s.count, 0)

    const link = (accessID: number, path: string) => (accessCheck({ accessInfoId: accessID, KindAccessInfo: 'readAccess' }) ? path : undefined)

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 10 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>داشبورد</Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6, md: 3 }}><StatCard label="فعالیت های باز" value={num(openTotal)} to={link(111, '/workTasksList')} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><StatCard label="فعالیت های دیرکرد" value={num(d.overdueTasks)} color={d.overdueTasks > 0 ? '#d32f2f' : undefined} to={link(111, '/workTasksList')} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><StatCard label="میانگین زمان تا اتمام (۳۰ روز اخیر)" value={`${num(d.avgHoursToFinishLast30Days)} ساعت`} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><StatCard label="کیوسک‌های تحت گارانتی" value={num(d.kiosksUnderWarranty)} to={link(110, '/kiosksList')} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><StatCard label="گارانتی در حال اتمام (۳۰ روز آینده)" value={num(d.kiosksWarrantyEndingIn30Days)} color={d.kiosksWarrantyEndingIn30Days > 0 ? '#ed6c02' : undefined} /></Grid>
                {!isCustomer && <Grid size={{ xs: 6, md: 3 }}><StatCard label="انتقال‌های قطعه در انتظار" value={num(d.partTransfersPending)} to={link(112, '/partTransfersList')} /></Grid>}
                {!isCustomer && <Grid size={{ xs: 6, md: 3 }}><StatCard label="تعمیرات باز" value={num(d.repairsOpen)} to={link(113, '/repairsList')} /></Grid>}
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}><BarCard title="فعالیت های باز بر اساس وضعیت" data={byState} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><BarCard title="فعالیت های باز بر اساس تکنسین" data={(d.openTasksByTechnician ?? []).map((t: any) => ({ name: t.name, count: t.count }))} /></Grid>
                {!isCustomer && (
                    <Grid size={{ xs: 12 }}><BarCard title="پرتکرارترین خطاها (۳۰ روز اخیر)" data={(d.topErrorsLast30Days ?? []).map((t: any) => ({ name: t.name, count: t.count }))} /></Grid>
                )}
            </Grid>
            <Stack sx={{ mt: 1 }}><Typography variant="caption" color="text.secondary">با کلیک روی هر کارت، لیست مربوط باز می‌شود.</Typography></Stack>
        </Box>
    )
}

export default DashboardPage
