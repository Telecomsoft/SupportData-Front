/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccessCheck } from '@utility/accessCheck'
import { useUserScope } from '@hooks/useUserScope'
import { STATEMENT_STATE, STATEMENT_TRANSITIONS } from '@src/data/type/lookups'

/**
 * Which buttons a statement gets (mirrors StatementController / StatementWorkflow). The server checks everything
 * again; this only decides what to show, so nobody is offered a button that is sure to be refused.
 * A contractor user reads their own statements and changes nothing.
 */
export const useStatementRules = () => {
    const { accessCheck, canPerform } = useAccessCheck()
    const { isContractor } = useUserScope()
    const hasWrite = accessCheck({ accessInfoId: 114, KindAccessInfo: 'writeAccess' }) && !isContractor

    return {
        isContractor,
        hasWrite,
        canEdit: (s: any) => hasWrite && s?.state !== STATEMENT_STATE.SETTLED,                       // S1
        canCalculate: (s: any) => hasWrite && s?.state < STATEMENT_STATE.APPROVED,                   // S1, S3
        canDelete: (s: any) => hasWrite && s?.state <= STATEMENT_STATE.SENT,                         // S5
        transitions: (s: any) => (hasWrite ? STATEMENT_TRANSITIONS.filter((x) => x.from === s?.state && (x.permission === 0 || canPerform(x.permission))) : []),
        canSeeUnbilled: !isContractor,
        canOpenWorkTask: accessCheck({ accessInfoId: 111, KindAccessInfo: 'readAccess' }),
    }
}
