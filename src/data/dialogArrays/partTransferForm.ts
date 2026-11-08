import { DialogArrayType } from '@type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

/**
 * Registering a movement (POST api/PartTransfer/AddPartTransfer). It is always created as "pending";
 * the warehouse completes it later, which is when the stock really changes.
 * `serials` is one text (a serial per line): the page turns it into the list the server wants.
 */
export const buildPartTransferCreateForm = ({ isMobile, isFieldTechnician }: { isMobile: boolean; isFieldTechnician: boolean }): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    return [
        { label: 'نوع انتقال', value: 'kind', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'مدل قطعه', value: 'deviceModelID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'تعداد', value: 'quantity', type: 'natural', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR, validate: (v: unknown) => Number(v) >= 1 || 'تعداد باید حداقل ۱ باشد' } },
        // a field technician is always "the technician" of their own movements: the server uses their own record
        ...(isFieldTechnician ? [] : [
            { label: 'تکنسین (برای تحویل، بازگشت و ارسال به تعمیرگاه)', value: 'technicianID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp } as DialogArrayType,
        ]),
        { label: 'شماره فعالیت', value: 'workTaskID', type: 'natural', kind: 'textField', size: half, component: TextFieldComp, helperText: 'اختیاری؛ کیوسک و مشتری از روی آن پر می‌شود' },
        { label: 'سریال‌ها (هر سریال در یک خط)', value: 'serials', kind: 'textField', multiline: true, maxRows: 5, size: 12, component: TextFieldComp, ltr: true, helperText: 'فقط برای مدل‌های سریال‌دار؛ تعداد سریال‌ها باید با تعداد برابر باشد' },
        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
    ]
}

/** "A1\nA2, A3" -> ["A1","A2","A3"]; nothing typed -> null (the server wants a list only for serial-tracked models) */
export const parseSerials = (text: unknown): string[] | null => {
    const list = String(text ?? '').split(/[\n,،;\s]+/).map((s) => s.trim()).filter(Boolean)
    return list.length ? list : null
}
