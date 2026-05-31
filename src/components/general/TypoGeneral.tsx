import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import { InfoOptionsProps } from '@src/data/type/infoOptionsType'
import { sizeConverter } from '@src/utility/sizeConverter'
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'

export const TypoGeneral = ({ value, name, type }: InfoOptionsProps) => {
    return (
        <Grid size={12} container justifyContent={'space-between'}>
            <Divider
                textAlign="center"
                flexItem
                style={{
                    width: '100%',
                }}
            >
                <Typography
                    variant='normalBold'
                    sx={{
                        px: sizeConverter(5, 'spaceX'),
                    }}
                >
                    {name}
                </Typography>
            </Divider>
            <Grid
                container
                alignItems={'center'}
                justifyContent={'center'}
                size={12}
    
            >
                {type === 'check' && (
                    <>
                        {value ? (
                            <DoneIcon sx={{ color: 'green.0', fontSize: sizeConverter(18) }} />
                        ) : !value ? (
                            <CancelIcon sx={{ color: 'red.0', fontSize: sizeConverter(18) }} />
                        ) : (
                            '-'
                        )}
                    </>
                )}
                {type !== 'check' && (
                    <Typography
                        variant='normal'
                        sx={{
                            textAlign:'center',
                            userSelect:'text',
                            px: sizeConverter(5, 'spaceX'),
                            direction:'rtl',
                        }}
                    >
                       {type === 'date' && !!value
                            ? new Date(value).toLocaleDateString('fa-IR', {
                               year: 'numeric',
                               month: 'short',
                               day: '2-digit',
                               formatMatcher: 'best fit',
                           })
                            : type === 'string' && !!value
                            ? value
                            : '-'}
                    </Typography>
                )}
            </Grid>
        </Grid>
    )
}

export default TypoGeneral
