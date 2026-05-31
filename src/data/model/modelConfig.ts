import TypoGeneral from '@components/general/TypoGeneral'
import { Config } from '../type/infoOptionsType'

export const modelConfig: Config = [
    {
        value: 'pictureURL',
        name: '',
        size: 12,
        type: 'string',
    },
    {
        value: 'name',
        name: 'نام مدل',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'manufacturer',
        name: ' نام سازنده',

        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
]
