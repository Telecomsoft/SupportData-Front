import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid2";
import { sizeConverter } from '@utility//sizeConverter'
import CancelIcon from "@mui/icons-material/Cancel";

const   LinearProgressWithLabel = ({ value, abortHandler, bgcolor = '#eee', color = 'black.0' } : {value: number, abortHandler: () => void, bgcolor?: string, color?: string}) => {
    return (
        <Grid container size={12} alignItems={'center'} columnGap={sizeConverter(8, 'spaceX')} sx={{bgcolor: bgcolor}}>
            <Grid size={'grow'}>
                <LinearProgress variant={'determinate'} value={value}/>
            </Grid>

            <Grid size={'auto'}>
                <Typography sx={{fontSize: sizeConverter(12), color: color}}>{`${Math.round(value)} %`}</Typography>
            </Grid>

            <Grid container size={'auto'} alignItems={'center'} justifyContent={'center'}>
                <CancelIcon onClick={abortHandler} sx={{cursor: 'pointer', color: color, height: sizeConverter(20), width: sizeConverter(20), '&:hover': {color: 'main.0'}, transition: 'all 0.2s ease-in-out' }}/>
            </Grid>
        </Grid>
    );
}

export default LinearProgressWithLabel