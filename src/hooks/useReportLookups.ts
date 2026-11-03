import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { TASK_STATES, TASK_TYPES } from '@src/data/type/lookups'

type Named = { id: number; name: string }
// GET api/WorkTask/Lookups answers { states, types, workModes }, each a { "id": "name" } object
type Dict = Record<string, string>

// if the call fails (or is empty) the built-in list is used, so the filters still work
const toOptions = (dict: Dict | undefined, fallback: Named[]): Named[] => {
    const list = Object.entries(dict ?? {}).map(([id, name]) => ({ id: Number(id), name }))
    return list.length ? list : fallback
}

/**
 * The lists the reports need: everything the work task screens already load (states, types, customers, cities, technicians,
 * work items; shared through the same query keys, so nothing is fetched twice) plus the part models and the known errors.
 * A list the user has no permission for comes back empty (the server answers 403), so nothing here can crash a page.
 */
export const useReportLookups = () => {
    const { isCustomer } = useUserScope()
    const base = useWorkTaskLookups()
    // the state and type names are read here (same query key as the work task screens, so it is fetched once), not taken
    // from useWorkTaskLookups: the reports must not break if that hook is an older copy that does not have them
    const enums = useGetData<{ states?: Dict; types?: Dict }>('api/WorkTask/Lookups', 'wt-enums')
    // needs "devices" read permission (the model a part was fitted/removed on a task)
    const deviceModels = useGetData<{ id: number; name: string; code?: string | null }[]>('api/Device/ListDeviceModels', 'rp-device-models', { enabled: !isCustomer })
    // needs "errors" read permission; the knowledge base is internal, so a customer user never asks for it
    const errors = useGetData<{ id: number; code?: string | null; title?: string | null }[]>('api/Error/ListErrors', 'rp-errors', { enabled: !isCustomer })

    return {
        isLoading: base.isLoading || enums.isLoading || deviceModels.isLoading || errors.isLoading,
        options: {
            ...base.options,
            states: toOptions(enums.data?.value?.states, TASK_STATES),
            types: toOptions(enums.data?.value?.types, TASK_TYPES),
            deviceModelID: (deviceModels.data?.value ?? []).map((m): Named => ({ id: m.id, name: m.code ? `${m.name} (${m.code})` : m.name })),
            errorID: (errors.data?.value ?? []).map((e): Named => ({ id: e.id, name: `${e.code ?? ''} ${e.title ?? ''}`.trim() || `#${e.id}` })),
        },
    }
}
