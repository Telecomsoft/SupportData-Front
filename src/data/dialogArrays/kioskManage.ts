import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import { REQUIRED_VALIDATOR } from '@data/validators/validators.ts'

export const MANAGE: DialogArrayType[] = [
    {
        label: 'نام مدیریت',
        value: 'name',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'کد مدیریت',
        value: 'code',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
]
