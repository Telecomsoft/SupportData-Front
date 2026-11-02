import { DialogArrayType } from '@type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import SectionTitle from '@components/general/hookFromInputs/SectionTitle'
import JalaliDatePicker from '@components/JalaliDatePicker'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

type Opts = { isMobile: boolean }

// the money and text fields shared by "register" and "edit" (a statement's total is never typed: the server adds it up)
const extras = (half: number): DialogArrayType[] => [
    { label: 'هزینه‌های اضافی (ریال)', value: '_s3', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'هزینه‌های اضافی', value: 'otherCosts', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'شرح هزینه‌های اضافی', value: 'otherCostsDescription', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'جریمه‌های اضافی', value: 'otherPenalties', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'شرح جریمه‌های اضافی', value: 'otherPenaltiesDescription', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]

/** Registering a statement (POST api/Statement/AddStatement). It always starts as "new"; the lines come from "calculate". */
export const buildStatementCreateForm = ({ isMobile }: Opts): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    return [
        { label: 'پیمانکار', value: 'contractorID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'عنوان', value: 'caption', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'از تاریخ', value: 'fromDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'تا تاریخ', value: 'toDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker, validators: { ...REQUIRED_VALIDATOR } },
        { title: 'فقط دستورکارهایی که فرم سرویس‌شان دریافت شده', value: 'onlyFormReceived', kind: 'checkbox', size: 12, component: CheckboxComponent },
        ...extras(half),
    ]
}

/**
 * Editing a statement (PUT api/Statement/UpdateStatement).
 * `locked` = already approved: the contractor, the period and the form filter can no longer change (S3),
 * so those fields are not offered. Before approval, changing any of them deletes the lines and resets it to "new" (S4).
 */
export const buildStatementEditForm = ({ isMobile, locked }: Opts & { locked: boolean }): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    return [
        ...(locked ? [] : [
            { label: 'تغییر پیمانکار، بازه‌ی تاریخ یا فیلتر فرم سرویس، ردیف‌های محاسبه‌شده را پاک می‌کند و صورت‌حساب را به «جدید» برمی‌گرداند.', value: '_msg', kind: 'custom', noValue: true, component: SectionTitle } as DialogArrayType,
            { label: 'پیمانکار', value: 'contractorID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } } as DialogArrayType,
        ]),
        { label: 'عنوان', value: 'caption', kind: 'textField', size: locked ? 12 : half, component: TextFieldComp },
        ...(locked ? [] : [
            { label: 'از تاریخ', value: 'fromDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker, validators: { ...REQUIRED_VALIDATOR } } as DialogArrayType,
            { label: 'تا تاریخ', value: 'toDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker, validators: { ...REQUIRED_VALIDATOR } } as DialogArrayType,
            { title: 'فقط دستورکارهایی که فرم سرویس‌شان دریافت شده', value: 'onlyFormReceived', kind: 'checkbox', size: 12, component: CheckboxComponent } as DialogArrayType,
        ]),
        ...extras(half),
    ]
}
