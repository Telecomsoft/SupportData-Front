import { useEffect, useState, type ReactNode } from 'react'
import JalaliFilterDate from '@components/general/JalaliFilterDate'
import Grid from '@mui/material/Grid2'
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { TASK_STATES, TASK_TYPES } from '@src/data/type/lookups'
import StyledTextField from '@components/general/input/StyledTextField'
import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete'
import { sizeConverter } from '@utility/sizeConverter'

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

type Cell = { key: string; node: ReactNode }

/** The filter area above the work task list. Every change goes to the server (the list is paged there). */
const WorkTaskFilterBar = ({ value, onChange, customers, cities, technicians, isCustomer }: Props) => {
    // the serial, branch code and branch name are typed: wait until the typing stops before asking the server
    const [typed, setTyped] = useState({ kioskSerial: value.kioskSerial, branchCode: value.branchCode, branchName: value.branchName })
    useEffect(() => {
        const changed = typed.kioskSerial !== value.kioskSerial || typed.branchCode !== value.branchCode || typed.branchName !== value.branchName
        const t = setTimeout(() => changed && onChange({ ...value, ...typed }), 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typed])

    // anything different from the default filter? (the clear button is only active then)
    const isDefault = JSON.stringify(value) === JSON.stringify(EMPTY_WORKTASK_FILTER) &&
        !typed.kioskSerial && !typed.branchCode && !typed.branchName
    const clearAll = () => {
        setTyped({ kioskSerial: '', branchCode: '', branchName: '' })      // the typed boxes too, or they would bring the old text back
        onChange({ ...EMPTY_WORKTASK_FILTER })
    }

    const inputHeight = sizeConverter(30, 'height')

    const combo = (label: string, options: Opt[], selected: Opt | null, set: (o: Opt | null) => void) => (
        <StyledAutoComplete
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { height: inputHeight } }}
            options={options}
            value={selected}
            getOptionLabel={(o: any) => o.name}
            isOptionEqualToValue={(a: any, b: any) => a.id === b.id}
            onChange={(_, o: any) => set(o)}
            renderInput={(p) => <StyledTextField {...p} label={label} />}
        />
    )
    const multi = (label: string, options: Opt[], selected: Opt[], set: (o: Opt[]) => void) => (
        <StyledAutoComplete
            multiple
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { minHeight: inputHeight, height: 'auto' } }}
            options={options}
            value={selected}
            limitTags={1}
            getOptionLabel={(o: any) => o.name}
            isOptionEqualToValue={(a: any, b: any) => a.id === b.id}
            onChange={(_, o: any) => set(o)}
            renderInput={(p) => <StyledTextField {...p} label={label} />}
        />
    )
    const text = (label: string, field: 'kioskSerial' | 'branchCode' | 'branchName') => (
        <StyledTextField size="small" fullWidth label={label} value={typed[field]} onChange={(e) => setTyped((p) => ({ ...p, [field]: e.target.value }))} />
    )
    const date = (label: string, current: string | null, set: (iso: string | null) => void, end: boolean) => (
        <JalaliFilterDate label={label} value={current} onChange={set} endOfDay={end} width={sizeConverter(170, 'width')} />
    )

    // Two rows, and each row is a 12-column Grid split evenly between its items, so there is no empty space.
    // (a customer user has no customer / technician filter, so the first row has fewer items)
    const row1: Cell[] = [
        { key: 'states', node: multi('وضعیت', TASK_STATES, value.states, (states) => onChange({ ...value, states })) },
        { key: 'types', node: multi('نوع', TASK_TYPES, value.types, (types) => onChange({ ...value, types })) },
        ...(isCustomer ? [] : [{ key: 'customer', node: combo('مشتری', customers, value.customer, (customer) => onChange({ ...value, customer })) }]),
        { key: 'city', node: combo('شهر', cities, value.city, (city) => onChange({ ...value, city })) },
        ...(isCustomer ? [] : [{ key: 'assignedTo', node: combo('ارجاع‌شده به', technicians, value.assignedTo, (assignedTo) => onChange({ ...value, assignedTo })) }]),
        { key: 'serial', node: text('سریال کیوسک', 'kioskSerial') },
    ]
    const row2: Cell[] = [
        { key: 'branchCode', node: text('کد شعبه', 'branchCode') },
        { key: 'branchName', node: text('نام شعبه', 'branchName') },
        { key: 'from', node: date('گزارش از', value.from, (from) => onChange({ ...value, from }), false) },
        { key: 'to', node: date('گزارش تا', value.to, (to) => onChange({ ...value, to }), true) },
        {
            key: 'overdue',
            node: (
                <ToggleButtonGroup fullWidth size="small" exclusive value={value.overdueOnly ? 'overdue' : 'all'} sx={{ height: inputHeight }}
                    onChange={(_, v: any) => v && onChange({ ...value, overdueOnly: v === 'overdue' })}>
                    <ToggleButton value="all">همه</ToggleButton>
                    <ToggleButton value="overdue">فقط دیرکردها</ToggleButton>
                </ToggleButtonGroup>
            ),
        },
        {
            key: 'clear',
            node: (
                <Button fullWidth size="small" variant="outlined" startIcon={<FilterAltOffIcon />} disabled={isDefault} onClick={clearAll}
                    sx={{ height: inputHeight, borderRadius: 2, whiteSpace: 'nowrap' }}>
                    پاک کردن
                </Button>
            ),
        },
    ]
    const cells = (row: Cell[]) =>
        row.map((c) => <Grid key={c.key} size={{ xs: 12, sm: 6, md: 12 / row.length }}>{c.node}</Grid>)

    return (
        <Grid
            container
            spacing={sizeConverter(8, 'spaceX')}
            alignItems="center"
            sx={{ mb: sizeConverter(8, 'spaceY'), p: sizeConverter(8, 'spaceX'), bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
            {cells(row1)}
            {cells(row2)}
        </Grid>
    )
}

export default WorkTaskFilterBar
