/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import axios from 'axios'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ClearIcon from '@mui/icons-material/Clear'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { isTaskClosed, TASK_TRANSITIONS } from '@src/data/type/lookups'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'
import { useAccessCheck } from '@utility/accessCheck'
import getEndpoint from '@utility/getEndPoint'
import { num } from '@components/section/statements/statementFormat'
import StyledTextField from '@components/general/input/StyledTextField'
import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete'

type Opt = { id: number; name: string }
type Outcome = { id: number; ok: boolean; message?: string }
type Dialog_ = { kind: 'assign' } | { kind: 'state'; transition: { to: number; label: string; confirm: string } } | { kind: 'form' } | null

type Props = {
    /** the selected rows (from the list: they hold state, isLocked, serviceFormReceived...) */
    tasks: any[]
    technicians: Opt[]
    contractors: Opt[]
    snackbarOpen: snackbarOpenType
    /** called after the actions ran: refresh the list */
    onDone: () => void
    clearSelection: () => void
}

/**
 * What can be done to many selected tasks at once: assign, change state, confirm the signed form came back.
 * Each task goes through the SAME endpoint as on the task page, one after the other, so every rule, permission
 * and history entry is exactly the same. A task the action does not fit (closed, locked, wrong state) is skipped
 * and counted; a task the server refuses is listed with the server's reason. Nothing is all-or-nothing.
 */
const WorkTaskBulkBar = ({ tasks, technicians, contractors, snackbarOpen, onDone, clearSelection }: Props) => {
    const { canPerform } = useAccessCheck()
    const authConfig = useGetAuthorizationConfig()
    const [menu, setMenu] = useState<HTMLElement | null>(null)
    const [dialog, setDialog] = useState<Dialog_>(null)
    const [assignee, setAssignee] = useState<Opt | null>(null)
    const [contractor, setContractor] = useState<Opt | null>(null)
    const [note, setNote] = useState('')
    const [running, setRunning] = useState<{ done: number; total: number } | null>(null)
    const [result, setResult] = useState<{ title: string; outcomes: Outcome[]; skipped: number } | null>(null)

    const open = tasks.filter((t) => !t.isLocked)

    // which tasks each action fits
    const assignable = open.filter((t) => !isTaskClosed(t.state))
    const formPending = open.filter((t) => !t.serviceFormReceived)
    const stateTargets = useMemo(() => {
        const targets = new Map<number, { to: number; label: string; confirm: string; tasks: any[] }>()
        TASK_TRANSITIONS.forEach((tr) => {
            if (tr.permission !== 0 && !canPerform(tr.permission)) return
            const fits = open.filter((t) => t.state === tr.from)
            if (fits.length === 0) return
            const key = tr.to
            const prev = targets.get(key)
            targets.set(key, { to: tr.to, label: tr.label, confirm: tr.confirm, tasks: [...(prev?.tasks ?? []), ...fits] })
        })
        return [...targets.values()]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks])

    const canAssign = canPerform(203) && assignable.length > 0
    const canConfirm = canPerform(208) && formPending.length > 0

    const close = () => { setDialog(null); setAssignee(null); setContractor(null); setNote('') }

    // one request per task, in order; the server's answer (HTTP 200 + error != 0 when it refuses) decides success
    const run = async (title: string, targets: any[], call: (id: number) => Promise<any>) => {
        setDialog(null)
        setRunning({ done: 0, total: targets.length })
        const outcomes: Outcome[] = []
        for (const t of targets) {
            try {
                const res = await call(t.id)
                outcomes.push(res?.error === 0 ? { id: t.id, ok: true } : { id: t.id, ok: false, message: `${res?.errorMessage ?? ''}` })
            } catch (e: any) {
                outcomes.push({ id: t.id, ok: false, message: e?.message })
            }
            setRunning({ done: outcomes.length, total: targets.length })
        }
        setRunning(null)
        setResult({ title, outcomes, skipped: tasks.length - targets.length })
        close()
        onDone()
        if (outcomes.every((o) => o.ok)) snackbarOpen(`${num(outcomes.length)} دستورکار انجام شد`, SNACKBAR_SEVERITIES.SUCCESS)
    }

    const post = (path: string, body: any) => axios.post(getEndpoint() + path, body, authConfig).then((r) => r.data)
    const put = (path: string) => axios.put(getEndpoint() + path, undefined, authConfig).then((r) => r.data)

    const doAssign = () =>
        assignee && run('ارجاع', assignable, (id) => post('api/WorkTask/AssignWorkTask', { workTaskID: id, assignedToID: assignee.id, contractorID: contractor?.id ?? null, note: note || null }))
    const doState = (tr: { to: number; label: string; tasks: any[] }) =>
        run(tr.label, tr.tasks, (id) => post('api/WorkTask/ChangeWorkTaskState', { workTaskID: id, newState: tr.to, note: note || null }))
    const doForm = () => run('تایید دریافت فرم سرویس', formPending, (id) => put(`api/WorkTask/ConfirmServiceForm/${id}`))

    const failed = result?.outcomes.filter((o) => !o.ok) ?? []

    return (
        <>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', p: 1.25, mb: 1, borderRadius: 2, border: '1px solid', borderColor: 'primary.main', bgcolor: 'action.hover' }}>
                <Typography fontWeight="bold">{num(tasks.length)} دستورکار انتخاب شده</Typography>
                <Button variant="main" startIcon={<AssignmentIndIcon />} disabled={!canAssign || !!running} onClick={() => setDialog({ kind: 'assign' })}>
                    ارجاع ({num(assignable.length)})
                </Button>
                <Button variant="main" startIcon={<SwapHorizIcon />} disabled={stateTargets.length === 0 || !!running} onClick={(e) => setMenu(e.currentTarget)}>
                    تغییر وضعیت
                </Button>
                <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)}>
                    {stateTargets.map((tr) => (
                        <MenuItem key={tr.to} onClick={() => { setMenu(null); setDialog({ kind: 'state', transition: tr }) }}>
                            {tr.label} ({num(tr.tasks.length)})
                        </MenuItem>
                    ))}
                </Menu>
                <Button variant="main" startIcon={<AssignmentTurnedInIcon />} disabled={!canConfirm || !!running} onClick={() => setDialog({ kind: 'form' })}>
                    تایید دریافت فرم ({num(formPending.length)})
                </Button>
                <Button variant="cancel" startIcon={<ClearIcon />} onClick={clearSelection} disabled={!!running}>لغو انتخاب</Button>
                {running && (
                    <Stack sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Typography variant="caption">{num(running.done)} از {num(running.total)}</Typography>
                        <LinearProgress variant="determinate" value={(running.done * 100) / running.total} />
                    </Stack>
                )}
            </Paper>

            {dialog?.kind === 'assign' && (
                <Dialog open onClose={close} fullWidth maxWidth="xs">
                    <DialogTitle>ارجاع {num(assignable.length)} دستورکار</DialogTitle>
                    <DialogContent>
                        <Stack gap={2} sx={{ pt: 1 }}>
                            {tasks.length > assignable.length && <Alert severity="info">{num(tasks.length - assignable.length)} دستورکار بسته یا قفل است و ارجاع نمی‌شود.</Alert>}
                            <StyledAutoComplete options={technicians} value={assignee} getOptionLabel={(o: any) => o.name} isOptionEqualToValue={(a: any, b: any) => a.id === b.id} onChange={(_, v: any) => setAssignee(v)} renderInput={(p) => <StyledTextField {...p} label="ارجاع به" />} />
                            <StyledAutoComplete options={contractors} value={contractor} getOptionLabel={(o: any) => o.name} isOptionEqualToValue={(a: any, b: any) => a.id === b.id} onChange={(_, v: any) => setContractor(v)} renderInput={(p) => <StyledTextField {...p} label="پیمانکار (خالی = شرکت پیمانکاری خود تکنسین)" />} />
                            <StyledTextField label="توضیح" value={note} onChange={(e) => setNote(e.target.value)} multiline maxRows={3} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button variant="cancel" onClick={close}>انصراف</Button>
                        <Button variant="main" disabled={!assignee} onClick={doAssign}>ارجاع</Button>
                    </DialogActions>
                </Dialog>
            )}

            {dialog?.kind === 'state' && (
                <Dialog open onClose={close} fullWidth maxWidth="xs">
                    <DialogTitle>{dialog.transition.label}</DialogTitle>
                    <DialogContent>
                        <Stack gap={2} sx={{ pt: 1 }}>
                            <Typography>
                                «{dialog.transition.label}» برای {num((dialog.transition as any).tasks.length)} دستورکار انجام شود؟
                            </Typography>
                            {tasks.length > (dialog.transition as any).tasks.length && (
                                <Alert severity="info">{num(tasks.length - (dialog.transition as any).tasks.length)} دستورکار انتخاب‌شده در وضعیتی است که این تغییر را ندارد و رد می‌شود.</Alert>
                            )}
                            <StyledTextField label="توضیح" value={note} onChange={(e) => setNote(e.target.value)} multiline maxRows={3} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button variant="cancel" onClick={close}>انصراف</Button>
                        <Button variant="main" onClick={() => doState(dialog.transition as any)}>تایید</Button>
                    </DialogActions>
                </Dialog>
            )}

            {dialog?.kind === 'form' && (
                <Dialog open onClose={close} fullWidth maxWidth="xs">
                    <DialogTitle>تایید دریافت فرم سرویس</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ pt: 1 }}>دریافت فرم امضاشده برای {num(formPending.length)} دستورکار ثبت شود؟</Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button variant="cancel" onClick={close}>انصراف</Button>
                        <Button variant="main" onClick={doForm}>تایید</Button>
                    </DialogActions>
                </Dialog>
            )}

            {result && (
                <Dialog open onClose={() => setResult(null)} fullWidth maxWidth="sm">
                    <DialogTitle>نتیجه: {result.title}</DialogTitle>
                    <DialogContent>
                        <Stack gap={1.5} sx={{ pt: 1 }}>
                            <Alert severity={failed.length === 0 ? 'success' : 'warning'}>
                                {num(result.outcomes.length - failed.length)} موفق
                                {failed.length > 0 && `، ${num(failed.length)} ناموفق`}
                                {result.skipped > 0 && `، ${num(result.skipped)} رد شده (مناسب این کار نبود)`}
                            </Alert>
                            {failed.map((o) => (
                                <Typography key={o.id} variant="body2">دستورکار {num(o.id)}: {o.message || 'انجام نشد'}</Typography>
                            ))}
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button variant="main" onClick={() => setResult(null)}>بستن</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default WorkTaskBulkBar
