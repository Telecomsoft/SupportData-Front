/* eslint-disable @typescript-eslint/no-explicit-any */
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { usePostData } from '@hooks/usePostData'
import { snackbarOpenType } from '@type/snackbarOpen'
import { PART_KINDS_NEED_APPROVAL } from '@src/data/type/lookups'

type Props = {
    action: 'complete' | 'cancel'
    transfer: any
    close: () => void
    onDone: () => void
    snackbarOpen: snackbarOpenType
}

/**
 * Complete (POST api/PartTransfer/CompletePartTransfer/{id}) or cancel (.../CancelPartTransfer/{id}) one movement.
 * Neither takes a body. The confirm dialog treats any reply as success, but the server refuses with HTTP 200 and
 * error != 0 (e.g. "not enough stock"), so the request is made here (noApiRequest) and its `error` is checked.
 */
const PartTransferActionDialog = ({ action, transfer, close, onDone, snackbarOpen }: Props) => {
    const complete = action === 'complete'
    const request = usePostData<undefined, any>(
        `api/PartTransfer/${complete ? 'CompletePartTransfer' : 'CancelPartTransfer'}/${transfer.id}`,
        'pt-action'
    )

    const run = () =>
        request.mutate(undefined, {
            onSuccess: (res: any) => {
                if (res?.error === 0) {
                    snackbarOpen(complete ? 'انتقال تکمیل شد' : 'انتقال لغو شد', SNACKBAR_SEVERITIES.SUCCESS)
                    onDone()
                } else {
                    snackbarOpen(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
                }
            },
            onError: (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR),
        })

    // what completing really does, so nobody is surprised
    const effects: string[] = []
    if (complete) {
        effects.push('موجودی طبق این انتقال تغییر می‌کند و بعد از آن قابل لغو نیست.')
        if (transfer.kind === 6) effects.push('قطعه به تعمیرگاه می‌رسد و یک تعمیر جدید برایش ساخته می‌شود.')
        if (PART_KINDS_NEED_APPROVAL.includes(transfer.kind)) effects.push('این نوع انتقال به مجوز «تایید انتقال قطعه» نیاز دارد.')
    }

    return (
        <GeneralConfirmDialog
            isDialogOpen="add"
            dialogTitle={`${complete ? 'تکمیل' : 'لغو'} انتقال #${transfer.id}`}
            confirmMessage={`${complete ? 'انتقال' : 'انتقال در انتظار'} «${transfer.kindName ?? ''}» (${transfer.deviceModelName ?? ''} × ${transfer.quantity}) ${complete ? 'تکمیل شود؟' : 'لغو شود؟'} ${effects.join(' ')}`.trim()}
            snackBarSuccessMessage={complete ? 'انتقال تکمیل شد' : 'انتقال لغو شد'}
            noApiRequest
            noApiRequestFunc={run}
            dialogCloseFun={close}
            snackbarOpen={snackbarOpen}
        />
    )
}

export default PartTransferActionDialog
