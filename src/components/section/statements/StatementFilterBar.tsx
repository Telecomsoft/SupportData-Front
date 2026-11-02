import { Autocomplete, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

type Opt = { id: number; name: string }

export type StatementFilterState = {
    contractor: Opt | null
    states: Opt[]
    includeSettled: boolean
    from: string | null          // "YYYY-MM-DDT00:00:00": statements whose period overlaps From..To
    to: string | null
}

export const EMPTY_STATEMENT_FILTER: StatementFilterState = { contractor: null, states: [], includeSettled: false, from: null, to: null }

type Props = {
    value: StatementFilterState
    onChange: (next: StatementFilterState) => void
    states: Opt[]
    contractors: Opt[]
    isContractor: boolean        // a contractor user sees only their own statements: no contractor filter
}

const pad = (n: number) => String(n).padStart(2, '0')
const toIsoDay = (d: DateObject) => {
    const g = d.toDate()
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}T00:00:00`
}

/** The filter row above the statement list. Every change goes to the server (the list is paged there). */
const StatementFilterBar = ({ value, onChange, states, contractors, isContractor }: Props) => {
    const date = (label: string, current: string | null, set: (iso: string | null) => void) => (
        <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={current ? new Date(current) : ''}
            onChange={(d: DateObject | null) => set(d instanceof DateObject ? toIsoDay(d) : null)}
            render={<TextField size="small" label={label} sx={{ width: 140 }} InputLabelProps={{ shrink: !!current || undefined }} />}
        />
    )

    return (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1 }}>
            {!isContractor && (
                <Autocomplete
                    size="small"
                    sx={{ minWidth: 200 }}
                    options={contractors}
                    value={value.contractor}
                    getOptionLabel={(o) => o.name}
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    onChange={(_, contractor) => onChange({ ...value, contractor })}
                    renderInput={(p) => <TextField {...p} label="پیمانکار" />}
                />
            )}
            <Autocomplete
                multiple
                size="small"
                sx={{ minWidth: 200 }}
                options={states}
                value={value.states}
                limitTags={1}
                getOptionLabel={(o) => o.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onChange={(_, s) => onChange({ ...value, states: s })}
                renderInput={(p) => <TextField {...p} label="وضعیت" />}
            />
            {date('بازه از', value.from, (from) => onChange({ ...value, from }))}
            {date('بازه تا', value.to, (to) => onChange({ ...value, to }))}
            {/* settled statements are hidden unless asked (the server's old default); picking states overrides this */}
            <ToggleButtonGroup size="small" exclusive value={value.includeSettled ? 'all' : 'open'} onChange={(_, v) => v && onChange({ ...value, includeSettled: v === 'all' })}>
                <ToggleButton value="open">بدون تسویه‌شده‌ها</ToggleButton>
                <ToggleButton value="all">همه</ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}

export default StatementFilterBar
