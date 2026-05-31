import { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

export const yesterday = new DateObject({ calendar: persian, locale: persian_fa }).subtract(1, 'day')
export const today = new DateObject({ calendar: persian, locale: persian_fa })
export const lastMonth = new DateObject({ calendar: persian, locale: persian_fa }).subtract(30, 'day')
