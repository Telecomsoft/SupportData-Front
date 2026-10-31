import { useGetData } from '@hooks/useGetData'
import { useUserScope } from '@hooks/useUserScope'

type Named = { id: number; name: string }
type Person = { id: number; firstName: string; lastName: string; personnelType: number; contractorID?: number | null; companyName?: string | null }
type WorkItem = { id: number; name: string }

const CONTRACTOR = 4

/**
 * The lists the work task filter and forms need. Option names match the form field names (as in useKioskLookups).
 * A list the user has no permission for simply comes back empty (the server answers 403), so nothing here can crash a page.
 */
export const useWorkTaskLookups = () => {
    const { isCustomer } = useUserScope()
    const customers = useGetData<Named[]>('api/Customer/ListCustomers', 'lk-customers')
    const cities = useGetData<Named[]>('api/Location/ListCities', 'lk-cities')
    // active field technicians AND contractors (the same list the "assign to" dropdown uses)
    const technicians = useGetData<Person[]>('api/Personnel/ListTechnicians', 'lk-technicians', { enabled: !isCustomer })
    // needs "base data" read permission; a technician without it just gets no "work done" choices
    const workItems = useGetData<WorkItem[]>('api/BaseData/ListWorkItems?category=1&isActive=true', 'wt-work-items', { enabled: !isCustomer })

    const people = technicians.data?.value ?? []
    const label = (p: Person) => `${p.firstName} ${p.lastName}`.trim() + (p.personnelType === CONTRACTOR ? ' (پیمانکار)' : '')

    return {
        isLoading: customers.isLoading || cities.isLoading || technicians.isLoading || workItems.isLoading,
        options: {
            customerID: customers.data?.value ?? [],
            cityID: cities.data?.value ?? [],
            assignedToID: people.map((p) => ({ id: p.id, name: label(p) })),
            contractorID: people.filter((p) => p.personnelType === CONTRACTOR).map((p) => ({ id: p.id, name: label(p) })),
            workItemIDs: (workItems.data?.value ?? []).map((w) => ({ id: w.id, name: w.name })),
        },
    }
}
