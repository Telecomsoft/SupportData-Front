import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import {REQUIRED_VALIDATOR} from "@data/validators/validators.ts";
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete';

export const PAYMENT: DialogArrayType[] = [
    {
        label: 'شناسه پرداخت',
        value: 'paymentIndex',
        kind: 'textField',
        type: 'number',
        size: 5.9,
        component: TextFieldComp,
        validators: { ...REQUIRED_VALIDATOR },
    },
    {
        label: 'رونوشت پرداخت',
        value: 'copyPaymentID',
        kind: 'combo',
        type: 'choice',
        size: 5.9,
        component: AutoCompleteComp,
    },
]