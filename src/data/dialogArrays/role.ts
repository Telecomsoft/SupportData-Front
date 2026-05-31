import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import { REQUIRED_VALIDATOR } from '../validators/validators'


export const ROLEDIALOG: DialogArrayType[] = [
    {
        label: 'نام نقش',
        value: 'name',
        kind: 'textField',
        size: 12,
        component: TextFieldComp,
        validators:{...REQUIRED_VALIDATOR}

    },
]
