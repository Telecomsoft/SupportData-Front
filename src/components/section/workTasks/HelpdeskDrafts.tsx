import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Alert, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import getEndPoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'

export type BankDraft = {
    id: number; ticketCode: string; subject: string; plaqueNo: string; state: string
    departmentInfo?: { name: string; branchCode: number }; reportedAt?: string; pvCreateDate?: string
    reportedIssue: string; description: string
}
type Status = { allowHttp: boolean; configured: boolean; state: string; lastPoll?: string }
type Challenge = { attemptId: string; captcha: string }
const api = () => getEndPoint() + 'api/helpdesk/'

export default function HelpdeskDrafts({ review, version }: { review: (draft: BankDraft) => void; version: number }) {
    const auth = useGetAuthorizationConfig()
    const [show, setShow] = useState(false)
    const [login, setLogin] = useState(false)
    const [page, setPage] = useState(0)
    const [challenge, setChallenge] = useState<Challenge>()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const status = useQuery({ queryKey: ['bank-status'], queryFn: async () =>
        (await axios.get<Status>(api() + 'status', auth)).data, refetchInterval: 10000, retry: false })
    const drafts = useQuery({ queryKey: ['bank-drafts', page, version], enabled: show,
        queryFn: async () => (await axios.get<{items: BankDraft[]; hasMore: boolean}>(api() + 'drafts?page=' + page, auth)).data,
        refetchInterval: 15000 })
    async function refresh() {
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
        ;(form.elements.namedItem('captcha') as HTMLInputElement).value = ''
        setBusy(true); setError('')
        try {
            await axios.post(api() + 'login/complete', { ...values, attemptId: challenge.attemptId }, auth)
            setLogin(false); setChallenge(undefined); await status.refetch()
        } catch { setError('ورود انجام نشد. کد امنیتی جدید را وارد کنید.'); await refresh() }
        finally { setBusy(false) }
    }
    const active = status.data?.state === 'Active'
    return <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Button onClick={() => { setPage(0); setShow(true) }}>پیش‌نویس‌های بانک پاسارگاد</Button>
        <Typography variant="caption">{status.isError ? 'وضعیت اتصال نامشخص' : active ? 'بانک متصل است' : 'نیاز به اتصال بانک'}
            {status.data?.lastPoll && ' • ' + new Date(status.data.lastPoll).toLocaleString('fa-IR')}</Typography>
        {!active && <Button disabled={!status.data?.configured || (!window.isSecureContext && !status.data.allowHttp)} onClick={start}>ورود به بانک</Button>}
        <Dialog open={show} onClose={() => setShow(false)} fullWidth maxWidth="md">
            <DialogTitle>پیش‌نویس‌های بانک پاسارگاد</DialogTitle><DialogContent><Stack spacing={2}>
            {drafts.isLoading && 'در حال دریافت…'}
            {drafts.isError && <Alert severity="error">دریافت پیش‌نویس‌ها ممکن نشد.</Alert>}
            {drafts.data?.items.length === 0 && 'پیش‌نویسی در این صفحه وجود ندارد.'}
            {drafts.data?.items.map(d => <Stack key={d.id} spacing={0.5} borderBottom="1px solid" borderColor="divider" pb={1}>
                <Typography fontWeight="bold">{d.ticketCode} • {d.subject}</Typography>
                <Typography>{d.reportedIssue}</Typography>
                <Typography variant="caption">شعبه {d.departmentInfo?.name} ({d.departmentInfo?.branchCode}) • پلاک {d.plaqueNo} • {d.state} • {d.pvCreateDate}</Typography>
                <Button onClick={() => { setShow(false); review(d) }}>بررسی و ویرایش</Button>
            </Stack>)}
            <Stack direction="row"><Button disabled={!page} onClick={() => setPage(page-1)}>قبلی</Button>
            <Button disabled={!drafts.data?.hasMore} onClick={() => setPage(page+1)}>بعدی</Button></Stack>
            </Stack></DialogContent>
        </Dialog>
        <Dialog open={login} onClose={() => { if (!busy) setLogin(false) }}>
            <DialogTitle>ورود به میز خدمت بانک</DialogTitle><DialogContent>
            <Stack component="form" spacing={2} onSubmit={submit} sx={{ pt: 1 }}>
                <TextField required name="username" label="نام کاربری بانک" />
                <TextField required type="password" name="password" label="گذرواژه بانک" autoComplete="off" />
                {challenge && <img src={challenge.captcha} alt="کد امنیتی بانک" width={180} />}
                <Button disabled={busy} onClick={start}>تصویر جدید</Button>
                <TextField required name="captcha" label="کد امنیتی" autoComplete="off" />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" disabled={busy || !challenge}>اتصال</Button>
            </Stack></DialogContent>
        </Dialog>
    </Stack>
}
