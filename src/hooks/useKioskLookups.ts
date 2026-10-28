import { useGetData } from '@hooks/useGetData'

type Named = { id: number; name: string }
type Person = { id: number; firstName: string; lastName: string }
type ContractRow = { id: number; contractNo: string; name: string }

/** The lists the kiosk form and the kiosk filter need. Option names match the form's field names. */
export const useKioskLookups = () => {
    const models = useGetData<Named[]>('api/BaseData/ListKioskModels', 'lk-kiosk-models')
    const customers = useGetData<Named[]>('api/Customer/ListCustomers', 'lk-customers')
    const contracts = useGetData<ContractRow[]>('api/Contract/ListContracts', 'lk-contracts')
    const cities = useGetData<Named[]>('api/Location/ListCities', 'lk-cities')
    // needs "tasks" read or "assign" permission on the server; without it the list is just empty
    const technicians = useGetData<Person[]>('api/Personnel/ListTechnicians', 'lk-technicians')

    const technicianOptions = (technicians.data?.value ?? []).map((p) => ({ id: p.id, name: `${p.firstName} ${p.lastName}`.trim() }))

    return {
        isLoading: models.isLoading || customers.isLoading || contracts.isLoading || cities.isLoading,
        options: {
            kioskModelID: models.data?.value ?? [],
            customerID: customers.data?.value ?? [],
            contractID: (contracts.data?.value ?? []).map((c) => ({ id: c.id, name: `${c.contractNo} - ${c.name}` })),
            cityID: cities.data?.value ?? [],
            defaultTechnicianID: technicianOptions,
            supporterIDs: technicianOptions,
        },
    }
}