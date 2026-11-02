/* eslint-disable @typescript-eslint/no-explicit-any */
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { usePostData } from '@hooks/usePostData'
import { useDeleteData } from '@hooks/useDeleteData'
import { snackbarOpenType } from '@type/snackbarOpen'

export type StatementAction =
    | { kind: 'calculate' }
    | { kind: 'delete' }
    | { kind: 'state'; to: number; label: string; confirm: string }

type Props = {
    action: StatementAction
    statement: any
    close: () => void
    onDone: (action: StatementAction['kind']) => void
    snackbarOpen: snackbarOpenType
}

/**
 * Calculate (POST api/Statement/CalculateStatement/{id}), change state (POST api/Statement/ChangeStatementState)
 * or delete (DELETE api/Statement/DeleteStatement/{id}) one statement.
 * The confirm dialog treats any reply as success, but the server refuses with HTTP 200 and error != 0
 * (e.g. a workflow rule), so the request is made here (noApiRequest) and its `error` is checked.
 */
const StatementActionDialog = ({ action, statement, close, onDone, snackbarOpen }: Props) => {
    const post = usePostData<any, any>(
        action.kind === 'calculate' ? `api/Statement/CalculateStatement/${statement.id}` : 'api/Statement/ChangeStatementState',
        'st-action'
    )
    const del = useDeleteData<undefined, any>(`api/Statement/DeleteStatement/${statement.id}`, 'st-delete')

    const handle = {
        onSuccess: (res: any) => {
            if (res?.error === 0) {
                snackbarOpen(
                    action.kind === 'calculate' ? 'صورت‌حساب محاسبه شد' : action.kind === 'delete' ? 'صورت‌حساب حذف شد' : 'وضعیت صورت‌حساب تغییر کرد',
                    SNACKBAR_SEVERITIES.SUCCESS
                )
                onDone(action.kind)
            } else {
                snackbarOpen(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
            }
        },
        onError: (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR),
    }

    const run = () => {
        if (action.kind === 'delete') del.mutate(undefined, handle)
        else if (action.kind === 'calculate') post.mutate(undefined, handle)
        else post.mutate({ statementID: statement.id, newState: action.to }, handle)
    }

    const title =
        action.kind === 'calculate' ? 'محاسبه‌ی صورت‌حساب' : action.kind === 'delete' ? 'حذف صورت‌حساب' : action.label
    const message =
        action.kind === 'calculate'
            ? 'ردیف‌های فعلی پاک می‌شوند و دستورکارهای تمام‌شده‌ی پیمانکار در این بازه دوباره جمع می‌شوند. ادامه می‌دهی؟'
            : action.kind === 'delete'
              ? 'صورت‌حساب و همه‌ی ردیف‌های آن حذف می‌شود؛ دستورکارها آزاد می‌شوند. حذف شود؟'
              : action.confirm

    return (
        <GeneralConfirmDialog
            isDialogOpen="add"
            dialogTitle={`${title} #${statement.id}`}
            confirmMessage={message}
            snackBarSuccessMessage="انجام شد"
            noApiRequest
            noApiRequestFunc={run}
            dialogCloseFun={close}
            snackbarOpen={snackbarOpen}
        />
    )
}

export default StatementActionDialog
