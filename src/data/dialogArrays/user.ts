import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import CustomPassword from '@components/section/users/CustomPassword'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { REQUIRED_VALIDATOR } from '../validators/validators'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp.tsx'

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
