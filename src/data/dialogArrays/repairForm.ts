import { DialogArrayType } from '@type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import SectionTitle from '@components/general/hookFromInputs/SectionTitle'
import JalaliDatePicker from '@components/JalaliDatePicker'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

/**
 * Registering a repair (POST api/Repair/AddRepair): a part that did not arrive through a "to workshop" movement,
 * e.g. a customer sent it in. It needs a customer or a task (the kiosk and customer are taken from the task).
 */
export const buildRepairCreateForm = (isMobile: boolean): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    return [
        { label: 'مدل قطعه', value: 'deviceModelID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'سریال قطعه', value: 'serial', kind: 'textField', size: half, component: TextFieldComp, ltr: true, helperText: 'برای مدل‌های سریال‌دار الزامی است' },
        { label: 'شماره دستورکار', value: 'workTaskID', type: 'natural', kind: 'textField', size: half, component: TextFieldComp, helperText: 'کیوسک و مشتری از روی آن پر می‌شود' },
        { label: 'مشتری (اگر دستورکار ندارد)', value: 'customerID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
        { label: 'زمان دریافت (خالی = همین حالا)', value: 'receivedAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker },
        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
    ]
}

type EditOpts = {
    isMobile: boolean
    canEditPart: boolean      // the model and serial can be corrected only when the part did not come from a movement
    canEditCustomer: boolean  // the customer can be given only while the repair has no kiosk
}

/** Editing a repair (PUT api/Repair/UpdateRepair). State, assignment and the receive date have their own endpoints. */
export const buildRepairEditForm = ({ isMobile, canEditPart, canEditCustomer }: EditOpts): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    return [
        { label: 'مشخصات قطعه', value: '_s1', kind: 'custom', noValue: true, component: SectionTitle },
        ...(canEditPart ? [
            { label: 'مدل قطعه', value: 'deviceModelID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } } as DialogArrayType,
            { label: 'سریال قطعه', value: 'serial', kind: 'textField', size: half, component: TextFieldComp, ltr: true } as DialogArrayType,
        ] : []),
        ...(canEditCustomer ? [{ label: 'مشتری', value: 'customerID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp } as DialogArrayType] : []),

        { label: 'تشخیص و کار انجام‌شده', value: '_s2', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'خطاهای شناخته‌شده', value: 'errorIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: 12, component: AutoCompleteComp },
        { label: 'کارهای انجام‌شده', value: 'workItemIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: 12, component: AutoCompleteComp },

        { label: 'هزینه‌ها (ریال)', value: '_s3', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'هزینه‌ی تعمیر (برای ما)', value: 'repairCost', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'مبلغ دریافتی از مشتری', value: 'chargedAmount', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },

        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
    ]
}

/** POST api/Repair/AssignRepair */
export const buildRepairAssignForm = (): DialogArrayType[] => [
    { label: 'ارجاع به (تکنسین کارگاه)', value: 'assignedToID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'توضیح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]

/** POST api/Repair/ChangeRepairState */
export const buildRepairChangeStateForm = (message: string): DialogArrayType[] => [
    { label: message, value: '_msg', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'زمان واقعی انجام (خالی = همین حالا)', value: 'effectiveAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker },
    { label: 'توضیح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]
