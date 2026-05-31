import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import { REQUIRED_VALIDATOR } from '@data/validators/validators.ts'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'

export const SERVICE: DialogArrayType[] = [
    {
        label: 'نام سرویس',
        value: 'serviceName',
        kind: 'textField',
        size: 5.9,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'رونوشت سرویس',
        value: 'copyServiceID',
        kind: 'combo',
        type: 'choice',
        size: 5.9,
        component: AutoCompleteComp,
    },
]
export const SERVICE_PAYMENT: DialogArrayType[] = [
    {
        label: 'Name',
        value: 'settingName',
        kind: 'textField',
        size: 12,
        ltr:true,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'Value',
        value: 'settingValue',
        kind: 'textField',
        size: 12,
        ltr:true,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'Kind',
        value: 'itemKind',
        type: 'name',
        kind: 'combo',
        size: 12,
        ltr:true,
        component: AutoCompleteComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
]
