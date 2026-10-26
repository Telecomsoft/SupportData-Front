import Cookies from 'js-cookie'

export const USER_TYPE = { STAFF: 1, SUPPORTER: 2, REPAIRMAN: 3, CONTRACTOR: 4, CUSTOMER: 5 } as const

/**
 * Who is logged in, read from the cookies Login.tsx sets. The SERVER still enforces everything:
 * this only decides what to show (hide a column a customer must not see, hide a button).
 */
export const useUserScope = () => {
    const userType = Number(Cookies.get('userType') ?? USER_TYPE.STAFF)
    const customerID = Cookies.get('customerID') ? Number(Cookies.get('customerID')) : null
    const personnelID = Cookies.get('personnelID') ? Number(Cookies.get('personnelID')) : null

    return {
        userType,
        customerID,
        personnelID,
        isCustomer: customerID !== null,                                                        // sees only its own data, no internal costs
        isContractor: userType === USER_TYPE.CONTRACTOR,                                        // reads only its own statements
        isFieldTechnician: userType === USER_TYPE.SUPPORTER || userType === USER_TYPE.CONTRACTOR, // sees only its own parts
    }
}