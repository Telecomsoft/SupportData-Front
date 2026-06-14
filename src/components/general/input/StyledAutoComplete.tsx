import { styled, Autocomplete, Theme } from '@mui/material';
import { sizeConverter } from '@utility/sizeConverter';
import { useDevice } from '@src/hooks/useDevice';

interface StyledAutoCompleteProps {
    autocompleteType?: 'multiple' | 'freeSolo' | 'default';
}

export const StyledAutoComplete = styled(Autocomplete, {
    shouldForwardProp: (prop) => prop !== 'autocompleteType',
})<StyledAutoCompleteProps>(({ theme, autocompleteType }) => {
    const { isMobile } = useDevice();

    // ==================== استایل دسکتاپ (افزایش ارتفاع) ====================
    const desktopStyles = {
        width: '100%',
        '& .MuiOutlinedInput-input': {
            padding: `0px ${sizeConverter(8)}px`,
            color: theme.palette.black['0'],
            width: '90%',
            border: 'none',
            fontSize: '0.9rem', // افزایش readability
            ...(autocompleteType === 'multiple' && {
                padding: `0px ${sizeConverter(8)}px`,
            }),
        },
        '& .MuiAutocomplete-tag': {
            display: 'flex',
            alignItems: 'center',
            fontSize: sizeConverter(12),
            height: sizeConverter(34, 'height'), // افزایش ارتفاع تگ
            margin: sizeConverter(3, 'space'),
            overflow: 'hidden',
            borderRadius: 100,
            backgroundColor: theme.palette.white[0],
            '& .MuiChip-deleteIcon': {
                height: sizeConverter(18),
                width: sizeConverter(18),
                color: theme.palette.black[4],
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
            height: sizeConverter(42, 'height'), // افزایش ارتفاع از 30px به 42px
            padding: `0px ${sizeConverter(10)}px`,
            flexWrap: 'initial',
            display: 'flex',
            ...(autocompleteType === 'multiple' && {
                height: 'auto',
                minHeight: sizeConverter(42, 'height'),
            }),
            '& fieldset': {
                borderColor: theme.palette.black[3],
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
            },
            '& .MuiFormControl-root .MuiTextField-root .MuiIconButton-root': {
                color: theme.palette.black[0],
            },
        },
        ...(autocompleteType === 'freeSolo' && {
            '& .MuiOutlinedInput-input': {
                paddingRight: sizeConverter(30, 'space'),
            },
        }),
    };

    // ==================== استایل موبایل (افزایش ارتفاع و فاصله) ====================
    const mobileStyles = {
        width: '100%',
        '& .MuiOutlinedInput-input': {
            fontSize: '1.1rem',
            padding: '14px 0', // فضای داخلی بیشتر
            width: '100%',
        },
        '& .MuiAutocomplete-tag': {
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.95rem',
            height: '48px', // افزایش ارتفاع تگ
            overflow: 'hidden',
            borderRadius: 100,
            backgroundColor: theme.palette.bgColor[2],
            color: theme.palette.black[0],
            '& .MuiChip-deleteIcon': {
                height: '24px',
                width: '24px',
                color: theme.palette.black[4],
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
            borderRadius: '16px', // گردی بیشتر
            flexWrap: 'wrap',
            gap: '6px',
            minHeight: '56px', // افزایش ارتفاع کلی
            padding: '8px 16px',
            backgroundColor: theme.palette.white[0],
            '& fieldset': {
                borderColor: theme.palette.black[4],
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
            backgroundColor: theme.palette.white[0],
            '& li': {
                padding: '14px 16px',
                minHeight: '52px',
                color: theme.palette.black[0],
                '&:hover': {
                    backgroundColor: theme.palette.bgColor[1],
                },
            },
        },
        '& .MuiAutocomplete-paper': {
            marginTop: '4px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            backgroundColor: theme.palette.white[0],
        },
        '& .MuiAutocomplete-clearIndicator': {
            color: theme.palette.black[4],
        },
        ...(autocompleteType === 'freeSolo' && {
            '& .MuiOutlinedInput-input': {
                paddingRight: '50px',
            },
        }),
    };

    return isMobile ? mobileStyles : desktopStyles;
});