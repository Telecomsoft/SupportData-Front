import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'
import { STATEMENT_STATES } from '@src/data/type/lookups'

type Person = { id: number; firstName: string; lastName: string; companyName?: string | null; personnelType?: number }
const CONTRACTOR = 4

const labelOf = (p: Person) => (p.companyName && p.companyName.trim() ? p.companyName : `${p.firstName} ${p.lastName}`.trim())

/**
 * The lists the statement filter and forms need. Option names match the form field names (as in useRepairLookups).
 * There is no "contractors" endpoint, so they come from two lists that exist for other screens and are merged:
 * the personnel list (needs "personnel" read permission) and the technician list (needs "tasks" read or "assign").
 * Whichever the user may read fills the combo; a list the user may not read just comes back empty (403).
 */
export const useStatementLookups = () => {
    const { isContractor } = useUserScope()
    // a contractor user only ever sees their own statements, so they need no contractor list
    const personnel = useGetData<Person[]>('api/Personnel/ListPersonnel?type=4&isActive=true', 'st-contractors', { enabled: !isContractor })
    const technicians = useGetData<Person[]>('api/Personnel/ListTechnicians', 'lk-technicians', { enabled: !isContractor })

    const all = new Map<number, { id: number; name: string }>()
    ;(personnel.data?.value ?? []).forEach((p) => all.set(p.id, { id: p.id, name: labelOf(p) }))
    ;(technicians.data?.value ?? []).filter((p) => p.personnelType === CONTRACTOR).forEach((p) => { if (!all.has(p.id)) all.set(p.id, { id: p.id, name: labelOf(p) }) })

    return {
        isLoading: personnel.isLoading || technicians.isLoading,
        options: {
            states: STATEMENT_STATES,
            contractorID: [...all.values()].sort((a, b) => a.name.localeCompare(b.name, 'fa')),
        },
    }
}
