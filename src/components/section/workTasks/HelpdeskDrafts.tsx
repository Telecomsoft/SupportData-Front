import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import Close from '@mui/icons-material/Close'
import Refresh from '@mui/icons-material/Refresh'
import InboxOutlined from '@mui/icons-material/InboxOutlined'
import { useDevice } from '@hooks/useDevice'
import type { KioskSearchItem } from './KioskSearchField'
import getEndPoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'

export type BankDraft = {
    id: number; ticketCode: string; subject: string; plaqueNo: string; state: string
    departmentInfo?: { name: string; branchCode: number }; reportedAt?: string; pvCreateDate?: string
    kiosks?: KioskSearchItem[]; reportedIssue: string; description: string
}
type Status = { allowHttp: boolean; configured: boolean; state: string; lastPoll?: string }
type Challenge = { attemptId: string; captcha: string }
const api = () => getEndPoint() + 'api/helpdesk/'

export default function HelpdeskDrafts({ review, version, show, setShow }: { review: (draft: BankDraft) => void; version: number; show: boolean; setShow: (open: boolean) => void }) {
    const auth = useGetAuthorizationConfig()
    const { isMobile } = useDevice()
    const [login, setLogin] = useState(false)
    const [page, setPage] = useState(0)
    const [challenge, setChallenge] = useState<Challenge>()
    const [answer, setAnswer] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const status = useQuery({ queryKey: ['bank-status'], queryFn: async () =>
        (await axios.get<Status>(api() + 'status', auth)).data, refetchInterval: 10000, retry: false })
    const drafts = useQuery({ queryKey: ['bank-drafts', page, version], enabled: show,
        queryFn: async () => (await axios.get<{items: BankDraft[]; hasMore: boolean}>(api() + 'drafts?page=' + page, auth)).data,
        refetchInterval: 15000 })
    async function refresh() {
        setAnswer('')
        setChallenge(undefined)
        try { setChallenge((await axios.post<Challenge>(api() + 'login/start', {}, auth)).data) }
        catch (e) { setError(axios.isAxiosError(e) && e.response?.status === 429 ? 'یک دقیقه دیگر تلاش کنید.' : 'دریافت تصویر امنیتی ممکن نشد.') }
    }
    async function start() {
        setLogin(true); setBusy(true); setError('')
        try { await refresh() } finally { setBusy(false) }
    }
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!challenge || busy) return
        const form = event.currentTarget
        const values = Object.fromEntries(new FormData(form))
        ;(form.elements.namedItem('password') as HTMLInputElement).value = ''
        setAnswer('')
        setBusy(true); setError('')
        try {
            await axios.post(api() + 'login/complete', { ...values, attemptId: challenge.attemptId }, auth)
            setLogin(false); setChallenge(undefined); await status.refetch()
        } catch { setError('ورود انجام نشد. کد امنیتی جدید را وارد کنید.'); await refresh() }
        finally { setBusy(false) }
    }
    const active = status.data?.state === 'Active'
    const statusLabel = status.isLoading ? 'در حال بررسی اتصال…' : status.isError ? 'وضعیت اتصال نامشخص'
        : active ? 'متصل' : 'نیاز به ورود'
    const responseCode = axios.isAxiosError(status.error) ? status.error.response?.status : undefined
    const statusError = responseCode === 401 ? 'نشست سامانه پشتیبانی معتبر نیست. دوباره وارد سامانه شوید.'
        : responseCode === 403 ? 'دسترسی به میز خدمت مجاز نیست. دسترسی حساب و تنظیمات اتصال را بررسی کنید.'
        : responseCode ? `دریافت وضعیت میز خدمت با خطای سرور (${responseCode}) روبه‌رو شد.`
        : 'ارتباط با سرور پشتیبانی برقرار نشد.'
    const problem = status.isError ? statusError
        : status.data && !status.data.configured ? 'تنظیمات اتصال به بانک تکمیل نشده است.'
        : !active && status.data && !window.isSecureContext && !status.data.allowHttp ? 'برای ورود به بانک، سامانه را با HTTPS باز کنید.' : ''
    const lastPoll = status.data?.lastPoll
    const retry = <Button size="small" color="inherit" onClick={() => void drafts.refetch()}>تلاش دوباره</Button>
    return <>
        <Paper variant="outlined" dir="rtl" sx={{ p: { xs: 1.5, sm: 2 }, mb: 1, borderRadius: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1.5}>
                <Stack direction="row" alignItems="center" gap={1.25}>
                    <AccountBalanceOutlined color="primary" aria-hidden />
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography fontWeight={700}>میز خدمت پاسارگاد</Typography>
                            <Chip size="small" label={statusLabel} variant="outlined"
                                color={status.isError || status.isLoading ? 'default' : active ? 'success' : 'warning'} />
                        </Stack>
                        {lastPoll && <Typography variant="caption" color="text.secondary">آخرین بررسی موفق: {new Date(lastPoll).toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })}</Typography>}
                    </Box>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Button variant={active ? 'contained' : 'outlined'} onClick={() => { setPage(0); setShow(true) }}>پیش‌نویس‌های بانک</Button>
                    {!active && !problem && status.data && <Button variant="contained" onClick={start}>ورود به بانک</Button>}
                </Stack>
            </Stack>
            {problem && <Alert sx={{ mt: 1 }} severity="warning" action={status.isError && <Button color="inherit" onClick={() => void status.refetch()}>تلاش دوباره</Button>}>{problem}</Alert>}
        </Paper>
        <Dialog open={show} onClose={() => setShow(false)} fullScreen={isMobile} fullWidth maxWidth="md" dir="rtl" aria-labelledby="bank-drafts-title">
            <DialogTitle component="div"><Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography id="bank-drafts-title" component="h2" variant="h6">پیش‌نویس‌های بانک پاسارگاد</Typography>
                <IconButton aria-label="بستن پیش‌نویس‌ها" onClick={() => setShow(false)}><Close /></IconButton>
            </Stack></DialogTitle>
            <DialogContent dividers><Stack gap={1.5}>
                {drafts.isLoading && <Stack role="status" alignItems="center" gap={1} py={4}><CircularProgress size={24} />در حال دریافت پیش‌نویس‌ها…</Stack>}
                {drafts.isError && <Alert severity="error" action={retry}>دریافت پیش‌نویس‌ها ممکن نشد.</Alert>}
                {!drafts.isError && drafts.data?.items.length === 0 && <Stack alignItems="center" gap={1} py={5}>
                    <InboxOutlined color="action" fontSize="large" />
                    <Typography>{page ? 'در این صفحه پیش‌نویسی باقی نمانده است.' : 'پیش‌نویسی برای بررسی وجود ندارد.'}</Typography>
                    <Button size="small" disabled={drafts.isFetching} onClick={() => void drafts.refetch()}>بررسی مجدد</Button>
                </Stack>}
                {drafts.data?.items.map(d => <Paper component="article" variant="outlined" key={d.id} sx={{ p: 2, borderRadius: 2 }}>
                    <Stack gap={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={1}>
                            <Typography component="h3" fontWeight={700}>{d.subject || 'درخواست بانک'}</Typography>
                            <Typography variant="body2" dir="ltr" color="text.secondary">{d.ticketCode || d.id}</Typography>
                        </Stack>
                        {d.reportedIssue && <Typography sx={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{d.reportedIssue}</Typography>}
                        <Stack direction="row" flexWrap="wrap" gap={1.5} color="text.secondary" typography="body2">
                            {d.departmentInfo && <span>شعبه: {d.departmentInfo.name} ({d.departmentInfo.branchCode})</span>}
                            {d.plaqueNo && <span>پلاک: <bdi>{d.plaqueNo}</bdi></span>}
                            {d.pvCreateDate && <span>زمان گزارش: <bdi dir="ltr">{d.pvCreateDate}</bdi></span>}
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
                            {d.state && <Typography variant="caption" color="text.secondary">وضعیت بانک: {d.state}</Typography>}
                            <Button size="small" variant="outlined" onClick={() => { setShow(false); review(d) }}>بررسی و ویرایش</Button>
                        </Stack>
                    </Stack>
                </Paper>)}
            </Stack></DialogContent>
            {(page > 0 || drafts.data?.hasMore) && <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button disabled={!page} onClick={() => setPage(page - 1)}>صفحه قبل</Button>
                <Typography variant="body2">صفحه {(page + 1).toLocaleString('fa-IR')}</Typography>
                <Button disabled={!drafts.data?.hasMore} onClick={() => setPage(page + 1)}>صفحه بعد</Button>
            </DialogActions>}
        </Dialog>
        <Dialog open={login} onClose={() => { if (!busy) setLogin(false) }} fullWidth maxWidth="xs" dir="rtl" aria-labelledby="bank-login-title">
            <DialogTitle id="bank-login-title">ورود به میز خدمت پاسارگاد</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent dividers><Stack gap={2}>
                    <TextField required autoFocus name="username" label="نام کاربری بانک" />
                    <TextField required type="password" name="password" label="گذرواژه بانک" autoComplete="off" />
                    <Paper variant="outlined" sx={{ p: 1.25 }}><Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" minHeight={50}>
                        {challenge ? <Box component="img" src={challenge.captcha} alt="تصویر کد امنیتی بانک" sx={{ width: 180, maxWidth: '70%' }} />
                            : busy ? <CircularProgress size={22} aria-label="دریافت کد امنیتی" /> : <Typography variant="body2">تصویر در دسترس نیست</Typography>}
                        <IconButton disabled={busy} aria-label="دریافت تصویر جدید" title="دریافت تصویر جدید" onClick={start}><Refresh /></IconButton>
                    </Stack></Paper>
                    <TextField required name="captcha" label="کد داخل تصویر" autoComplete="off" value={answer} onChange={e => setAnswer(e.target.value)} inputProps={{ dir: 'ltr' }} />
                    {error && <Alert severity="error">{error}</Alert>}
                </Stack></DialogContent>
                <DialogActions><Button variant="contained" type="submit" disabled={busy || !challenge}>ورود به بانک</Button>
                    <Button disabled={busy} onClick={() => setLogin(false)}>انصراف</Button></DialogActions>
            </Box>
        </Dialog>
    </>
}