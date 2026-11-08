import { useEffect, useState } from 'react'
import { Autocomplete, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { TASK_STATES, TASK_TYPES } from '@src/data/type/lookups'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }

export type WorkTaskFilterState = {
    states: Opt[]
    types: Opt[]
    customer: Opt | null
    city: Opt | null
    assignedTo: Opt | null
    kioskSerial: string
    branchCode: string
    branchName: string
    from: string | null          // "YYYY-MM-DDT00:00:00"
    to: string | null            // "YYYY-MM-DDT23:59:59"
    overdueOnly: boolean
}

export const EMPTY_WORKTASK_FILTER: WorkTaskFilterState = {
    states: [], types: [], customer: null, city: null, assignedTo: null, kioskSerial: '', branchCode: '', branchName: '', from: null, to: null, overdueOnly: false,
}

type Props = {
    value: WorkTaskFilterState
    onChange: (next: WorkTaskFilterState) => void
    customers: Opt[]
    cities: Opt[]
    technicians: Opt[]
    isCustomer: boolean          // a customer user has no customer / technician filter
}

const pad = (n: number) => String(n).padStart(2, '0')
// the picked Jalali day as a local "YYYY-MM-DD" (no timezone shift, same idea as JalaliDatePicker)
const toIsoDay = (d: DateObject, end: boolean) => {
    const g = d.toDate()
    return `${g.getFullYear()}-${pad(g.getMonth() + 1)}-${pad(g.getDate())}T${end ? '23:59:59' : '00:00:00'}`
}

/** The filter row above the work task list. Every change goes to the server (the list is paged there). */
const WorkTaskFilterBar = ({ value, onChange, customers, cities, technicians, isCustomer }: Props) => {
    // the serial, branch code and branch name are typed: wait until the typing stops before asking the server
    const [typed, setTyped] = useState({ kioskSerial: value.kioskSerial, branchCode: value.branchCode, branchName: value.branchName })
    useEffect(() => {
        const changed = typed.kioskSerial !== value.kioskSerial || typed.branchCode !== value.branchCode || typed.branchName !== value.branchName
        const t = setTimeout(() => changed && onChange({ ...value, ...typed }), 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typed])

    const combo = (label: string, options: Opt[], selected: Opt | null, set: (o: Opt | null) => void) => (
        <Autocomplete
            size="small"
            sx={{ minWidth: 170 }}
            options={options}
            value={selected}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => set(o)}
            renderInput={(p) => <StyledTextField{...p} label={label} />}
        />
    )
    const multi = (label: string, options: Opt[], selected: Opt[], set: (o: Opt[]) => void) => (
        <Autocomplete
            multiple
            size="small"
            sx={{ minWidth: 200 }}
            options={options}
            value={selected}
            limitTags={1}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => set(o)}
            renderInput={(p) => <StyledTextField{...p} label={label} />}
        />
    )
    const date = (label: string, current: string | null, set: (iso: string | null) => void, end: boolean) => (
        <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={current ? new Date(current) : ''}
            onChange={(d: DateObject | null) => set(d instanceof DateObject ? toIsoDay(d, end) : null)}
            render={<StyledTextField size="small" label={label} sx={{ width: 140 }} InputLabelProps={{ shrink: !!current || undefined }} />}
        />
    )

    return (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {multi('وضعیت', TASK_STATES, value.states, (states) => onChange({ ...value, states }))}
            {multi('نوع', TASK_TYPES, value.types, (types) => onChange({ ...value, types }))}
            {!isCustomer && combo('مشتری', customers, value.customer, (customer) => onChange({ ...value, customer }))}
            {combo('شهر', cities, value.city, (city) => onChange({ ...value, city }))}
            {!isCustomer && combo('ارجاع‌شده به', technicians, value.assignedTo, (assignedTo) => onChange({ ...value, assignedTo }))}
            <StyledTextField size="small" label="سریال کیوسک" value={typed.kioskSerial} onChange={(e) => setTyped((p) => ({ ...p, kioskSerial: e.target.value }))} sx={{ width: 150 }} />
            <StyledTextField size="small" label="کد شعبه" value={typed.branchCode} onChange={(e) => setTyped((p) => ({ ...p, branchCode: e.target.value }))} sx={{ width: 130 }} />
            <StyledTextField size="small" label="نام شعبه" value={typed.branchName} onChange={(e) => setTyped((p) => ({ ...p, branchName: e.target.value }))} sx={{ width: 160 }} />
            {date('گزارش از', value.from, (from) => onChange({ ...value, from }), false)}
            {date('گزارش تا', value.to, (to) => onChange({ ...value, to }), true)}
            <ToggleButtonGroup size="small"  exclusive value={value.overdueOnly ? 'overdue' : 'all'} onChange={(_, v) => v && onChange({ ...value, overdueOnly: v === 'overdue' })}>
                <ToggleButton color="primary" value="all">همه</ToggleButton>
                <ToggleButton color="primary" value="overdue">فقط دیرکردها</ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}

export default WorkTaskFilterBar
