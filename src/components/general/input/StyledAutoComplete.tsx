// import { styled, Theme } from '@mui/system'
// import Autocomplete from '@mui/material/Autocomplete'
// import { sizeConverter } from '@utility/sizeConverter'

// interface StyledAutoCompleteProps {
//     theme?: Theme
//     autocompleteType?: 'single' | 'multiple' | 'searchable' | 'freeSolo'
// }

// export const StyledAutoComplete = styled(Autocomplete)<StyledAutoCompleteProps>(({ theme, autocompleteType }) => ({
//     width: '100%',
//     '& .MuiOutlinedInput-input': {
//         padding: `0px ${sizeConverter(6)}px`,
//         color: theme.palette.black['0'],
//         width: '90%',
//         border: 'none',
//         ...(autocompleteType === 'multiple' && {
//             padding: `0px ${sizeConverter(6)}px`,
//         }),
//     },
//     '& .MuiAutocomplete-tag': {
//         display: 'flex',
//         alignItems: 'center',
//         fontSize: sizeConverter(12),
//         height: sizeConverter(30, 'height'),
//         margin: sizeConverter(3, 'space'),
//         overflow: 'hidden',
//         borderRadius: 100,
//         backgroundColor: '#fff',
//         '& .MuiChip-deleteIcon': {
//             height: sizeConverter(16),
//             width: sizeConverter(16),
//         },
//     },
//     '& label': {
//         color: theme.palette.black['3'],
//     },
//     '& label.Mui-focused': {
//         color: theme.palette.black['0'],
//     },
//     '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
//         display: 'none',
//         borderRadius: 1,
//     },
//     '& input[type=number]': {
//         MozAppearance: 'textfield',
//     },
//     '& .MuiOutlinedInput-root': {
//         borderRadius: sizeConverter(25, 'radius'),
//         height: sizeConverter(30, 'height'),
//         padding: `0px ${sizeConverter(6)}px`,
//         flexWrap: 'initial',
//         display: 'flex',
//         ...(autocompleteType === 'multiple' && {
//             flexWrap: 'wrap',
//             height: 'auto',
//         }),
//         '& fieldset': {
//             borderColor: '#6e6e6e',
//         },
//         '&:hover fieldset': {
//             borderColor: '#6e6e6e',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: '#6e6e6e',
//         },
//         '& .MuiFormControl-root .MuiTextField-root .MuiIconButton-root': {
//             color: '#000',
//         },
//     },
//     ...(autocompleteType === 'freeSolo' && {
//         '& .MuiOutlinedInput-input': {
//             paddingRight: sizeConverter(30, 'space'),
//         },
//     }),
// }))


// src/components/general/input/StyledAutoComplete.tsx

// src/components/general/input/StyledAutoComplete.tsx

import { styled, Theme } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import { sizeConverter } from '@utility/sizeConverter';
import { useDevice } from '@src/hooks/useDevice';

interface StyledAutoCompleteProps {
    theme?: Theme;
    autocompleteType?: 'single' | 'multiple' | 'searchable' | 'freeSolo';
}

export const StyledAutoComplete = styled(Autocomplete)<StyledAutoCompleteProps>(({ theme, autocompleteType }) => {
    const { isMobile } = useDevice();

    // ==================== استایل دسکتاپ (دقیقاً همان قبلی تو) ====================
    const desktopStyles = {
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
                // flexWrap: 'wrap',
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
    };

    // ==================== استایل موبایل ====================
    const mobileStyles = {

        width: '100%',
        '& .MuiOutlinedInput-input': {
            // padding: '14px 16px',
            fontSize: '1.1rem',
            width: '100%',
        },
        '& .MuiAutocomplete-tag': {
            display: 'flex',
            alignItems: 'center',
            fontSize: '1rem',
            height: '42px',
            // margin: '4px 2px',
            // padding: '0 12px',
            overflow: 'hidden',
            borderRadius: 100,
            backgroundColor: '#f0f0f0',
            '& .MuiChip-deleteIcon': {
                height: '22px',
                width: '22px',
            },
        },
        '& label': {
            color: theme.palette.black['3'],
            fontSize: '1.05rem',
        },
        '& label.Mui-focused': {
            color: theme.palette.black['0'],
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',

            flexWrap: 'wrap',
            gap: '1px',

            minHeight: 'auto',
            padding: '8px 12px',

            '& fieldset': {
                borderColor: '#6e6e6e',
                borderWidth: '1.5px',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
            },
        },
        '& .MuiAutocomplete-listbox': {
            fontSize: '1.1rem',
            '& li': {
                padding: '14px 16px',
                minHeight: '52px',
            },
        },
        '& .MuiAutocomplete-paper': {
            marginTop: '2px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        },
        ...(autocompleteType === 'freeSolo' && {
            '& .MuiOutlinedInput-input': {
                paddingRight: '50px',
            },
        }),
    };

    // ترکیب نهایی
    return isMobile ? mobileStyles : desktopStyles;
});