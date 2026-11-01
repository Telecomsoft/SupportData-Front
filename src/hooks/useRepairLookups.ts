import { useGetData } from '@hooks/useGetData'
import { REPAIR_STATES } from '@src/data/type/lookups';

type Named = { id: number; name: string }
type Person = { id: number; firstName: string; lastName: string }
// GET api/Repair/Lookups: the state names as { "id": "name" } and the workshop technicians (id and names only)
type RepairEnums = { states?: Record<string, string>; technicians?: Person[] }

const toOptions = (dict: Record<string, string> | undefined, fallback: Named[]): Named[] => {
    const list = Object.entries(dict ?? {}).map(([id, name]) => ({ id: Number(id), name }))
    return list.length ? list : fallback      // if the call fails the built-in list keeps the screens working
}

/**
 * The lists the repair filter and forms need. Option names match the form field names (as in useWorkTaskLookups).
 * A list the user has no permission for comes back empty (the server answers 403), so nothing here can crash a page.
 */
export const useRepairLookups = () => {
    const enums = useGetData<RepairEnums>('api/Repair/Lookups', 'rp-enums')
    const customers = useGetData<Named[]>('api/Customer/ListCustomers', 'lk-customers')
    // needs "devices" read permission; a workshop technician without it just gets no model choices in the register form
    const deviceModels = useGetData<{ id: number; name: string; code?: string | null }[]>('api/Device/ListDeviceModels', 'rp-device-models')
    // needs "errors" read permission (the diagnosis choices), and "base data" read permission (the work done choices)
    const errors = useGetData<{ id: number; code?: string | null; title?: string | null; deviceModelID: number }[]>('api/Error/ListErrors', 'rp-errors')
    const workItems = useGetData<Named[]>('api/BaseData/ListWorkItems?category=2&isActive=true', 'rp-work-items')

    return {
        isLoading: enums.isLoading || customers.isLoading || deviceModels.isLoading || errors.isLoading || workItems.isLoading,
        errorList: errors.data?.value ?? [],
        options: {
            states: toOptions(enums.data?.value?.states, REPAIR_STATES),
            assignedToID: (enums.data?.value?.technicians ?? []).map((p) => ({ id: p.id, name: `${p.firstName} ${p.lastName}`.trim() })),
            customerID: customers.data?.value ?? [],
            deviceModelID: (deviceModels.data?.value ?? []).map((m) => ({ id: m.id, name: m.code ? `${m.name} (${m.code})` : m.name })),
            workItemIDs: (workItems.data?.value ?? []).map((w) => ({ id: w.id, name: w.name })),
        },
    }
}
