import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { PART_KINDS, PART_KINDS_CREATABLE, PART_KINDS_WITH_TECHNICIAN, PART_LOCATIONS, PART_STATES } from '@src/data/type/lookups'

type Named = { id: number; name: string }
type Person = { id: number; firstName: string; lastName: string; personnelType: number }
// GET api/PartTransfer/Lookups: three { "id": "name" } objects
type Dict = Record<string, string>
type PartEnums = { kinds?: Dict; states?: Dict; locations?: Dict }

const toOptions = (dict: Dict | undefined, fallback: Named[]): Named[] => {
    const list = Object.entries(dict ?? {}).map(([id, name]) => ({ id: Number(id), name }))
    return list.length ? list : fallback      // if the call fails the built-in list keeps the screens working
}

/**
 * The lists the part transfer filter and forms need. Option names match the form field names (as in useRepairLookups).
 * A list the user has no permission for comes back empty (the server answers 403), so nothing here can crash a page.
 */
export const usePartTransferLookups = () => {
    const { isFieldTechnician } = useUserScope()
    const enums = useGetData<PartEnums>('api/PartTransfer/Lookups', 'pt-enums')
    // needs "devices" read permission; without it the model combos are empty
    const deviceModels = useGetData<{ id: number; name: string; code?: string | null }[]>('api/Device/ListDeviceModels', 'rp-device-models')
    // a field technician only ever deals with their own parts, so they never need this list
    const technicians = useGetData<Person[]>('api/Personnel/ListTechnicians', 'lk-technicians', { enabled: !isFieldTechnician })

    const kinds = toOptions(enums.data?.value?.kinds, PART_KINDS)
    // what a person may register: no kiosk fit/take-out, and a field technician only the movements that involve themselves
    const creatable = kinds.filter((k) => PART_KINDS_CREATABLE.includes(k.id) && (!isFieldTechnician || PART_KINDS_WITH_TECHNICIAN.includes(k.id)))

    return {
        isLoading: enums.isLoading || deviceModels.isLoading || technicians.isLoading,
        options: {
            kind: creatable,
            kinds,
            states: toOptions(enums.data?.value?.states, PART_STATES),
            locations: toOptions(enums.data?.value?.locations, PART_LOCATIONS),
            deviceModelID: (deviceModels.data?.value ?? []).map((m) => ({ id: m.id, name: m.code ? `${m.name} (${m.code})` : m.name })),
            technicianID: (technicians.data?.value ?? []).map((p) => ({ id: p.id, name: `${p.firstName} ${p.lastName}`.trim() + (p.personnelType === 4 ? ' (پیمانکار)' : '') })),
        },
    }
}
