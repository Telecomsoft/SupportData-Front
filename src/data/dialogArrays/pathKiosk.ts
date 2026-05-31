import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import { REQUIRED_VALIDATOR } from '@data/validators/validators.ts'

export const PATH_kiosk: DialogArrayType[] = [
    {
        label: 'نام مسیر',
        value: 'name',
        kind: 'textField',
        ltr: true,
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'آدرس',
        value: 'dirPath',
        kind: 'textField',
        ltr: true,
        size: 12,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
]
