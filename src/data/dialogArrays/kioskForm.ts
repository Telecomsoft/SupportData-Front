import { DialogArrayType } from '@type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import SectionTitle from '@components/general/hookFromInputs/SectionTitle'
import JalaliDatePicker from '@components/JalaliDatePicker'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

/** The kiosk add / edit form. (The three passwords are NOT here: they have their own permission and tab.) */
export const buildKioskForm = (isMobile: boolean): DialogArrayType[] => {
    const third = isMobile ? 12 : 3.8
    const half = isMobile ? 12 : 5.9

    return [
        { label: 'مشخصات', value: '_s1', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'سریال', value: 'serial', kind: 'textField', size: third, component: TextFieldComp, ltr: true, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'مدل کیوسک', value: 'kioskModelID', kind: 'combo', type: 'choice', size: third, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'مشتری', value: 'customerID', kind: 'combo', type: 'choice', size: third, component: AutoCompleteComp },
        { label: 'قرارداد', value: 'contractID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
        { title: 'فعال', value: 'isActive', kind: 'checkbox', size: half, component: CheckboxComponent },

        { label: 'محل نصب', value: '_s2', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'شهر', value: 'cityID', kind: 'combo', type: 'choice', size: third, component: AutoCompleteComp },
        { label: 'کد شعبه', value: 'branchCode', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'نام شعبه', value: 'branchName', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'فاصله تا مرکز استان (کیلومتر)', value: 'distanceFromCenterKm', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'آدرس', value: 'address', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },

        { label: 'تاریخ‌ها', value: '_s3', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'تاریخ فروش', value: 'saleDate', type: 'date', kind: 'textField', size: third, component: JalaliDatePicker },
        { label: 'تاریخ ارسال', value: 'shippingDate', type: 'date', kind: 'textField', size: third, component: JalaliDatePicker },
        { label: 'تاریخ نصب', value: 'installationDate', type: 'date', kind: 'textField', size: third, component: JalaliDatePicker },
        { label: 'شروع گارانتی (در صورتی که قرارداد «تاریخ خود کیوسک» باشد)', value: 'warrantyStartDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker },

        { label: 'پشتیبانی', value: '_s4', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'تکنسین پیش‌فرض (تسک‌های جدید به او ارجاع می‌شود)', value: 'defaultTechnicianID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
        { label: 'پشتیبان‌ها', value: 'supporterIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: half, component: AutoCompleteComp },

        { label: 'ترمینال و ذی‌نفع', value: '_s5', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'IP', value: 'ipAddress', kind: 'textField', size: third, component: TextFieldComp, ltr: true },
        { label: 'شماره ترمینال (TerminalID)', value: 'terminalID', kind: 'textField', size: third, component: TextFieldComp, ltr: true },
        { label: 'پذیرنده (Merchant)', value: 'merchant', kind: 'textField', size: third, component: TextFieldComp, ltr: true },
        { label: 'ترمینال', value: 'terminal', kind: 'textField', size: third, component: TextFieldComp, ltr: true },
        { label: 'شماره پرونده', value: 'fileNo', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'نام ذی‌نفع', value: 'beneficiaryName', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'تلفن ذی‌نفع', value: 'beneficiaryPhone', kind: 'textField', size: third, component: TextFieldComp, ltr: true },

        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
    ]
}