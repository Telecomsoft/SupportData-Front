/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { persianToLatinNumber } from '@utility/persianToLatinNumber'

/** A list of phone numbers (the server keeps them as a JSON list of strings). */
const PhonesField = ({ item, control }: any) => (
    <Controller
        name={item.value}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
            const phones: string[] = Array.isArray(field.value) ? field.value : []
            return (
                <Grid container size={item.size ?? 12} rowGap={1}>
                    <Typography variant="body2" sx={{ width: '100%' }}>{item.label}</Typography>
                    {phones.map((phone, i) => (
                        <Grid container size={12} key={i} columnGap={1} alignItems="center" wrap="nowrap">
                            <TextField
                                size="small"
                                fullWidth
                                value={phone}
                                slotProps={{ htmlInput: { dir: 'ltr', inputMode: 'tel' } }}
                                onChange={(e) =>
                                    field.onChange(phones.map((p, j) => (j === i ? persianToLatinNumber(e.target.value) : p)))
                                }
                            />
                            <IconButton onClick={() => field.onChange(phones.filter((_, j) => j !== i))}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Grid>
                    ))}
                    <Button size="small" startIcon={<AddIcon />} onClick={() => field.onChange([...phones, ''])}>
                        افزودن شماره
                    </Button>
                </Grid>
            )
        }}
    />
)

export default PhonesField