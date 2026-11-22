import TextField from '@mui/material/TextField'
import { alpha, styled } from '@mui/material/styles'

import { sizeConverter } from '@src/utility/sizeConverter'

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
    minWidth: 0,
    '--field-height': `max(2.75rem, ${sizeConverter(44, 'height')}px)`,
    '&:has(.MuiInputBase-sizeSmall)': { '--field-height': `max(2.25rem, ${sizeConverter(36, 'height')}px)` },
    '& .MuiOutlinedInput-root': {
        minHeight: 'var(--field-height)',
        borderRadius: sizeConverter(10),
        fontSize: '0.9375rem',
        lineHeight: '1.5rem',
        backgroundColor: theme.palette.background.paper,
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.primary, 0.32),
            transition: theme.transitions.create('border-color', { duration: 120 }),
        },
        '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.secondary,
        },
        '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.error.main },
        '&.Mui-disabled': { backgroundColor: theme.palette.action.disabledBackground },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
    },
    '& .MuiOutlinedInput-input:not(.MuiAutocomplete-input)': {
        paddingBlock: 'calc((var(--field-height) - 1.5rem) / 2)',
        paddingInline: sizeConverter(14, 'width'),
        '&:not(textarea)': { height: '1.5rem' },
        '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { WebkitAppearance: 'none' },
        },
    },
    '& .MuiInputBase-adornedStart .MuiOutlinedInput-input': { paddingInlineStart: 0 },
    '& .MuiInputBase-adornedEnd .MuiOutlinedInput-input': { paddingInlineEnd: 0 },
    '& .MuiInputBase-multiline': {
        paddingBlock: sizeConverter(10, 'height'),
        paddingInline: sizeConverter(14, 'width'),
        '& textarea.MuiOutlinedInput-input': { padding: 0 },
    },
    '& .MuiInputLabel-outlined': {
        insetInlineStart: sizeConverter(14, 'width'),
        insetInlineEnd: 'auto',
        transformOrigin: theme.direction === 'rtl' ? '100% 0' : '0% 0',
        '&:not(.MuiInputLabel-shrink)': {
            transform: 'translateY(calc((var(--field-height) - 1.5rem) / 2))',
            lineHeight: '1.5rem',
        },
        '&.MuiInputLabel-shrink': { transform: 'translateY(-50%) scale(0.75)' },
    },
    '& .MuiFormHelperText-root': { marginInline: sizeConverter(14, 'width'), marginTop: sizeConverter(4, 'height') },
}))

export default StyledTextField
