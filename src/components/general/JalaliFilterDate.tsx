import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import StyledTextField from '@components/general/input/StyledTextField'

type Props = {
    label: string
    /** the picked day as a local ISO string ("2026-11-12T00:00:00"), or null when empty */
    value: string | null
    onChange: (iso: string | null) => void
    /** true for a "to" date: the day is sent as 23:59:59 instead of 00:00:00 */
    endOfDay?: boolean
    width?: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** The picked Jalali day as a local ISO string. No timezone shift: the day the user sees is the day the server gets. */
export const toIsoDay = (d: DateObject, endOfDay = false) => {
    const g = d.toDate()
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}T${endOfDay ? '23:59:59' : '00:00:00'}`
}

/**
 * One Jalali date field for the filter rows (work tasks, repairs, part transfers, statements, reports).
 * It uses the date picker's render function, so only the props a text field understands reach the input
 * (passing the picker's own props to a TextField printed "React does not recognize the openCalendar prop").
 */
const JalaliFilterDate = ({ label, value, onChange, endOfDay = false, width = 140 }: Props) => (
    <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={value ? new Date(value) : ''}
        onChange={(d: DateObject | null) => onChange(d instanceof DateObject ? toIsoDay(d, endOfDay) : null)}
        render={(text, openCalendar, handleValueChange) => (
            <StyledTextField
                size="small"
                label={label}
                sx={{ width }}
                value={text}
                onFocus={openCalendar}
                onChange={handleValueChange}
                InputLabelProps={{ shrink: !!value || undefined }}
            />
        )}
    />
)

export default JalaliFilterDate
