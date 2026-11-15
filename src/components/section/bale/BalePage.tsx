/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import {
    Alert, Avatar, Box, Checkbox, Chip, FormControlLabel, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import StyledTextField from '@components/general/input/StyledTextField'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { useGetData } from '@hooks/useGetData'
import { usePostData } from '@hooks/usePostData'
import { useAccessCheck } from '@utility/accessCheck'
import { dateFn } from '@utility/dateConverter'
import { nameOf, USER_TYPES } from '@src/data/type/lookups'
import { snackbarOpenType } from '@type/snackbarOpen'
import { ResType } from '@type/resType'
import { num } from '@components/section/statements/statementFormat'
import BaleLinkDialog from './BaleLinkDialog'

type Row = {
    userID: number; userName: string; personName?: string | null; userType: number
    linked: boolean; displayName?: string | null; linkedAt?: string | null; lastActivityAt?: string | null
}

/**
 * Who is linked to the Bale bot, a QR code for each person who is not, and a form to send them a message
 * (optionally with the printed form of a task). Only linked people can receive anything.
 */
const BalePage = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const { accessCheck } = useAccessCheck()
    const canSend = accessCheck({ accessInfoId: 260, KindAccessInfo: 'writeAccess' })
    const accounts = useGetData<Row[]>('api/Bale/Accounts', 'bale-accounts')
    const send = usePostData<any, ResType & { value?: number }>('api/Bale/Send', 'bale-send')

    const [picked, setPicked] = useState<number[]>([])
    const [text, setText] = useState('')
    const [taskId, setTaskId] = useState('')
    const [pdf, setPdf] = useState(false)
    const [qrFor, setQrFor] = useState<Row | null>(null)

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'linked' | 'unlinked'>('all')

    const rows = useMemo(() => accounts.data?.value ?? [], [accounts.data])
    const linkedRows = rows.filter((r) => r.linked)
    const shown = useMemo(() => {
        const q = search.trim().toLowerCase()
        return rows.filter((r) =>
            (filter === 'all' || (filter === 'linked') === r.linked) &&
            (!q || `${r.userName} ${r.personName ?? ''} ${r.displayName ?? ''}`.toLowerCase().includes(q)))
    }, [rows, search, filter])
    const shownLinked = shown.filter((r) => r.linked)
    const toggle = (id: number) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    const allPicked = shownLinked.length > 0 && shownLinked.every((r) => picked.includes(r.userID))
    const pickAll = () => setPicked((p) => (allPicked ? p.filter((id) => !shownLinked.some((r) => r.userID === id)) : Array.from(new Set([...p, ...shownLinked.map((r) => r.userID)]))))

    const submit = () =>
        send.mutateAsync({ userIDs: picked, text, workTaskID: taskId ? Number(taskId) : null, attachPdf: pdf && !!taskId }).then((res) => {
            if (res.error === 0) {
                snackbarOpen(`پیام برای ${num(res.value ?? 0)} نفر در صف ارسال قرار گرفت`, SNACKBAR_SEVERITIES.SUCCESS)
                setText(''); setTaskId(''); setPdf(false)
            } else snackbarOpen(`${res.errorMessage}`, SNACKBAR_SEVERITIES.ERROR)
        }).catch((e: Error) => snackbarOpen(e.message, SNACKBAR_SEVERITIES.ERROR))

    if (accounts.isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', height: '50vh', width: '100%' }}><CustomCircularProgress thickness={2} size={50} /></Box>
    if (accounts.data && accounts.data.error !== 0) return <Alert severity="error" sx={{ m: 3, width: '100%' }}>{accounts.data.errorMessage}</Alert>

    const card = { borderRadius: 3, border: '1px solid', borderColor: 'divider' } as const

    return (
        <Box sx={{ width: '100%', p: { xs: 1, md: 1 }, pb: 10 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>ربات بله</Typography>
                    <Typography variant="caption" color="text.secondary">اتصال کاربران به بله، دریافت اعلان و ارسال پیام</Typography>
                </Box>
                <Stack direction="row" gap={1}>
                    <Chip color="success" variant="outlined" label={`متصل: ${num(linkedRows.length)}`} />
                    <Chip variant="outlined" label={`متصل نیست: ${num(rows.length - linkedRows.length)}`} />
                </Stack>
            </Stack>

            <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12, lg: canSend ? 8 : 12 }}>
                    <Paper elevation={0} sx={{ ...card, overflow: 'hidden' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <StyledTextField size="small" label="جستجوی کاربر" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, maxWidth: { sm: 320 } }} />
                            <Stack direction="row" gap={1}>
                                {([['all', 'همه'], ['linked', 'متصل'], ['unlinked', 'متصل نیست']] as const).map(([k, l]) => (
                                    <Chip key={k} label={l} clickable color={filter === k ? 'primary' : 'default'} variant={filter === k ? 'filled' : 'outlined'} onClick={() => setFilter(k)} />
                                ))}
                            </Stack>
                        </Stack>
                        <TableContainer sx={{ maxHeight: 'calc(100vh - 330px)', minHeight: 200 }}>
                            <Table stickyHeader sx={{ '& .MuiTableCell-head': { fontWeight: 700, bgcolor: 'background.paper', whiteSpace: 'nowrap' }, '& .MuiTableCell-root': { py: 1 } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Tooltip title="انتخاب همه‌ی متصل‌ها">
                                                <span>
                                                    <Checkbox checked={allPicked} indeterminate={picked.length > 0 && !allPicked} onChange={pickAll} disabled={shownLinked.length === 0} />
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>کاربر</TableCell>
                                        <TableCell>نوع</TableCell>
                                        <TableCell>وضعیت</TableCell>
                                        <TableCell>آخرین فعالیت</TableCell>
                                        <TableCell align="center">اتصال</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shown.map((r) => (
                                        <TableRow key={r.userID} hover selected={picked.includes(r.userID)}>
                                            <TableCell padding="checkbox"><Checkbox checked={picked.includes(r.userID)} onChange={() => toggle(r.userID)} disabled={!r.linked} /></TableCell>
                                            <TableCell>
                                                <Stack direction="row" gap={1.5} alignItems="center">
                                                    <Avatar sx={{ width: 34, height: 34, fontSize: 14, bgcolor: r.linked ? 'success.main' : 'grey.400' }}>{(r.personName || r.userName).trim().charAt(0).toUpperCase()}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700}>{r.userName}</Typography>
                                                        {r.personName && <Typography variant="caption" color="text.secondary">{r.personName}</Typography>}
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{nameOf(USER_TYPES, r.userType) || '-'}</TableCell>
                                            <TableCell>{r.linked ? <Chip size="small" color="success" label={r.displayName ? `متصل (${r.displayName})` : 'متصل'} /> : <Chip size="small" variant="outlined" label="متصل نیست" />}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.lastActivityAt ? dateFn(r.lastActivityAt) : '-'}</TableCell>
                                            <TableCell align="center">
                                                <Button size="small" variant={r.linked ? 'outlined' : 'contained'} startIcon={<QrCode2Icon />} onClick={() => setQrFor(r)} sx={{ whiteSpace: 'nowrap', gap: 0.5 }}>
                                                    {r.linked ? 'مدیریت' : 'کد QR'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {shown.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>کاربری پیدا نشد</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {canSend && (
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper elevation={0} sx={{ ...card, p: 2.5, position: { lg: 'sticky' }, top: { lg: 0 } }}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>ارسال پیام</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                گیرنده‌ها را از فهرست انتخاب کنید. فقط کسانی که به بله متصل‌اند قابل انتخاب هستند.
                            </Typography>
                            <Stack gap={2}>
                                <StyledTextField label="متن پیام" multiline minRows={4} value={text} onChange={(e) => setText(e.target.value)} />
                                <StyledTextField size="small" label="شماره فعالیت (اختیاری)" value={taskId} onChange={(e) => setTaskId(e.target.value.replace(/\D/g, ''))} />
                                <FormControlLabel control={<Checkbox checked={pdf} onChange={(e) => setPdf(e.target.checked)} disabled={!taskId} />} label="فرم PDF فعالیت هم ارسال شود" />
                                <Button variant="main" onClick={submit} disabled={send.isPending || picked.length === 0 || (!text.trim() && !(pdf && taskId))} fullWidth>
                                    {send.isPending ? <CustomCircularProgress size={18} color="white.0" /> : picked.length === 0 ? 'گیرنده‌ای انتخاب نشده' : `ارسال به ${num(picked.length)} نفر`}
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {qrFor && <BaleLinkDialog open close={() => setQrFor(null)} snackbarOpen={snackbarOpen} userID={qrFor.userID} userName={qrFor.userName} />}
        </Box>
    )
}

export default BalePage
