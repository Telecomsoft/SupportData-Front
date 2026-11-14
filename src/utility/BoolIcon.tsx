import { Grid2 } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

export const BoolIcon = ({ value }: { value: boolean }) => (
    <Grid2 container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        {value
            ? <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />
            : <CloseIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
    </Grid2>
)