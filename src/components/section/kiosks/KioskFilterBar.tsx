import { useEffect, useState } from 'react'
import { Autocomplete, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'

type Opt = { id: number; name: string }

export type KioskFilterState = {
    customer: Opt | null
    city: Opt | null
    model: Opt | null
    branchCode: string
    isActive: boolean | null   // null = all
}

export const EMPTY_KIOSK_FILTER: KioskFilterState = { customer: null, city: null, model: null, branchCode: '', isActive: null }

type Props = {
    value: KioskFilterState
    onChange: (next: KioskFilterState) => void
    customers: Opt[]
    cities: Opt[]
    models: Opt[]
}

/** The filter row above the kiosk list. Every change goes to the server (the list is paged there). */
const KioskFilterBar = ({ value, onChange, customers, cities, models }: Props) => {
    // the branch code is typed: wait until the typing stops before asking the server
    const [branch, setBranch] = useState(value.branchCode)
    useEffect(() => {
        const t = setTimeout(() => value.branchCode !== branch && onChange({ ...value, branchCode: branch }), 400)
        return () => clearTimeout(t)
    }, [branch])

    const combo = (label: string, options: Opt[], selected: Opt | null, set: (o: Opt | null) => void) => (
        <Autocomplete
            size="small"
            sx={{ minWidth: 180 }}
            options={options}
            value={selected}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, o) => set(o)}
            renderInput={(p) => <TextField {...p} label={label} />}
        />
    )

    return (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mb: 1 }}>
            {combo('مشتری', customers, value.customer, (o) => onChange({ ...value, customer: o }))}
            {combo('شهر', cities, value.city, (o) => onChange({ ...value, city: o }))}
            {combo('مدل', models, value.model, (o) => onChange({ ...value, model: o }))}
            <TextField size="small" label="کد شعبه" value={branch} onChange={(e) => setBranch(e.target.value)} sx={{ width: 120 }} />
            <ToggleButtonGroup
                size="small"
                exclusive
                value={value.isActive === null ? 'all' : value.isActive ? 'active' : 'inactive'}
                onChange={(_, v) => v && onChange({ ...value, isActive: v === 'all' ? null : v === 'active' })}
            >
                <ToggleButton value="all">همه</ToggleButton>
                <ToggleButton value="active">فعال</ToggleButton>
                <ToggleButton value="inactive">غیرفعال</ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    )
}

export default KioskFilterBar