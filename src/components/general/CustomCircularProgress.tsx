import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter'

interface ICustomCircularProgress {
    thickness?: number
    size?: number
    sx?: Record<string, unknown>
    color?:string
    noPadding?: boolean
}

const CustomCircularProgress = ({ thickness = sizeConverter(2.5), size = sizeConverter(40), sx, color,noPadding }: ICustomCircularProgress) => {
    return (
        <Grid
            container
            size={12}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ position: 'relative', p: noPadding ? 0 : sizeConverter(20, 'space'), ...sx }}
        >
            <CircularProgress
                variant="determinate"
                sx={{
                    color: 'gray.0',
                }}
                size={size}
                thickness={thickness}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: color ? color : 'black.5',
                    animationDuration: '550ms',
                    position: 'absolute',
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={size}
                thickness={thickness}
                value={100}
            />
        </Grid>
    )
}

export default CustomCircularProgress
