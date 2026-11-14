import { useEffect, useState } from 'react'
import JalaliFilterDate from '@components/general/JalaliFilterDate'
import { Autocomplete, Stack } from '@mui/material'
import StyledTextField from '@components/general/input/StyledTextField'

type Opt = { id: number; name: string }

export type PartTransferFilterState = {
    kind: Opt | null
    state: Opt | null
    deviceModel: Opt | null
    technician: Opt | null
    workTaskID: string
    from: string | null          // "YYYY-MM-DDT00:00:00"
    to: string | null            // "YYYY-MM-DDT00:00:00" (the server treats a midnight "to" as the whole day)
}

export const EMPTY_PART_TRANSFER_FILTER: PartTransferFilterState = {
    kind: null, state: null, deviceModel: null, technician: null, workTaskID: '', from: null, to: null,
}

type Props = {
    value: PartTransferFilterState
    onChange: (next: PartTransferFilterState) => void
    kinds: Opt[]
    states: Opt[]
    deviceModels: Opt[]
    technicians: Opt[]
    isFieldTechnician: boolean   // a field technician only sees their own movements: no technician filter
}


/** The filter row above the movement list. Every change goes to the server (the list is paged there). */
const PartTransferFilterBar = ({ value, onChange, kinds, states, deviceModels, technicians, isFieldTechnician }: Props) => {
    // the task number is typed: wait until the typing stops before asking the server
    const [taskID, setTaskID] = useState(value.workTaskID)
    useEffect(() => {
        const t = setTimeout(() => value.workTaskID !== taskID && onChange({ ...value, workTaskID: taskID }), 400)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskID])

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
    const date = (label: string, current: string | null, set: (iso: string | null) => void) => (
        <JalaliFilterDate label={label} value={current} onChange={set} />
    )

    return (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {combo('نوع انتقال', kinds, value.kind, (kind) => onChange({ ...value, kind }))}
            {combo('وضعیت', states, value.state, (state) => onChange({ ...value, state }))}
            {combo('مدل قطعه', deviceModels, value.deviceModel, (deviceModel) => onChange({ ...value, deviceModel }))}
            {!isFieldTechnician && combo('تکنسین', technicians, value.technician, (technician) => onChange({ ...value, technician }))}
            <StyledTextField size="small" label="شماره فعالیت" value={taskID} onChange={(e) => setTaskID(e.target.value.replace(/\D/g, ''))} sx={{ width: 130 }} />
            {date('ثبت از', value.from, (from) => onChange({ ...value, from }))}
            {date('ثبت تا', value.to, (to) => onChange({ ...value, to }))}
        </Stack>
    )
}

export default PartTransferFilterBar
