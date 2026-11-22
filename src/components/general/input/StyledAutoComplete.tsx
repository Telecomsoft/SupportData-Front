import { Autocomplete, styled } from '@mui/material'

import { sizeConverter } from '@src/utility/sizeConverter'

export const StyledAutoComplete = styled(Autocomplete, {
    shouldForwardProp: (prop) => prop !== 'autocompleteType',
})<{ autocompleteType?: string }>(({ theme }) => ({
    width: '100%',
    minWidth: 0,
    '& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot': {
        paddingBlock: sizeConverter(3, 'height'),
        paddingInlineStart: sizeConverter(10, 'width'),
        flexWrap: 'wrap',
        '& .MuiAutocomplete-input': {
            paddingBlock: sizeConverter(3, 'height'),
            paddingInline: sizeConverter(4, 'width'),
            height: '1.5rem',
            minWidth: sizeConverter(32, 'width'),
        },
    },
    '& .MuiAutocomplete-tag': {
        maxWidth: `calc(100% - ${2 * sizeConverter(2)}px)`,
        height: `max(1.625rem, ${sizeConverter(26, 'height')}px)`,
        margin: sizeConverter(2),
        borderRadius: sizeConverter(6),
        backgroundColor: theme.palette.action.selected,
    },
    '& .MuiAutocomplete-endAdornment': { display: 'flex', alignItems: 'center' },
}))
