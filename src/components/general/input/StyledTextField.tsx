import { styled, Theme } from '@mui/system'
import TextField from '@mui/material/TextField'
import { sizeConverter } from '@utility/sizeConverter'

type StyledTextFieldProps = {
    theme?: Theme
}

const StyledTextField = styled(TextField)<StyledTextFieldProps>(({ theme }) => ({
    width: '100%',
    borderRadius: sizeConverter(25, 'radius'),
    '& .MuiOutlinedInput-input': {
        padding: `0px ${sizeConverter(6)}px`,
        color: '#000',
        fontSize: sizeConverter(12),
        borderRadius: sizeConverter(25, 'radius'),
        minHeight: sizeConverter(30, 'height'),

        '&[type="number"]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
            },
            '&::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
            },
        },
    },
    '& label': {
        color: theme.palette.black['1'],
        fontSize: sizeConverter(12),
        lineHeight: 1.2,
        marginTop: sizeConverter(-28,'spaceY'),
    },
    '& .MuiInputLabel-shrink': {
        transform: `translate(${sizeConverter(13)}px, ${sizeConverter(-3)}px) scale(0.75)`,
        // Add other styles as needed
    },
    '& label.Mui-focused': {
        color: theme.palette.black['1'],
    },
    '& .MuiIconButton-root': {
        backgroundColor: '#fff',
    },
    '& .Mui-error-root': {
        color: theme.palette.black['1'],
    },
    '& .MuiFormHelperText-root': {
        color: theme.palette.black['1'],
    },
    '& .MuiFormLabel-root.Mui-error': {
        color: theme.palette.black['1'],
        borderColor: '#f5f5f5 !important',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: sizeConverter(25, 'radius'),
        minHeight: sizeConverter(30, 'height'),
        '& fieldset': {
            border: `${sizeConverter(1)}px solid`,
            borderColor: theme.palette.black['7'],
        },
        '&:hover fieldset': {
            borderColor: theme.palette.black['4'],
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.black['2'],
        },
    },
}))

export default StyledTextField
