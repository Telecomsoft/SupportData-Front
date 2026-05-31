import TypoGeneral from '@components/general/TypoGeneral'
import { Config } from '../type/infoOptionsType'

export const userConfig: Config = [
    {
        value: 'pictureURL',
        name: '',
        size: 12,
        type: 'string',
    },
    {
        value: 'name',
        name: 'نام کاربر',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'loginName',
        name: ' نام کاربری',

        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'roleName',
        name: ' نقش  کاربری',
        component: TypoGeneral,
        size: 12,
        type: 'string',
    },
    {
        value: 'accessAllKiosks',
        name: 'دسترسی به تمام کیوسک ها',
        component: TypoGeneral,
        size: 12,
        type: 'check',
    },
]
