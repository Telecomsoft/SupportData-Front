/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, Button, Chip, Divider, IconButton, Paper, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { snackbarOpenType } from '@type/snackbarOpen'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import PartTransferStateChip from '@components/section/partTransfers/PartTransferStateChip'
import PartTransferActionDialog from '@components/section/partTransfers/PartTransferActionDialog'
import { usePartTransferLookups } from '@hooks/usePartTransferLookups'
import { usePartTransferRules } from '@hooks/usePartTransferRules'
import { useGetData } from '@hooks/useGetData'
import { useDevice } from '@hooks/useDevice'
import { dateFn } from '@utility/dateConverter'
import { nameOf } from '@src/data/type/lookups'

const date = (d?: string | null) => (d ? dateFn(d) : '-')
const text = (v?: string | number | null) => (v === null || v === undefined || v === '' ? '-' : String(v))

/** One movement: its details, its history (GET api/PartTransfer/GetPartTransfer sends the log with it) and complete / cancel. */
const PartTransferDetailPage = ({ id, snackbarOpen }: { id: number; snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const lookups = usePartTransferLookups()
    const rules = usePartTransferRules()

    const query = useGetData<any>(`api/PartTransfer/GetPartTransfer/${id}`, 'part-transfer-detail', { ids: [String(id)] })
    const t = query.data?.value

    const [tab, setTab] = useState<'info' | 'log'>('info')
    const [action, setAction] = useState<'complete' | 'cancel' | null>(null)

    if (query.isLoading || lookups.isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CustomCircularProgress thickness={2} size={60} />
            </Box>
        )
    }
    if (!t) {
        return (
            <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">{query.data?.errorMessage ?? 'انتقال پیدا نشد'}</Typography>
            </Paper>
        )
    }

    const loc = (l: number) => nameOf(lookups.options.locations, l) || String(l)
    const link = (label: string, onClick?: () => void) =>
        onClick ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={onClick}>{label}</Button> : <Typography variant="body2">{label}</Typography>
    const cell = (label: string, node: React.ReactNode) => (
        <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Box>{typeof node === 'string' ? <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{node}</Typography> : node}</Box>
        </Grid>
    )

    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: 'auto', md: 'calc(100vh - 120px)' },
                display: 'flex', flexDirection: 'column',
                pb: isMobile ? 12 : 2, px: { xs: 2, md: 3 }, pt: 2, overflow: 'hidden',
            }}
        >
            {/* header: fixed, no scroll */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
                    <Stack direction="row" alignItems="center" gap={2}>
                        <IconButton onClick={() => navigate({ to: '/partTransfersList' })} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' }, borderRadius: 2 }}>
                            <ArrowForwardIcon />
                        </IconButton>
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">انتقال #{t.id}</Typography>
                                <Chip size="small" variant="outlined" label={t.kindName ?? '-'} />
                                <PartTransferStateChip transfer={t} />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{t.deviceModelName} × {t.quantity} — از {loc(t.fromLocation)} به {loc(t.toLocation)}</Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        {rules.canComplete(t) && (
                            <Button startIcon={<DoneAllIcon />} variant="contained" onClick={() => setAction('complete')} sx={{ borderRadius: 2, boxShadow: 'none' }}>تکمیل</Button>
                        )}
                        {rules.canCancel(t) && (
                            <Button startIcon={<CancelOutlinedIcon />} variant="outlined" color="error" onClick={() => setAction('cancel')} sx={{ borderRadius: 2 }}>لغو</Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* tabs */}
            <Paper elevation={0} sx={{ mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', flexShrink: 0 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        '& .MuiTabs-indicator': { height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: 'primary.main' },
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 46, color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } },
                    }}
                >
                    <Tab value="info" label="مشخصات کلی" />
                    <Tab value="log" label="تاریخچه" />
                </Tabs>
            </Paper>

            {/* tab content: own scroll */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1, overflowY: 'auto', borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', p: 3, mb: 2,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.02)',
                    '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '4px' },
                }}
            >
                {tab === 'info' && (
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>مشخصات انتقال</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {cell('نوع', text(t.kindName))}
                            {cell('وضعیت', text(t.stateName))}
                            {cell('مسیر', `از ${loc(t.fromLocation)} به ${loc(t.toLocation)}`)}
                            {cell('مدل قطعه', text(t.deviceModelName))}
                            {cell('تعداد', text(t.quantity))}
                            {cell('تکنسین', text(t.technicianName))}
                        </Grid>
                        <Typography variant="body2" color="text.secondary" component="div">سریال‌ها</Typography>
                        <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mb: 2 }}>
                            {(t.serials ?? []).length === 0 ? '-' : (t.serials as string[]).map((s) => <Chip key={s} size="small" variant="outlined" label={s} sx={{ direction: 'ltr' }} />)}
                        </Stack>

                        <Typography variant="subtitle2" fontWeight={700}>ارتباط‌ها</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {cell('کیوسک', t.kioskID ? link(`کیوسک #${t.kioskID}`, rules.canOpenKiosk ? () => navigate({ to: `/kioskDetail/${t.kioskID}` }) : undefined) : '-')}
                            {cell('دستورکار', t.workTaskID ? link(`#${t.workTaskID}`, rules.canOpenWorkTask ? () => navigate({ to: `/workTaskDetail/${t.workTaskID}` }) : undefined) : '-')}
                            {cell('تعمیر', t.repairID ? link(`#${t.repairID}`, rules.canOpenRepair ? () => navigate({ to: `/repairDetail/${t.repairID}` }) : undefined) : '-')}
                        </Grid>

                        <Typography variant="subtitle2" fontWeight={700}>زمان‌ها</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {cell('زمان ثبت', date(t.createdAt))}
                            {cell('زمان انجام', date(t.doneAt))}
                        </Grid>

                        <Typography variant="subtitle2" fontWeight={700}>توضیحات</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text(t.description)}</Typography>
                    </Box>
                )}

                {tab === 'log' && (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow><TableCell>زمان</TableCell><TableCell>تغییر وضعیت</TableCell><TableCell>کاربر</TableCell><TableCell>توضیح</TableCell></TableRow>
                            </TableHead>
                            <TableBody>
                                {(t.logs ?? []).map((l: any) => (
                                    <TableRow key={l.id}>
                                        <TableCell>{dateFn(l.changedAt)}</TableCell>
                                        <TableCell>{`${nameOf(lookups.options.states, l.oldState) || '-'}  ←  ${nameOf(lookups.options.states, l.newState)}`}</TableCell>
                                        <TableCell>{l.userName ?? '-'}</TableCell>
                                        <TableCell>{l.note ?? '-'}</TableCell>
                                    </TableRow>
                                ))}
                                {(t.logs ?? []).length === 0 && <TableRow><TableCell colSpan={4} align="center">سابقه‌ای ثبت نشده است</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>

            {action && (
                <PartTransferActionDialog action={action} transfer={t} close={() => setAction(null)} onDone={() => { setAction(null); query.refetch() }} snackbarOpen={snackbarOpen} />
            )}
        </Box>
    )
}

export default PartTransferDetailPage
