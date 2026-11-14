/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, Paper, Stack, Tooltip, Typography,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PrintIcon from '@mui/icons-material/Print'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { useGetData } from '@hooks/useGetData'
import { usePostData } from '@hooks/usePostData'
import { usePutData } from '@hooks/usePutData'
import { useWorkTaskPdf } from '@hooks/useWorkTaskPdf'
import { fileUrl, uploadFile } from '@utility/uploadFile'
import { dateFn } from '@utility/dateConverter'
import { num } from '@components/section/statements/statementFormat'

type Props = {
    task: any
    /** may attach and remove files (permission 211 "Task - Attach files") and the task is not locked */
    canAttach: boolean
    /** may confirm that the signed paper form came back (permission 208) and has not yet */
    canConfirmForm: boolean
    /** may print the task form (needs the reports permission) */
    canPrint: boolean
    refreshKey: number
    onChanged: () => void
    snackbarOpen: snackbarOpenType
}

const MAX_FILES = 20            // the server's limit per task
const MAX_BYTES = 20_000_000    // the server's limit per file

// what the server accepts (Utility.DefaultAllowedExtensions)
const ACCEPT = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/zip': ['.zip'],
    'application/vnd.ms-outlook': ['.msg'],
}

const extensionOf = (path: string) => path.split('.').pop()?.toLowerCase() ?? ''
const isImage = (ext: string) => ['jpg', 'jpeg', 'png'].includes(ext)
// only what the server stored is a link: anything else (old or hand-made data) is shown but not opened
const isStoredPath = (path: string) => path.startsWith('/SupportFiles/')

/**
 * The files of a work task. The main use: the printed form is filled in and signed at the branch, scanned,
 * and the scan is attached here. Other documents (photos, mails) can be attached too.
 * A file is uploaded first (api/Base/upload) and then linked to the task (api/WorkTask/AddAttachment).
 * Removing only unlinks it: the file stays on the server and the removal is written to the task's history.
 */
const WorkTaskAttachmentsTab = ({ task, canAttach, canConfirmForm, canPrint, refreshKey, onChanged, snackbarOpen }: Props) => {
    const files: string[] = task.attachments ?? []
    const full = files.length >= MAX_FILES
    const { print, printingID } = useWorkTaskPdf(snackbarOpen)
    const attach = usePostData<any, any>('api/WorkTask/AddAttachment', 'wt-attach')
    const detach = usePostData<any, any>('api/WorkTask/RemoveAttachment', 'wt-detach')
    const confirmForm = usePutData<any, any>(`api/WorkTask/ConfirmServiceForm/${task.id}`, 'wt-attach-confirm-form')

    const [uploading, setUploading] = useState<{ name: string; percent: number } | null>(null)
    const [toRemove, setToRemove] = useState<string | null>(null)

    // who attached each file and when: the server writes it to the task history (log kind 5)
    const logs = useGetData<any[]>(`api/WorkTask/ListWorkTaskLogs/${task.id}`, 'worktask-logs', { ids: [String(task.id), String(refreshKey)] })
    const addedBy = useMemo(() => {
        const map = new Map<string, { userName?: string; at: string }>()
        ;(logs.data?.value ?? []).forEach((l) => { if (l.kind === 5 && l.newValue) map.set(l.newValue, { userName: l.userName, at: l.changedAt }) })
        return map
    }, [logs.data])

    const onDrop = async (accepted: File[]) => {
        let done = 0
        const failed: string[] = []
        for (const file of accepted) {
            setUploading({ name: file.name, percent: 0 })
            try {
                const path = await uploadFile(file, (percent) => setUploading({ name: file.name, percent }))
                const res = await attach.mutateAsync({ workTaskID: task.id, filePath: path })
                if (res?.error !== 0) throw new Error(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim())
                done++
            } catch (e) {
                failed.push(`${file.name}: ${e instanceof Error ? e.message : ''}`)
            }
        }
        setUploading(null)
        if (done > 0) {
            snackbarOpen(done === 1 ? 'فایل پیوست شد' : `${num(done)} فایل پیوست شد`, SNACKBAR_SEVERITIES.SUCCESS)
            onChanged()
        }
        if (failed.length > 0) snackbarOpen(failed.join(' | '), SNACKBAR_SEVERITIES.ERROR)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPT,
        maxSize: MAX_BYTES,
        maxFiles: Math.max(MAX_FILES - files.length, 0),
        disabled: !canAttach || full || !!uploading,
        onDropRejected: (rejections) =>
            snackbarOpen(
                `فایل پذیرفته نشد (نوع مجاز: PDF، تصویر، Word، Excel، ZIP، MSG؛ حداکثر ${num(20)} مگابایت و ${num(MAX_FILES)} فایل): ${rejections.map((r) => r.file.name).join('، ')}`,
                SNACKBAR_SEVERITIES.ERROR
            ),
    })

    // the removal is checked by the server, which answers HTTP 200 with { error != 0 } when it refuses
    const remove = (path: string) => {
        setToRemove(null)
        detach.mutateAsync({ workTaskID: task.id, filePath: path }).then(
            (res: any) => {
                if (res?.error === 0) { snackbarOpen('پیوست حذف شد', SNACKBAR_SEVERITIES.SUCCESS); onChanged() }
                else snackbarOpen(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
            },
            (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
        )
    }

    const confirm = () =>
        confirmForm.mutateAsync(undefined).then(
            (res: any) => {
                if (res?.error === 0) { snackbarOpen('دریافت فرم سرویس ثبت شد', SNACKBAR_SEVERITIES.SUCCESS); onChanged() }
                else snackbarOpen(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
            },
            (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
        )

    return (
        <Stack gap={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
                    فرم چاپ‌شده را بعد از تکمیل و مهر و امضای شعبه اسکن کنید و اینجا پیوست کنید. سایر مدارک (عکس، نامه) را هم می‌شود پیوست کرد.
                </Typography>
                {canPrint && (
                    <Button variant="outlined" startIcon={<PrintIcon />} disabled={printingID !== null} onClick={() => print(task.id)} sx={{ borderRadius: 2 }}>
                        چاپ فرم دستورکار
                    </Button>
                )}
            </Stack>

            {task.isLocked && <Alert severity="info">این دستورکار در صورت‌حساب تایید‌شده قفل است؛ پیوست جدید ثبت یا حذف نمی‌شود.</Alert>}

            {canConfirmForm && files.length > 0 && (
                <Alert severity="info" action={<Button color="inherit" size="small" onClick={confirm} disabled={confirmForm.isPending}>تایید دریافت فرم</Button>}>
                    فایل پیوست شده است. اگر این، فرم امضاشده‌ی شعبه است، دریافت فرم سرویس را تایید کنید.
                </Alert>
            )}

            {canAttach && (
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider', borderRadius: 3, p: 3, textAlign: 'center',
                        cursor: full || uploading ? 'default' : 'pointer', bgcolor: isDragActive ? 'action.hover' : 'transparent', opacity: full ? 0.6 : 1,
                    }}
                >
                    <input {...getInputProps()} aria-label="انتخاب فایل" />
                    <UploadFileIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography>
                        {full ? `به حداکثر ${num(MAX_FILES)} فایل رسیده‌اید` : 'فایل را اینجا رها کنید یا برای انتخاب (یا عکس گرفتن با گوشی) کلیک کنید'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">PDF، تصویر، Word، Excel، ZIP، MSG — حداکثر {num(20)} مگابایت</Typography>
                    {uploading && (
                        <Box sx={{ mt: 2, maxWidth: 360, mx: 'auto' }}>
                            <Typography variant="caption" dir="ltr">{uploading.name}</Typography>
                            <LinearProgress variant="determinate" value={uploading.percent} />
                        </Box>
                    )}
                </Box>
            )}

            {files.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>هنوز فایلی پیوست نشده است.</Typography>
            ) : (
                <Stack gap={1.5}>
                    {files.map((path, i) => {
                        const ext = extensionOf(path)
                        const by = addedBy.get(path)
                        const link = isStoredPath(path)
                        return (
                            <Paper key={path} variant="outlined" sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {link && isImage(ext) ? (
                                    <Box component="a" href={fileUrl(path)} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', flexShrink: 0 }}>
                                        <Box component="img" src={fileUrl(path)} alt={`پیوست ${i + 1}`} loading="lazy" sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1, display: 'block' }} />
                                    </Box>
                                ) : (
                                    <Box sx={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 1, flexShrink: 0 }}>
                                        {ext === 'pdf' ? <PictureAsPdfIcon color="error" fontSize="large" /> : <InsertDriveFileIcon color="action" fontSize="large" />}
                                    </Box>
                                )}
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <Typography fontWeight="bold">پیوست {num(i + 1)}</Typography>
                                        <Chip size="small" variant="outlined" label={ext.toUpperCase()} />
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        {by ? `${by.userName ?? ''}${by.userName ? ' — ' : ''}${dateFn(by.at)}` : ' '}
                                    </Typography>
                                </Box>
                                {link && (
                                    <Tooltip title="باز کردن">
                                        <IconButton component="a" href={fileUrl(path)} target="_blank" rel="noopener noreferrer" aria-label="باز کردن پیوست"><OpenInNewIcon /></IconButton>
                                    </Tooltip>
                                )}
                                {canAttach && (
                                    <Tooltip title="حذف پیوست">
                                        <IconButton color="error" onClick={() => setToRemove(path)} aria-label="حذف پیوست"><DeleteOutlineIcon /></IconButton>
                                    </Tooltip>
                                )}
                            </Paper>
                        )
                    })}
                </Stack>
            )}

            <Dialog open={!!toRemove} onClose={() => setToRemove(null)}>
                <DialogTitle>حذف پیوست</DialogTitle>
                <DialogContent>
                    <DialogContentText>این پیوست از دستورکار برداشته می‌شود و در تاریخچه ثبت می‌شود. فایل روی سرور باقی می‌ماند. ادامه می‌دهید؟</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setToRemove(null)}>انصراف</Button>
                    <Button color="error" variant="contained" onClick={() => toRemove && remove(toRemove)}>حذف</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export default WorkTaskAttachmentsTab
