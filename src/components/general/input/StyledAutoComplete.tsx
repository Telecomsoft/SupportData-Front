import { styled, Theme } from '@mui/system'
import Autocomplete from '@mui/material/Autocomplete'
import { sizeConverter } from '@utility/sizeConverter'

interface StyledAutoCompleteProps {
    theme?: Theme
    autocompleteType?: 'single' | 'multiple' | 'searchable' | 'freeSolo'
}

export const StyledAutoComplete = styled(Autocomplete)<StyledAutoCompleteProps>(({ theme, autocompleteType }) => ({
    width: '100%',
    '& .MuiOutlinedInput-input': {
        padding: `0px ${sizeConverter(6)}px`,
        color: theme.palette.black['0'],
        width: '90%',
        border: 'none',
        ...(autocompleteType === 'multiple' && {
            padding: `0px ${sizeConverter(6)}px`,
        }),
    },
    '& .MuiAutocomplete-tag': {
        display: 'flex',
        alignItems: 'center',
        fontSize: sizeConverter(12),
        height: sizeConverter(30, 'height'),
        margin: sizeConverter(3, 'space'),
        overflow: 'hidden',
        borderRadius: 100,
        backgroundColor: '#fff',
        '& .MuiChip-deleteIcon': {
            height: sizeConverter(16),
            width: sizeConverter(16),
        },
    },
    '& label': {
        color: theme.palette.black['3'],
    },
    '& label.Mui-focused': {
        color: theme.palette.black['0'],
    },
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
        display: 'none',
        borderRadius: 1,
    },
    '& input[type=number]': {
        MozAppearance: 'textfield',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: sizeConverter(25, 'radius'),
        height: sizeConverter(30, 'height'),
        padding: `0px ${sizeConverter(6)}px`,
        flexWrap: 'initial',
        display: 'flex',
        ...(autocompleteType === 'multiple' && {
            flexWrap: 'wrap',
            height: 'auto',
        }),
        '& fieldset': {
            borderColor: '#6e6e6e',
        },
        '&:hover fieldset': {
            borderColor: '#6e6e6e',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6e6e6e',
        },
        '& .MuiFormControl-root .MuiTextField-root .MuiIconButton-root': {
            color: '#000',
        },
    },
    ...(autocompleteType === 'freeSolo' && {
        '& .MuiOutlinedInput-input': {
            paddingRight: sizeConverter(30, 'space'),
        },
    }),
}))
