/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import { TextField, Typography } from '@mui/material'
import { persianToLatinNumber } from '@utility/persianToLatinNumber'
import { TASK_TYPES } from '@src/data/type/lookups'

type Rate = { workTaskType: number; cost: number; penaltyPerDay: number }

const toNumber = (text: string) => {
    const n = Number(persianToLatinNumber(text).replace(/[^\d]/g, ''))
    return Number.isFinite(n) ? n : 0
}

/**
 * What a contractor / technician is paid per task type, and the penalty per day of delay (rials).
 * One row per task type; a type with both numbers at 0 is simply not saved (the server allows one rate per type).
 */
const PersonnelRatesField = ({ item, control }: any) => (
    <Controller
        name={item.value}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
            const rates: Rate[] = Array.isArray(field.value) ? field.value : []
            const get = (type: number): Rate => rates.find((r) => r.workTaskType === type) ?? { workTaskType: type, cost: 0, penaltyPerDay: 0 }

            const change = (type: number, patch: Partial<Rate>) => {
                const updated = { ...get(type), ...patch }
                const others = rates.filter((r) => r.workTaskType !== type)
                field.onChange(updated.cost > 0 || updated.penaltyPerDay > 0 ? [...others, updated] : others)
            }

            return (
                <Grid container size={item.size ?? 12} rowGap={1}>
                    <Typography variant="body2" sx={{ width: '100%' }}>{item.label}</Typography>
                    {TASK_TYPES.map((t) => (
                        <Grid container size={12} key={t.id} columnGap={1} alignItems="center" wrap="nowrap">
                            <Typography variant="body2" sx={{ minWidth: 90 }}>{t.name}</Typography>
                            <TextField
                                size="small" fullWidth label="مبلغ (ریال)"
                                value={get(t.id).cost || ''}
                                slotProps={{ htmlInput: { dir: 'ltr', inputMode: 'numeric' } }}
                                onChange={(e) => change(t.id, { cost: toNumber(e.target.value) })}
                            />
                            <TextField
                                size="small" fullWidth label="جریمه‌ی هر روز تاخیر"
                                value={get(t.id).penaltyPerDay || ''}
                                slotProps={{ htmlInput: { dir: 'ltr', inputMode: 'numeric' } }}
                                onChange={(e) => change(t.id, { penaltyPerDay: toNumber(e.target.value) })}
                            />
                        </Grid>
                    ))}
                </Grid>
            )
        }}
    />
)

export default PersonnelRatesField