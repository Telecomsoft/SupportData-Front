/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccessCheck } from '@utility/accessCheck'
import { useUserScope } from '@hooks/useUserScope'
import { PART_KINDS_NEED_APPROVAL, PART_STATE } from '@src/data/type/lookups'

/**
 * Which buttons a movement gets (mirrors PartTransferController). The server checks everything again;
 * this only decides what to show, so nobody is offered a button that is sure to be refused.
 */
export const usePartTransferRules = () => {
    const { accessCheck, canPerform } = useAccessCheck()
    const { isFieldTechnician, personnelID } = useUserScope()
    const hasWrite = accessCheck({ accessInfoId: 112, KindAccessInfo: 'writeAccess' })

    return {
        hasWrite,
        isFieldTechnician,
        // the warehouse confirms, never the technician; stock-releasing kinds also need the approve permission (230)
        canComplete: (t: any) =>
            hasWrite && !isFieldTechnician && t?.state === PART_STATE.PENDING &&
            (!PART_KINDS_NEED_APPROVAL.includes(t.kind) || canPerform(230)),
        // only a pending movement; a technician only their own
        canCancel: (t: any) =>
            hasWrite && t?.state === PART_STATE.PENDING &&
            (!isFieldTechnician || (personnelID != null && t.technicianID === personnelID)),
        canOpenWorkTask: accessCheck({ accessInfoId: 111, KindAccessInfo: 'readAccess' }),
        canOpenKiosk: accessCheck({ accessInfoId: 110, KindAccessInfo: 'readAccess' }),
        canOpenRepair: accessCheck({ accessInfoId: 113, KindAccessInfo: 'readAccess' }),
    }
}
