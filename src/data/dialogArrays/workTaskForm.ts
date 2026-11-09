import { DialogArrayType } from '@type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import SectionTitle from '@components/general/hookFromInputs/SectionTitle'
import JalaliDatePicker from '@components/JalaliDatePicker'
import KioskSearchField from '@components/section/workTasks/KioskSearchField'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

type Opts = { isMobile: boolean; isCustomer?: boolean; canAssign?: boolean }

/**
 * Registering a task (POST api/WorkTask/AddWorkTask). Only what the person reporting knows: the rest
 * (diagnosis, costs...) is filled in later, on the task's own page, with the edit form and the details form.
 */
export const buildWorkTaskCreateForm = ({ isMobile, isCustomer, canAssign }: Opts): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9

    return [
        // the form value `kiosk` is the chosen kiosk object; the page sends its id (see the add dialog's apiValueGetter)
        { label: 'کیوسک (سریال، کد/نام شعبه، شهر، مشتری ...)', value: 'kiosk', kind: 'custom', size: 12, component: KioskSearchField, helperText: 'برای خرابی و بازدید الزامی است' },
        { label: 'نوع دستورکار', value: 'workTaskType', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        ...(isCustomer ? [] : [
            { label: 'مشتری (فقط وقتی کیوسک ندارد)', value: 'customerID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp } as DialogArrayType,
            { label: 'زمان گزارش (خالی = همین حالا)', value: 'reportedAt', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker } as DialogArrayType,
        ]),
        { label: 'شرح مشکل', value: 'reportedIssue', kind: 'textField', multiline: true, maxRows: 4, size: 12, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
        ...(canAssign && !isCustomer
            ? [{ label: 'ارجاع به (خالی = تکنسین پیش‌فرض کیوسک)', value: 'assignedToID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp } as DialogArrayType]
            : []),
        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
    ]
}

// In the edit dialog these are shown (same items as the add dialog) but locked: the server never changes them through
// UpdateWorkTask (kiosk: R11, customer: comes from the kiosk, report time: CorrectWorkTaskDates, assignee: AssignWorkTask).
const EDIT_LOCKED = ['customerID', 'reportedAt', 'assignedToID']
const EDIT_LABELS: Record<string, string> = { customerID: 'مشتری', reportedAt: 'زمان گزارش', assignedToID: 'ارجاع به' }

/**
 * Editing a task (PUT api/WorkTask/UpdateWorkTask): exactly the items of the add dialog.
 * The ones the server can't change here are locked; the diagnosis, work done and costs are in buildWorkTaskDetailsForm.
 */
export const buildWorkTaskEditForm = ({ isMobile }: Opts): DialogArrayType[] =>
    buildWorkTaskCreateForm({ isMobile, isCustomer: false, canAssign: true }).map((item): DialogArrayType => {
        // the kiosk of a task can't change (R11): the edit dialog shows its serial, locked, instead of the search
        if (item.value === 'kiosk') {
            return { label: 'سریال کیوسک', value: 'kioskSerial', kind: 'textField', size: 12, component: TextFieldComp, ltr: true, editDisabled: true }
        }
        return EDIT_LOCKED.includes(item.value)
            ? { ...item, label: EDIT_LABELS[item.value] ?? item.label, helperText: undefined, editDisabled: true }
            : item
    })

/** Diagnosis, work done and costs of a task (PUT api/WorkTask/UpdateWorkTask too). Staff only. */
export const buildWorkTaskDetailsForm = ({ isMobile }: Opts): DialogArrayType[] => {
    const half = isMobile ? 12 : 5.9
    const third = isMobile ? 12 : 3.8

    return [
        { label: 'تشخیص و کار انجام‌شده', value: '_s1', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'نحوه‌ی انجام کار', value: 'workMode', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp },
        { label: 'خطاهای شناخته‌شده', value: 'errorIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: 12, component: AutoCompleteComp },
        { label: 'توضیح تشخیص', value: 'diagnosisNote', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
        { label: 'کارهای انجام‌شده', value: 'workItemIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: 12, component: AutoCompleteComp },
        { label: 'توضیح کار انجام‌شده', value: 'workDoneNote', kind: 'textField', multiline: true, maxRows: 3, size: half, component: TextFieldComp },
        { label: 'تعداد مراجعه', value: 'numberOfVisits', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },

        { label: 'هزینه‌های ما (ریال)', value: '_s2', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'بلیت', value: 'costTicket', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'ایاب و ذهاب', value: 'costTransportation', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'اقامت', value: 'costStay', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'سایر', value: 'costOther', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },

        { label: 'مبالغ مشتری (ریال)', value: '_s3', kind: 'custom', noValue: true, component: SectionTitle },
        { label: 'هزینه‌ی کارشناسی', value: 'customerInspectionCost', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'هزینه‌ی ایاب و ذهاب', value: 'customerTransportationCost', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'هزینه‌ی قطعه', value: 'customerPartCost', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'سایر', value: 'customerOtherCost', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'مبلغ دریافتی', value: 'receivedAmount', type: 'natural', kind: 'textField', size: third, component: TextFieldComp },
        { label: 'شماره فاکتور', value: 'invoiceNo', kind: 'textField', size: third, component: TextFieldComp, ltr: true },
    ]
}

/** POST api/WorkTask/AssignWorkTask */
export const buildAssignForm = (): DialogArrayType[] => [
    { label: 'ارجاع به', value: 'assignedToID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'پیمانکار (خالی = شرکت پیمانکاری خود تکنسین)', value: 'contractorID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp },
    { label: 'توضیح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]

/** POST api/WorkTask/ChangeWorkTaskState */
export const buildChangeStateForm = (message: string): DialogArrayType[] => [
    { label: message, value: '_msg', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'زمان واقعی انجام (خالی = همین حالا)', value: 'effectiveAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker },
    { label: 'توضیح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]

/** POST api/WorkTask/CorrectWorkTaskDates */
export const buildCorrectDatesForm = (hasFinished: boolean): DialogArrayType[] => [
    { label: 'مهلت و روز تاخیر دوباره محاسبه می‌شوند و این تغییر در تاریخچه ثبت می‌ماند.', value: '_msg', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'زمان گزارش', value: 'reportedAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker },
    ...(hasFinished ? [{ label: 'زمان اتمام', value: 'finishedAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker } as DialogArrayType] : []),
    { label: 'دلیل اصلاح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
]

/** PUT api/WorkTask/RecordWorkTaskPayment */
export const buildPaymentForm = (): DialogArrayType[] => [
    { label: 'مبلغ پرداخت‌شده (ریال)', value: 'paidAmount', type: 'natural', kind: 'textField', size: 12, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR, validate: (v: unknown) => Number(v) > 0 || 'مبلغ باید بیشتر از صفر باشد' } },
    { label: 'شماره پیگیری / مرجع پرداخت', value: 'paymentRef', kind: 'textField', size: 12, component: TextFieldComp, ltr: true },
    { label: 'تاریخ پرداخت (خالی = امروز)', value: 'paidAt', type: 'date', kind: 'textField', size: 12, component: JalaliDatePicker },
]

/** POST api/WorkTask/ReplaceKioskPart: the faulty part comes out of the kiosk, a part from the technician's stock goes in. */
export const buildReplacePartForm = (): DialogArrayType[] => [
    { label: 'قطعه‌ی خارج‌شونده (خراب)', value: 'removeKioskPartID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp },
    { label: 'قطعه‌ی نصب‌شونده (از موجودی تکنسین)', value: 'fitDeviceModelID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp },
    { label: 'سریال قطعه‌ی نصب‌شونده', value: 'fitSerial', kind: 'textField', size: 12, component: TextFieldComp, ltr: true, helperText: 'فقط برای قطعاتی که سریال دارند' },
    { label: 'توضیح', value: 'note', kind: 'textField', multiline: true, maxRows: 3, size: 12, component: TextFieldComp },
]
