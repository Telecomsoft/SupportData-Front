import Grid from '@mui/material/Grid2'
import Checkbox from '@mui/material/Checkbox'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Controller } from 'react-hook-form'
import { Typography } from '@mui/material'
import { sizeConverter } from '@src/utility/sizeConverter'
import { formTypes } from '@src/data/type/reactHookFormType'
import { useDevice } from '@src/hooks/useDevice'

type CheckProps = {
    item: {
        title: string
        size?: number
        disabled?: boolean
        value?: string
        kind?: string
        fontSize?: number
        component?: React.ReactNode | React.ReactNode[]
    }
} & formTypes

const CheckboxComponent = ({ item, control }: CheckProps) => {
    const disabled = item?.disabled
    const { isMobile } = useDevice()

    return (
        <Grid
            container
            size={item.size}
            sx={{
                my: sizeConverter(8, 'spaceY'),
                px: sizeConverter(8, 'spaceX'),
                '& .MuiFormControlLabel-root': { cursor: disabled ? 'default' : 'pointer' },
            }}
        >
            <FormControlLabel
                label={'sd'}
                {...(!item?.title && { sx: { mx: 0 } })}
                control={
                    <Controller
                        name={item.value ?? ''}
                        control={control}
                        defaultValue={false}
                        render={({ field: props }) => (
                            <Checkbox
                                sx={!isMobile ? { p: 0 } : {}}
                                {...props}
                                // style={{ padding: item.space ? item.space : 0, ...(item?.style || {}) }}
                                disabled={disabled}
                                icon={
                                    <CircleIcon
                                        sx={{
                                            width: isMobile ? 30 : sizeConverter(20),
                                            height: isMobile ? 30 : sizeConverter(20),
                                            color: 'white.0',
                                            stroke: '#ccc',
                                            strokeWidth: 2,
                                            ml: sizeConverter(4, 'spaceX'),
                                        }}
                                    />
                                }
                                checkedIcon={
                                    <CheckCircleIcon
                                        sx={{
                                            padding: 0,
                                            color: item?.disabled ? 'gray.0' : 'fontColor.0',
                                            width: isMobile ? 30 : sizeConverter(20),
                                            height: isMobile ? 30 : sizeConverter(20),
                                            ml: sizeConverter(4, 'spaceX'),
                                        }}
                                    />
                                }
                                checked={props.value}
                                onChange={(e) => props.onChange(e?.target?.checked)}
                            />
                        )}
                    />
                }
                {...(item?.title && {
                    label: (
                        <Typography sx={{ fontSize: isMobile ? 14 : sizeConverter(10), pl: sizeConverter(5, 'spaceX'), opacity: disabled ? 0.5 : 1, }}>
                            {item.title}
                        </Typography>
                    ),
                })}
            />
        </Grid>
    )
}

export default CheckboxComponent
