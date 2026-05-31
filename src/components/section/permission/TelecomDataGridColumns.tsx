import { Checkbox } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { sizeConverter } from '@src/utility/sizeConverter'
import CircleIcon from '@mui/icons-material/Circle'
import { Controller, Control } from 'react-hook-form'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { TelecomColumnsType } from '@type/TelecomDataGridType.ts'

type PermissionColumnsProps = {
    control: Control
    handleAccessChange: (role: any, accessType: string, value: boolean) => void
}


const getPermissionColumns = ({ control, handleAccessChange }: PermissionColumnsProps): TelecomColumnsType[] => {
    return [
        {
            field: 'name',
            headerName: 'نام نقش',
            headerAlign: 'center',
            width: sizeConverter(400, 'width'),
            renderCell: (params) => (
                <Grid container alignItems={'center'} justifyContent={'center'} size={12} columnGap={sizeConverter(4, 'spaceX')}>
                    <Grid container alignItems={'center'} justifyContent={'center'} size="grow">
                        <Typography variant="body1" noWrap>
                            {params.value ?? '-'}
                        </Typography>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: 'readAccess',
            headerAlign: 'center',
            headerName: 'دسترسی خواندن',
            width: sizeConverter(50, 'width'),
            renderCell: (params) => (
                <Grid container size={12} justifyContent={'center'} alignItems={'center'}>
                    <Controller
                        control={control}
                        name={`${params.row.name}_readAccess`}
                        defaultValue={params.value}
                        render={({ field }) => (
                            <Checkbox
                                icon={
                                    <CircleIcon
                                        sx={{
                                            width: sizeConverter(20),
                                            height: sizeConverter(20),
                                            color: 'white.0',
                                            stroke: '#ccc',
                                            strokeWidth: 2,
                                            padding: 0,
                                        }}
                                    />
                                }
                                checkedIcon={
                                    <CheckCircleIcon
                                        sx={{
                                            padding: 0,
                                            color: 'main.primary',
                                            width: sizeConverter(20),
                                            height: sizeConverter(20),
                                        }}
                                    />
                                }
                                checked={field.value}
                                onChange={(e) => {
                                    field.onChange(e?.target?.checked)
                                    handleAccessChange(params.row, 'readAccess', e?.target?.checked)
                                }}
                            />
                        )}
                    />
                </Grid>
            ),
        },
        {
            field: 'writeAccess',
            headerAlign: 'center',
            headerName: 'دسترسی نوشتن',
            width: sizeConverter(100, 'width'),
            renderCell: (params) => (
                <Grid container size={12} justifyContent={'center'} alignItems={'center'}>
                    <Controller
                        control={control}
                        name={`${params.row.name}_writeAccess`}
                        defaultValue={params.value}
                        render={({ field }) => (
                            <Checkbox
                                icon={
                                    <CircleIcon
                                        sx={{
                                            width: sizeConverter(20),
                                            height: sizeConverter(20),
                                            color: 'white.0',
                                            stroke: '#ccc',
                                            strokeWidth: 2,
                                            padding: 0,
                                        }}
                                    />
                                }
                                checkedIcon={
                                    <CheckCircleIcon
                                        sx={{
                                            padding: 0,
                                            color: 'main.primary',
                                            width: sizeConverter(20),
                                            height: sizeConverter(20),
                                        }}
                                    />
                                }
                                checked={field.value}
                                onChange={(e) => {
                                    field.onChange(e?.target?.checked)
                                    handleAccessChange(params.row, 'writeAccess', e?.target?.checked)
                                }}
                            />
                        )}
                    />
                </Grid>
            ),
        },
    ]
}

export default getPermissionColumns
