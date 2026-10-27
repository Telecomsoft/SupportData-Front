import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import CustomPassword from '@components/section/users/CustomPassword'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { REQUIRED_VALIDATOR } from '../validators/validators'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp.tsx'
import ConditionalField from '@components/general/hookFromInputs/ConditionalField'

export const USER: DialogArrayType[] = [
    {
        label: 'اسم کاربر',
        value: 'userName',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: ' نقش کاربر',
        value: 'roleID',
        type: 'choice',
        kind: 'combo',
        size: 12,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        title: 'غیر فعال بودن',
        value: 'disabled',
        kind: 'checkbox',
        size: 12,
        component: CheckboxComponent,
    },
    {
        label: 'نوع کاربر',
        value: 'userType',
        type: 'choice',
        kind: 'combo',
        size: 12,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        // only a customer user belongs to a customer; the server refuses any other combination
        label: 'مشتری',
        value: 'customerID',
        type: 'choice',
        kind: 'combo',
        size: 12,
        component: ConditionalField,
        inner: AutoCompleteComp,
        showWhen: (v: any) => v.userType?.id === 5,
        validators: { ...REQUIRED_VALIDATOR },
    },
    // {
    //     label: 'پرسنل مرتبط (اختیاری)',
    //     value: 'personnelID',
    //     type: 'choice',
    //     kind: 'combo',
    //     size: 12,
    //     component: AutoCompleteComp,
    // },
]

export const ASSIGNPASSWORD = [
    {
        label: 'تکرار رمز عبور ',
        value: 'password',
        type: 'password',
        kind: 'textField',
        size: 12,
        component: CustomPassword,
    },
]
