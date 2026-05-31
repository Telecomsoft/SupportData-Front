import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import JalaliDatePicker from '@components/JalaliDatePicker'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { REQUIRED_VALIDATOR } from '../validators/validators'
//modelID
export const KIOSK: DialogArrayType[] = [
    {
        label: 'نام کیوسک',
        value: 'kioskName',
        kind: 'textField',
        size: 3.9,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },

    {
        label: 'سریال سخت افزار',
        value: 'hardwareSerial',
        kind: 'textField',
        ltr: true,
        size: 3.9,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'سریال کیوسک',
        value: 'kioskSerial',
        kind: 'textField',
        editDisabled: true,
        ltr: true,
        size: 3.9,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'مدل',
        value: 'modelID',
        kind: 'combo',
        type: 'choice',
        size: 3.9,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'استان',
        value: 'regionID',
        kind: 'combo',
        type: 'choice',
        size: 3.9,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    { label: 'شهر', value: 'city', kind: 'textField', size: 3.9, component: TextFieldComp },
    { label: 'کد شعبه', value: 'branchCode', kind: 'textField', size: 3.9, component: TextFieldComp },
    { label: 'نام شعبه', value: 'branchName', kind: 'textField', size: 3.9, component: TextFieldComp },
    { label: 'تلفن پشتیبانی', value: 'supportTel', kind: 'textField', size: 3.9, component: TextFieldComp },

    { label: 'نام پشتیبان', value: 'supportName', kind: 'textField', size: 3.9, component: TextFieldComp },
    {
        label: 'نام مدیریت',
        value: 'managingID',
        kind: 'combo',
        type: 'choice',
        size: 3.9,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'تاریخ نصب',
        value: 'installationDate',
        type: 'date',
        kind: 'textField',
        size: 3.9,
        component: JalaliDatePicker,
    },
    { label: 'آدرس', value: 'address', kind: 'textField', size: 12, component: TextFieldComp, multiline: true, rows: 1 },

    // {
    //     label: 'عکس کیوسک',
    //     value: 'pictureURL',
    //     uploadType: 'single',
    //     kind: 'uploadFile',
    //     size: 3.9,
    //     component: UploadFile,
    // },
    {
        label: 'توضیحات',
        value: 'explanation',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        multiline: true,
        rows: 1,
    },
]

export const KIOSK_GROUP: DialogArrayType[] = [
    {
        label: 'نام گروه',
        value: 'name',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'توضیحات',
        value: 'description',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        multiline: true,
        rows: 1,
    },
]
