/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Alert, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { QRCodeSVG } from 'qrcode.react'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { useGetData } from '@hooks/useGetData'
import { usePostData } from '@hooks/usePostData'
import { snackbarOpenType } from '@type/snackbarOpen'
import { ResType } from '@type/resType'
import { num } from '@components/section/statements/statementFormat'

type Props = {
    open: boolean
    close: () => void
    snackbarOpen: snackbarOpenType
    /** empty = the signed-in user; a number = a user an administrator is linking */
    userID?: number
    userName?: string
}

type LinkInfo = { code: string; link: string; expiresAt: string }

/**
 * Links a Bale chat to a login. The user presses "make QR code", scans it with Bale, Bale opens the bot, and the bot ties that chat to the login.
 * The code works once and expires in a few minutes. While the QR is on screen the dialog checks every 3 seconds and says when the link is made.
 */
const BaleLinkDialog = ({ open, close, snackbarOpen, userID, userName }: Props) => {
    const self = userID === undefined
    const status = useGetData<any>('api/Bale/Status', 'bale-status', { enabled: open && self })
    const accounts = useGetData<any[]>('api/Bale/Accounts', 'bale-accounts', { enabled: open && !self })
    const create = usePostData<{ userID?: number }, ResType & { value?: LinkInfo }>('api/Bale/CreateLinkCode', 'bale-create-code')
    const unlink = usePostData<{ userID?: number }, ResType>('api/Bale/Unlink', 'bale-unlink')
    const [info, setInfo] = useState<LinkInfo | null>(null)
    const [now, setNow] = useState(Date.now())

    const enabled = self ? status.data?.value?.enabled !== false : true
    const linked: boolean = self ? !!status.data?.value?.linked : !!accounts.data?.value?.find((a) => a.userID === userID)?.linked
    const linkedName: string | undefined = self ? status.data?.value?.displayName : accounts.data?.value?.find((a) => a.userID === userID)?.displayName
    const refetch = () => (self ? status.refetch() : accounts.refetch())

    // while a QR code is shown: a clock for the countdown, and a check for the link every 3 seconds
    useEffect(() => {
        if (!open || !info) return
        const tick = setInterval(() => setNow(Date.now()), 1000)
        const poll = setInterval(() => { refetch() }, 3000)
        return () => { clearInterval(tick); clearInterval(poll) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, info])

    useEffect(() => {
        if (info && linked) {
            setInfo(null)
            snackbarOpen('ارتباط با بله برقرار شد', SNACKBAR_SEVERITIES.SUCCESS)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linked])

    const closeAll = () => { setInfo(null); close() }

    const make = () =>
        create.mutateAsync({ userID }).then((res) => {
            if (res.error === 0 && res.value) { setInfo(res.value); setNow(Date.now()) }
            else snackbarOpen(res.errorMessage || 'ساخت کد انجام نشد', SNACKBAR_SEVERITIES.ERROR)
        }).catch((e: Error) => snackbarOpen(e.message, SNACKBAR_SEVERITIES.ERROR))

    const cut = () =>
        unlink.mutateAsync({ userID }).then((res) => {
            if (res.error === 0) { snackbarOpen('ارتباط قطع شد', SNACKBAR_SEVERITIES.SUCCESS); setInfo(null); refetch() }
            else snackbarOpen(res.errorMessage || 'قطع ارتباط انجام نشد', SNACKBAR_SEVERITIES.ERROR)
        }).catch((e: Error) => snackbarOpen(e.message, SNACKBAR_SEVERITIES.ERROR))

    const secondsLeft = info ? Math.max(0, Math.round((new Date(info.expiresAt).getTime() - now) / 1000)) : 0
    const loading = self ? status.isLoading : accounts.isLoading
    const mmss = `${num(Math.floor(secondsLeft / 60))}:${String(secondsLeft % 60).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}`

    return (
        <Dialog open={open} onClose={closeAll} fullWidth maxWidth="xs">
            <DialogTitle>ارتباط با بله{userName ? ` - ${userName}` : ''}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}><CustomCircularProgress thickness={2} size={36} /></Box>
                ) : !enabled ? (
                    <Alert severity="info">ربات بله هنوز روی سرور راه‌اندازی نشده است. از مدیر سیستم بخواهید توکن ربات را تنظیم کند.</Alert>
                ) : (
                    <Stack gap={2} alignItems="center" sx={{ pt: 1 }}>
                        <Stack direction="row" gap={1} alignItems="center">
                            <Typography variant="body2">وضعیت:</Typography>
                            {linked ? <Chip color="success" size="small" label={linkedName ? `متصل (${linkedName})` : 'متصل'} /> : <Chip size="small" label="متصل نیست" />}
                        </Stack>

                        {info ? (
                            <>
                                <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid', borderColor: 'divider', lineHeight: 0 }}>
                                    <QRCodeSVG value={info.link} size={200} level="M" />
                                </Box>
                                <Typography variant="body2" align="center">
                                    کد QR را با برنامه‌ی بله اسکن کنید و در گفتگوی ربات «شروع» را بزنید.
                                </Typography>
                                <Typography variant="body2" color={secondsLeft > 0 ? 'text.secondary' : 'error'}>
                                    {secondsLeft > 0 ? `اعتبار کد: ${mmss}` : 'کد منقضی شد. دوباره بسازید.'}
                                </Typography>
                                <Link href={info.link} target="_blank" rel="noopener" variant="body2">باز کردن در بله (روی همین دستگاه)</Link>
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                {linked
                                    ? 'اعلان‌ها و فعالیت‌ها از طریق ربات بله ارسال می‌شود. برای وصل کردن به گفتگوی دیگر یک کد QR تازه بسازید.'
                                    : 'با اتصال به ربات بله، اعلان‌های فعالیت‌ها را می‌گیرید و می‌توانید وضعیت فعالیت را تغییر دهید، فرم PDF بگیرید و فایل پیوست کنید.'}
                            </Typography>
                        )}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button variant="cancel" onClick={closeAll}>بستن</Button>
                {enabled && linked && <Button variant="cancel" onClick={cut} disabled={unlink.isPending}>قطع ارتباط</Button>}
                {enabled && (
                    <Button variant="main" onClick={make} disabled={create.isPending || loading}>
                        {create.isPending ? <CustomCircularProgress size={18} color="white.0" /> : info ? 'ساخت کد تازه' : linked ? 'اتصال به گفتگوی دیگر' : 'ساخت کد QR'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default BaleLinkDialog
