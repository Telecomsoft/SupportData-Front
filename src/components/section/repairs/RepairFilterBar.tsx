import { useEffect, useState } from 'react'
import JalaliFilterDate from '@components/general/JalaliFilterDate'
import { Autocomplete, Stack } from '@mui/material'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }

export type RepairFilterState = {
    states: Opt[]
    deviceModel: Opt | null
    customer: Opt | null
    assignedTo: Opt | null
    serial: string
    workTaskID: string
    from: string | null          // "YYYY-MM-DDT00:00:00"
    to: string | null            // "YYYY-MM-DDT23:59:59"
}

export const EMPTY_REPAIR_FILTER: RepairFilterState = {
    states: [], deviceModel: null, customer: null, assignedTo: null, serial: '', workTaskID: '', from: null, to: null,
}

type Props = {
    value: RepairFilterState
    onChange: (next: RepairFilterState) => void
    states: Opt[]
    deviceModels: Opt[]
    customers: Opt[]
    technicians: Opt[]
}


/** The filter row above the repair list. Every change goes to the server (the list is paged there). */
const RepairFilterBar = ({ value, onChange, states, deviceModels, customers, technicians }: Props) => {
    // the serial and the task number are typed: wait until the typing stops before asking the server
    const [serial, setSerial] = useState(value.serial)
    const [taskID, setTaskID] = useState(value.workTaskID)
    useEffect(() => {
        const t = setTimeout(() => {
            if (value.serial !== serial || value.workTaskID !== taskID) onChange({ ...value, serial, workTaskID: taskID })
        }, 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serial, taskID])

    const combo = (label: string, options: Opt[], selected: Opt | null, set: (o: Opt | null) => void) => (
        <Autocomplete
            size="small"
            sx={{ minWidth: 170 }}
            options={options}
            value={selected}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => set(o)}
            renderInput={(p) => <StyledTextField {...p} label={label} />}
        />
    )
    const date = (label: string, current: string | null, set: (iso: string | null) => void, end: boolean) => (
        <JalaliFilterDate label={label} value={current} onChange={set} endOfDay={end} />
    )

    return (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Autocomplete
                multiple
                size="small"
                sx={{ minWidth: 200 }}
                options={states}
                value={value.states}
                limitTags={1}
                getOptionLabel={(o) => o.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onChange={(_, o) => onChange({ ...value, states: o })}
                renderInput={(p) => <StyledTextField {...p} label="وضعیت" />}
            />
            {combo('مدل قطعه', deviceModels, value.deviceModel, (deviceModel) => onChange({ ...value, deviceModel }))}
            {combo('مشتری', customers, value.customer, (customer) => onChange({ ...value, customer }))}
            {combo('ارجاع‌شده به', technicians, value.assignedTo, (assignedTo) => onChange({ ...value, assignedTo }))}
            <StyledTextField size="small" label="سریال قطعه" value={serial} onChange={(e) => setSerial(e.target.value)} sx={{ width: 150 }} />
            <StyledTextField size="small" label="شماره فعالیت" value={taskID} onChange={(e) => setTaskID(e.target.value.replace(/\D/g, ''))} sx={{ width: 130 }} />
            {date('دریافت از', value.from, (from) => onChange({ ...value, from }), false)}
            {date('دریافت تا', value.to, (to) => onChange({ ...value, to }), true)}
        </Stack>
    )
}

export default RepairFilterBar
