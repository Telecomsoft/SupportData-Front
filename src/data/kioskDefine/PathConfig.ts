import TypoGeneral from '@components/general/TypoGeneral'
import { Config } from '../type/infoOptionsType'

export const PathConfig: Config = [
    {
        value: 'name',
        name: 'نام مسیر',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'dirPath',
        name: 'آدرس',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
]
