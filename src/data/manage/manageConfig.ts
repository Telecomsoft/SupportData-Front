import TypoGeneral from '@components/general/TypoGeneral'
import { Config } from '../type/infoOptionsType'

export const manageConfig: Config = [
    {
        value: 'name',
        name: 'نام مدیریت',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'code',
        name: 'کد مدیریت',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
]
