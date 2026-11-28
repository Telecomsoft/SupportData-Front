import { useEffect, useMemo, useState, FormEvent } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material'
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import Close from '@mui/icons-material/Close'
import Refresh from '@mui/icons-material/Refresh'
import InboxOutlined from '@mui/icons-material/InboxOutlined'
import SearchIcon from '@mui/icons-material/Search'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { useDevice } from '@hooks/useDevice'
import type { KioskSearchItem } from './KioskSearchField'
import getEndPoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'
import { DRAFT_TEXT } from '@src/data/type/helpdeskDraft'

export type BankDraft = {
    id: number; ticketCode: string; subject: string; plaqueNo: string; state: string
    departmentInfo?: { name: string; branchCode: number }; reportedAt?: string; pvCreateDate?: string
    kiosks?: KioskSearchItem[]; reportedIssue: string; description: string
}
type Status = { allowHttp: boolean; configured: boolean; state: string; lastPoll?: string }
type Challenge = { attemptId: string; captcha: string }
const api = () => getEndPoint() + 'api/helpdesk/'

const DraftDescription = ({ id, value }: { id: number; value: string }) => {
    const [expanded, setExpanded] = useState(false)
    const canExpand = value.length > 220 || value.split('\n').length > 3
    return (
        <Box>
            <Typography
                id={`bank-draft-description-${id}`}
                sx={{
                    whiteSpace: 'pre-line',
                    overflowWrap: 'anywhere',
                    ...(canExpand && !expanded ? {
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                    } : {}),
                }}
            >
                {value}
            </Typography>
            {canExpand && (
                <Button
                    size="small"
                    aria-expanded={expanded}
                    aria-controls={`bank-draft-description-${id}`}
                    onClick={() => setExpanded((open) => !open)}
                    sx={{ mt: 0.25, minWidth: 0, p: 0, fontSize: '0.75rem' }}
                >
                    {expanded ? DRAFT_TEXT.showLess : DRAFT_TEXT.showMore}
                </Button>
            )}
        </Box>
    )
}

export default function HelpdeskDrafts({ review, version, show, setShow, loadOnMount = false, compact = false }: {
    review: (draft: BankDraft) => void
    version: number
    show: boolean
    setShow: (open: boolean) => void
    loadOnMount?: boolean
    compact?: boolean
}) {
    const auth = useGetAuthorizationConfig()
    const { isMobile } = useDevice()
    const [login, setLogin] = useState(false)
    const [page, setPage] = useState(0)
    const [challenge, setChallenge] = useState<Challenge>()
    const [answer, setAnswer] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [draftSearch, setDraftSearch] = useState('')
    const [draftState, setDraftState] = useState('')
    const [draftBranch, setDraftBranch] = useState('')
    useEffect(() => {
        setDraftState('')
        setDraftBranch('')
    }, [page])
    const status = useQuery({ queryKey: ['bank-status'], queryFn: async () =>
        (await axios.get<Status>(api() + 'status', auth)).data, refetchInterval: 10000, retry: false })
    const drafts = useQuery({ queryKey: ['bank-drafts', page, version], enabled: show || loadOnMount,
        queryFn: async () => (await axios.get<{items: BankDraft[]; hasMore: boolean}>(api() + 'drafts?page=' + page, auth)).data,
        refetchInterval: 15000 })
    async function refresh() {
        setAnswer('')
        setChallenge(undefined)
        try { setChallenge((await axios.post<Challenge>(api() + 'login/start', {}, auth)).data) }
        catch (e) { setError(axios.isAxiosError(e) && e.response?.status === 429 ? DRAFT_TEXT.retryCaptcha : DRAFT_TEXT.captchaError) }
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
        } catch { setError(DRAFT_TEXT.loginError); await refresh() }
        finally { setBusy(false) }
    }
    const active = status.data?.state === 'Active'
    const statusLabel = status.isLoading ? DRAFT_TEXT.checkingConnection : status.isError ? DRAFT_TEXT.unknownConnection
        : active ? DRAFT_TEXT.connected : DRAFT_TEXT.loginRequired
    const responseCode = axios.isAxiosError(status.error) ? status.error.response?.status : undefined
    const statusError = responseCode === 401 ? DRAFT_TEXT.sessionError
        : responseCode === 403 ? DRAFT_TEXT.accessError
        : responseCode ? DRAFT_TEXT.serverError(responseCode)
        : DRAFT_TEXT.connectionError
    const problem = status.isError ? statusError
        : status.data && !status.data.configured ? DRAFT_TEXT.configurationError
        : !active && status.data && !window.isSecureContext && !status.data.allowHttp ? DRAFT_TEXT.httpsError : ''
    const lastPoll = status.data?.lastPoll
    const pageDrafts = useMemo(() => drafts.data?.items ?? [], [drafts.data?.items])
    const states = useMemo(() => [...new Set(pageDrafts.map((draft) => draft.state).filter(Boolean))], [pageDrafts])
    const branches = useMemo(() => {
        const byCode = new Map<string, string>()
        pageDrafts.forEach((draft) => {
            const code = draft.departmentInfo?.branchCode
            if (code !== undefined && code !== null) {
                byCode.set(String(code), `${draft.departmentInfo?.name ?? ''} (${code})`)
            }
        })
        return [...byCode.entries()]
    }, [pageDrafts])
    const visibleDrafts = useMemo(() => {
        const query = draftSearch.trim().toLocaleLowerCase()
        return pageDrafts.filter((draft) => {
            if (draftState && draft.state !== draftState) return false
            if (draftBranch && String(draft.departmentInfo?.branchCode ?? '') !== draftBranch) return false
            if (!query) return true
            return [
                draft.ticketCode, draft.subject, draft.reportedIssue, draft.plaqueNo,
                draft.departmentInfo?.name, draft.departmentInfo?.branchCode,
            ].some((value) => String(value ?? '').toLocaleLowerCase().includes(query))
        })
    }, [draftBranch, draftSearch, draftState, pageDrafts])
    const retry = <Button size="small" color="inherit" onClick={() => void drafts.refetch()}>{DRAFT_TEXT.retry}</Button>
    return <>
        <Paper variant="outlined" dir="rtl" sx={{ p: compact ? 1 : { xs: 1.25, sm: 1.5 }, mb: compact ? 0 : 1, borderRadius: 1.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1}>
                <Stack direction="row" alignItems="center" gap={1.25}>
                    <AccountBalanceOutlined color="primary" aria-hidden />
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography fontWeight={700}>{DRAFT_TEXT.serviceTitle}</Typography>
                            <Chip size="small" label={statusLabel} variant="outlined"
                                color={status.isError || status.isLoading ? 'default' : active ? 'success' : 'warning'} />
                        </Stack>
                        {lastPoll && !compact && <Typography variant="caption" color="text.secondary">{DRAFT_TEXT.lastPoll}: {new Date(lastPoll).toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })}</Typography>}
                    </Box>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Button variant={active ? 'contained' : 'outlined'} onClick={() => { setPage(0); setShow(true) }}>
                        {DRAFT_TEXT.bankDrafts}{loadOnMount && drafts.data ? ` (${drafts.data.items.length.toLocaleString('fa-IR')}${drafts.data.hasMore ? '+' : ''})` : ''}
                    </Button>
                    {!active && !problem && status.data && <Button variant="contained" onClick={start}>{DRAFT_TEXT.login}</Button>}
                </Stack>
            </Stack>
            {problem && <Alert sx={{ mt: 1 }} severity="warning" action={status.isError && <Button color="inherit" onClick={() => void status.refetch()}>{DRAFT_TEXT.retry}</Button>}>{problem}</Alert>}
        </Paper>
        <Dialog open={show} onClose={() => setShow(false)} fullScreen={isMobile} fullWidth maxWidth="md" dir="rtl" aria-labelledby="bank-drafts-title">
            <DialogTitle component="div"><Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <Typography id="bank-drafts-title" component="h2" variant="h6">
                    {DRAFT_TEXT.draftsTitle}
                    {drafts.data && <Typography component="span" variant="body2" color="text.secondary"> · {pageDrafts.length.toLocaleString('fa-IR')}{drafts.data.hasMore ? '+' : ''}</Typography>}
                </Typography>
                <IconButton aria-label={DRAFT_TEXT.closeDrafts} onClick={() => setShow(false)}><Close /></IconButton>
            </Stack></DialogTitle>
            <DialogContent dividers><Stack gap={1.5}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(240px, 1.5fr) repeat(2, minmax(150px, 1fr))' }, gap: 1 }}>
                    <TextField
                        size="small"
                        label={DRAFT_TEXT.search}
                        value={draftSearch}
                        onChange={(event) => setDraftSearch(event.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                    />
                    <TextField
                        select
                        size="small"
                        label={DRAFT_TEXT.stateFilter}
                        value={draftState}
                        onChange={(event) => setDraftState(event.target.value)}
                    >
                        <MenuItem value="">{DRAFT_TEXT.allStates}</MenuItem>
                        {states.map((state) => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label={DRAFT_TEXT.branchFilter}
                        value={draftBranch}
                        onChange={(event) => setDraftBranch(event.target.value)}
                    >
                        <MenuItem value="">{DRAFT_TEXT.allBranches}</MenuItem>
                        {branches.map(([code, label]) => <MenuItem key={code} value={code}>{label}</MenuItem>)}
                    </TextField>
                </Box>
                <Typography variant="caption" color="text.secondary">{DRAFT_TEXT.pageFilterNote}</Typography>
                {drafts.isLoading && <Stack gap={1.25} role="status" aria-label={DRAFT_TEXT.loading} py={1}>
                    {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} variant="rounded" height={118} />)}
                </Stack>}
                {drafts.isError && <Alert severity="error" action={retry}>{DRAFT_TEXT.draftsError}</Alert>}
                {!drafts.isError && drafts.data?.items.length === 0 && <Stack alignItems="center" gap={1} py={5}>
                    <InboxOutlined color="action" fontSize="large" />
                    <Typography>{page ? DRAFT_TEXT.emptyPage : DRAFT_TEXT.emptyAll}</Typography>
                    <Button size="small" disabled={drafts.isFetching} onClick={() => void drafts.refetch()}>{DRAFT_TEXT.refreshDrafts}</Button>
                </Stack>}
                {!drafts.isError && pageDrafts.length > 0 && visibleDrafts.length === 0 && (
                    <Stack alignItems="center" gap={1} py={4}>
                        <InboxOutlined color="action" fontSize="large" />
                        <Typography>{DRAFT_TEXT.noMatches}</Typography>
                    </Stack>
                )}
                {visibleDrafts.map(d => <Paper component="article" variant="outlined" key={d.id} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 1.5 }}>
                    <Stack gap={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={1}>
                            <Typography component="h3" fontWeight={700}>{d.subject || DRAFT_TEXT.bankRequest}</Typography>
                            <Typography variant="body2" dir="ltr" color="text.secondary">{d.ticketCode || d.id}</Typography>
                        </Stack>
                        {d.reportedIssue && <DraftDescription id={d.id} value={d.reportedIssue} />}
                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                            {d.departmentInfo && <Chip size="small" variant="outlined" icon={<PlaceOutlinedIcon />} label={<>{DRAFT_TEXT.branch}: {d.departmentInfo.name} (<bdi dir="ltr">{d.departmentInfo.branchCode}</bdi>)</>} />}
                            {d.plaqueNo && <Chip size="small" variant="outlined" label={<>{DRAFT_TEXT.plate}: <bdi dir="ltr">{d.plaqueNo}</bdi></>} />}
                            {d.pvCreateDate && <Chip size="small" variant="outlined" icon={<AccessTimeOutlinedIcon />} label={<>{DRAFT_TEXT.reportedAt}: <bdi dir="ltr">{d.pvCreateDate}</bdi></>} />}
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
                            {d.state && <Chip size="small" color="info" label={`${DRAFT_TEXT.bankStatus}: ${d.state}`} />}
                            <Button size="small" variant="outlined" onClick={() => { setShow(false); review(d) }}>{DRAFT_TEXT.review}</Button>
                        </Stack>
                    </Stack>
                </Paper>)}
            </Stack></DialogContent>
            {(page > 0 || drafts.data?.hasMore) && <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button disabled={!page} onClick={() => setPage(page - 1)}>{DRAFT_TEXT.previousPage}</Button>
                <Typography variant="body2">{DRAFT_TEXT.page} {(page + 1).toLocaleString('fa-IR')}</Typography>
                <Button disabled={!drafts.data?.hasMore} onClick={() => setPage(page + 1)}>{DRAFT_TEXT.nextPage}</Button>
            </DialogActions>}
        </Dialog>
        <Dialog open={login} onClose={() => { if (!busy) setLogin(false) }} fullWidth maxWidth="xs" dir="rtl" aria-labelledby="bank-login-title">
            <DialogTitle id="bank-login-title">{DRAFT_TEXT.loginTitle}</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent dividers><Stack gap={2}>
                    <TextField required autoFocus name="username" label={DRAFT_TEXT.username} />
                    <TextField required type="password" name="password" label={DRAFT_TEXT.password} autoComplete="off" />
                    <Paper variant="outlined" sx={{ p: 1.25 }}><Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" minHeight={50}>
                        {challenge ? <Box component="img" src={challenge.captcha} alt={DRAFT_TEXT.captchaImage} sx={{ width: 180, maxWidth: '70%' }} />
                            : busy ? <CircularProgress size={22} aria-label={DRAFT_TEXT.captchaLoading} /> : <Typography variant="body2">{DRAFT_TEXT.captchaUnavailable}</Typography>}
                        <IconButton disabled={busy} aria-label={DRAFT_TEXT.newCaptcha} title={DRAFT_TEXT.newCaptcha} onClick={start}><Refresh /></IconButton>
                    </Stack></Paper>
                    <TextField required name="captcha" label={DRAFT_TEXT.captchaInput} autoComplete="off" value={answer} onChange={e => setAnswer(e.target.value)} inputProps={{ dir: 'ltr' }} />
                    {error && <Alert severity="error">{error}</Alert>}
                </Stack></DialogContent>
                <DialogActions><Button variant="contained" type="submit" disabled={busy || !challenge}>{DRAFT_TEXT.login}</Button>
                    <Button disabled={busy} onClick={() => setLogin(false)}>{DRAFT_TEXT.cancel}</Button></DialogActions>
            </Box>
        </Dialog>
    </>
}