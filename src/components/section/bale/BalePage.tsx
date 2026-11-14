/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import {
    Alert, Box, Checkbox, Chip, FormControlLabel, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material'
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

    const rows = useMemo(() => accounts.data?.value ?? [], [accounts.data])
    const linkedRows = rows.filter((r) => r.linked)
    const toggle = (id: number) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    const allPicked = linkedRows.length > 0 && linkedRows.every((r) => picked.includes(r.userID))

    const submit = () =>
        send.mutateAsync({ userIDs: picked, text, workTaskID: taskId ? Number(taskId) : null, attachPdf: pdf && !!taskId }).then((res) => {
            if (res.error === 0) {
                snackbarOpen(`پیام برای ${num(res.value ?? 0)} نفر در صف ارسال قرار گرفت`, SNACKBAR_SEVERITIES.SUCCESS)
                setText(''); setTaskId(''); setPdf(false)
            } else snackbarOpen(`${res.errorMessage}`, SNACKBAR_SEVERITIES.ERROR)
        }).catch((e: Error) => snackbarOpen(e.message, SNACKBAR_SEVERITIES.ERROR))

    if (accounts.isLoading) return <Box sx={{ display: 'grid', placeItems: 'center', height: '50vh' }}><CustomCircularProgress thickness={2} size={50} /></Box>
    if (accounts.data && accounts.data.error !== 0) return <Alert severity="error" sx={{ m: 3 }}>{accounts.data.errorMessage}</Alert>

    return (
        <Box sx={{ p: { xs: 1, md: 0 }, pb: 10 }}>
            <Stack direction="row" alignItems="baseline" gap={2} sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>ربات بله</Typography>
                <Typography variant="body2" color="text.secondary">{num(linkedRows.length)} نفر از {num(rows.length)} کاربر فعال متصل هستند</Typography>
            </Stack>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', mb: 2 }}>
                <TableContainer sx={{ maxHeight: '48vh' }}>
                    <Table size="small" stickyHeader sx={{ '& .MuiTableCell-head': { fontWeight: 700, bgcolor: 'background.paper' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={allPicked}
                                        indeterminate={picked.length > 0 && !allPicked}
                                        onChange={() => setPicked(allPicked ? [] : linkedRows.map((r) => r.userID))}
                                        disabled={linkedRows.length === 0}
                                    />
                                </TableCell>
                                <TableCell>کاربر</TableCell><TableCell>نوع</TableCell><TableCell>وضعیت</TableCell><TableCell>آخرین فعالیت</TableCell><TableCell align="center">QR</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((r) => (
                                <TableRow key={r.userID} hover>
                                    <TableCell padding="checkbox"><Checkbox checked={picked.includes(r.userID)} onChange={() => toggle(r.userID)} disabled={!r.linked} /></TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{r.userName}</Typography>
                                        {r.personName && <Typography variant="caption" color="text.secondary">{r.personName}</Typography>}
                                    </TableCell>
                                    <TableCell>{nameOf(USER_TYPES, r.userType) || '-'}</TableCell>
                                    <TableCell>{r.linked ? <Chip size="small" color="success" label={r.displayName ? `متصل (${r.displayName})` : 'متصل'} /> : <Chip size="small" label="متصل نیست" />}</TableCell>
                                    <TableCell>{r.lastActivityAt ? dateFn(r.lastActivityAt) : '-'}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={r.linked ? 'اتصال دوباره / قطع ارتباط' : 'ساخت کد QR'}>
                                            <IconButton size="small" color="primary" onClick={() => setQrFor(r)} aria-label="QR"><QrCode2Icon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>کاربری پیدا نشد</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {canSend && (
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>ارسال پیام</Typography>
                    <Stack gap={1.5}>
                        <StyledTextField label="متن پیام" multiline minRows={3} value={text} onChange={(e) => setText(e.target.value)} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}>
                            <StyledTextField size="small" label="شماره فعالیت (اختیاری)" value={taskId} onChange={(e) => setTaskId(e.target.value.replace(/\D/g, ''))} sx={{ width: 200 }} />
                            <FormControlLabel control={<Checkbox checked={pdf} onChange={(e) => setPdf(e.target.checked)} disabled={!taskId} />} label="فرم PDF فعالیت هم ارسال شود" />
                        </Stack>
                        <Stack direction="row" gap={2} alignItems="center">
                            <Button variant="main" onClick={submit} disabled={send.isPending || picked.length === 0 || (!text.trim() && !(pdf && taskId))}>
                                {send.isPending ? <CustomCircularProgress size={18} color="white.0" /> : `ارسال به ${num(picked.length)} نفر`}
                            </Button>
                            <Typography variant="caption" color="text.secondary">فقط کسانی که به بله متصل‌اند در فهرست قابل انتخاب هستند.</Typography>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            {qrFor && <BaleLinkDialog open close={() => setQrFor(null)} snackbarOpen={snackbarOpen} userID={qrFor.userID} userName={qrFor.userName} />}
        </Box>
    )
}

export default BalePage
