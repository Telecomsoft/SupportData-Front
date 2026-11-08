/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { snackbarOpenType } from '@type/snackbarOpen'
import { buildWorkTaskDetailsForm } from '@src/data/dialogArrays/workTaskForm'
import { WORK_MODES } from '@src/data/type/lookups'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'

type Opt = { id: number; name: string }

// the options of a "multiple" combo must contain every id the task already has, or saving would silently drop it
const withMissing = (options: Opt[], ids: number[] | null | undefined, make: (id: number) => Opt) => {
    const have = new Set(options.map((o) => o.id))
    return [...options, ...(ids ?? []).filter((id) => !have.has(id)).map(make)]
}

type Props = {
    taskID: number
    close: () => void
    onSaved?: () => void          // called after a successful save (refresh the page / list)
    snackbarOpen: snackbarOpenType
}

/**
 * The second edit dialog of a work task: diagnosis, work done and every cost (PUT api/WorkTask/UpdateWorkTask).
 * It loads the task itself, so the detail page and the list can open it the same way.
 */
const WorkTaskDetailsDialog = ({ taskID, close, onSaved, snackbarOpen }: Props) => {
    const { isMobile } = useDevice()
    const { isCustomer } = useUserScope()
    const lookups = useWorkTaskLookups()

    const taskQuery = useGetData<any>(`api/WorkTask/GetWorkTask/${taskID}`, 'worktask-detail', { ids: [String(taskID)] })
    const t = taskQuery.data?.value
    const suggestions = useGetData<any[]>(`api/Error/SuggestForKiosk/${t?.kioskID}`, 'worktask-error-suggestions', {
        ids: [String(t?.kioskID)], enabled: !!t?.kioskID && !isCustomer,
    })

    const form = useMemo(() => buildWorkTaskDetailsForm({ isMobile }), [isMobile])

    const errorOptions = useMemo(() => {
        const all = new Map<number, Opt>()
        const add = (e: any) => all.set(e.id, { id: e.id, name: `${e.code} - ${e.title}` })
        ;(suggestions.data?.value ?? []).forEach(add)
        ;(t?.errors ?? []).forEach(add)                                              // the ones already chosen (with their text)
        ;(t?.errorIDs ?? []).forEach((eid: number) => { if (!all.has(eid)) all.set(eid, { id: eid, name: `خطا #${eid}` }) })
        return [...all.values()]
    }, [suggestions.data, t])
    const workItemOptions = useMemo(
        () => withMissing(lookups.options.workItemIDs, t?.workItemIDs, (wid) => ({ id: wid, name: `کار #${wid}` })),
        [lookups.options.workItemIDs, t]
    )

    // always edit the freshest copy of the task: wait for the (re)fetch before the form opens
    const ready = !!t && !taskQuery.isFetching && !lookups.isLoading && !(t.kioskID && suggestions.isLoading)
    if (!ready) {
        return (
            <Dialog open onClose={close}>
                <DialogContent sx={{ p: 4 }}><CustomCircularProgress thickness={2} size={50} /></DialogContent>
            </Dialog>
        )
    }

    return (
        <GeneralDialog
            open="edit"
            title={`تشخیص، کار انجام‌شده و هزینه‌ها - فعالیت #${t.id}`}
            width={sizeConverter(820, 'width')}
            close={close}
            array={form}
            editEndpoint="api/WorkTask/UpdateWorkTask"
            autoCompleteOption={{ workMode: WORK_MODES, errorIDs: errorOptions, workItemIDs: workItemOptions }}
            defaultValue={{ ...t }}
            sendFinalData
            apiValueGetter={((data: any) => {
                // the whole current row is the base, so fields that are not in this dialog keep their value.
                // `errors` is only for display (the server fills it on GET), never sent back.
                const { errors: _errors, ...base } = t
                void _errors
                return buildPayload(form, data, base)
            }) as any}
            wrapperFunc={() => onSaved?.()}
            snackbarOpen={snackbarOpen}
        />
    )
}

export default WorkTaskDetailsDialog
