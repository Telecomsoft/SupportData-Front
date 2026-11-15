/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import axios from 'axios'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { TASK_TRANSITIONS } from '@src/data/type/lookups'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'
import { useAccessCheck } from '@utility/accessCheck'
import getEndpoint from '@utility/getEndPoint'
import StyledTextField from '@components/general/input/StyledTextField'

/** The one step a task usually takes next, by its state. Other moves (cancel, wait for parts, send back) stay on the task page. */
const NEXT_STEP: Record<number, { to: number; color: 'primary' | 'success' }> = {
    2: { to: 4, color: 'primary' },     // assigned      -> start work
    4: { to: 7, color: 'primary' },     // in progress   -> finish
    5: { to: 4, color: 'primary' },     // waiting parts -> continue work
    7: { to: 8, color: 'success' },     // finished      -> final approval
}

/** The transition this user may take next on a task row (or undefined). The server checks the same rules again. */
export const useNextStep = () => {
    const { canPerform } = useAccessCheck()
    return (task: any) => {
        const next = NEXT_STEP[task?.state]
        if (!next || task.isLocked) return undefined
        const tr = TASK_TRANSITIONS.find((x) => x.from === task.state && x.to === next.to)
        if (!tr || (tr.permission !== 0 && !canPerform(tr.permission))) return undefined
        return { ...tr, color: next.color }
    }
}

type Props = { task: any; snackbarOpen: snackbarOpenType; onDone: () => void }

/**
 * The next-step button of a list row ("تایید نهایی" for a finished task, "شروع کار" for an assigned one...).
 * A click asks for confirmation (with an optional note), then calls the same endpoint as the task page.
 */
const WorkTaskStepButton = ({ task, snackbarOpen, onDone }: Props) => {
    const nextStep = useNextStep()
    const authConfig = useGetAuthorizationConfig()
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState('')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const step = nextStep(task)
    if (!step) return null

    const close = () => { if (busy) return; setOpen(false); setNote(''); setError('') }
    const submit = async () => {
        setBusy(true)
        setError('')
        try {
            const res = await axios.post(getEndpoint() + 'api/WorkTask/ChangeWorkTaskState', { workTaskID: task.id, newState: step.to, note: note || null }, authConfig).then((r) => r.data)
            if (res?.error !== 0) { setError(`${res?.errorMessage ?? 'انجام نشد'}`); return }
            setOpen(false)
            setNote('')
            snackbarOpen(`دستورکار #${task.id}: ${step.label}`, SNACKBAR_SEVERITIES.SUCCESS)
            onDone()
        } catch (e: any) {
            setError(e?.response?.data?.errorMessage ?? e?.message ?? 'انجام نشد')
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            <Button
                size="small" variant="outlined" color={step.color}
                sx={{ whiteSpace: 'nowrap', minWidth: 0, px: 1, py: 0.25, fontSize: 12, lineHeight: 1.4 }}
                onClick={(e) => { e.stopPropagation(); setOpen(true) }}
                onDoubleClick={(e) => e.stopPropagation()}
            >
                {step.label}
            </Button>
            {open && (
                <Dialog open onClose={close} fullWidth maxWidth="xs" onClick={(e) => e.stopPropagation()}>
                    <DialogTitle>{step.label} - دستورکار #{task.id}</DialogTitle>
                    <DialogContent>
                        <Stack gap={2} sx={{ pt: 1 }}>
                            <Typography>{step.confirm}</Typography>
                            {error && <Alert severity="error">{error}</Alert>}
                            <StyledTextField label="توضیح (اختیاری)" value={note} onChange={(e) => setNote(e.target.value)} multiline maxRows={3} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Button variant="cancel" onClick={close} disabled={busy}>انصراف</Button>
                        <Button variant="main" onClick={submit} disabled={busy}>تایید</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default WorkTaskStepButton
