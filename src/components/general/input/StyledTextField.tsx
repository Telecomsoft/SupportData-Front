import { margin, padding, styled, Theme } from '@mui/system'
import TextField from '@mui/material/TextField'
import { sizeConverter } from '@utility/sizeConverter'

type StyledTextFieldProps = {
    theme?: Theme
}

// const StyledTextField = styled(TextField)<StyledTextFieldProps>(({ theme }) => ({
//     width: '100%',
//     borderRadius: sizeConverter(25, 'radius'),
//     '& .MuiOutlinedInput-input': {
//         padding: `0px ${sizeConverter(6)}px`,
//         color: '#000',
//         fontSize: sizeConverter(12),
//         borderRadius: sizeConverter(25, 'radius'),
//         minHeight: sizeConverter(30, 'height'),

//         '&[type="number"]': {
//             MozAppearance: 'textfield',
//             '&::-webkit-outer-spin-button': {
//                 WebkitAppearance: 'none',
//                 margin: 0,
//             },
//             '&::-webkit-inner-spin-button': {
//                 WebkitAppearance: 'none',
//                 margin: 0,
//             },
//         },
//     },
//     '& label': {
//         color: theme.palette.black['1'],
//         fontSize: sizeConverter(12),
//         lineHeight: 1.2,
//         marginTop: sizeConverter(-28,'spaceY'),
//     },
//     '& .MuiInputLabel-shrink': {
//         transform: `translate(${sizeConverter(13)}px, ${sizeConverter(-3)}px) scale(0.75)`,
//         // Add other styles as needed
//     },
//     '& label.Mui-focused': {
//         color: theme.palette.black['1'],
//     },
//     '& .MuiIconButton-root': {
//         backgroundColor: '#fff',
//     },
//     '& .Mui-error-root': {
//         color: theme.palette.black['1'],
//     },
//     '& .MuiFormHelperText-root': {
//         color: theme.palette.black['1'],
//     },
//     '& .MuiFormLabel-root.Mui-error': {
//         color: theme.palette.black['1'],
//         borderColor: '#f5f5f5 !important',
//     },
//     '& .MuiOutlinedInput-root': {
//         borderRadius: sizeConverter(25, 'radius'),
//         minHeight: sizeConverter(30, 'height'),
//         '& fieldset': {
//             border: `${sizeConverter(1)}px solid`,
//             borderColor: theme.palette.black['7'],
//         },
//         '&:hover fieldset': {
//             borderColor: theme.palette.black['4'],
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: theme.palette.black['2'],
//         },
//     },
// }))

// export default StyledTextField

const StyledTextField = styled(TextField)<StyledTextFieldProps>(({ theme }) => ({
    width: '100%',
    borderRadius: sizeConverter(25, 'radius'),

    '& .MuiOutlinedInput-input': {
        // استفاده از رنگ متن اصلی تم به جای #000
        color: theme.palette.text.primary,
        fontSize: sizeConverter(12),
        borderRadius: sizeConverter(25, 'radius'),
        // minHeight: sizeConverter(30, 'height'),

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
        color: theme.palette.black?.['1'] || theme.palette.text.secondary,
        fontSize: sizeConverter(12),
        lineHeight: 1.2,
        marginTop: sizeConverter(-28, 'spaceY'),
    },

    '& .MuiInputLabel-shrink': {
        transform: `translate(${sizeConverter(13)}px, ${sizeConverter(-3)}px) scale(0.75)`,
    },

    '& label.Mui-focused': {
        color: theme.palette.primary.main, // معمولاً در فوکوس از رنگ اصلی استفاده می‌شود
    },

    '& .MuiIconButton-root': {
        // استفاده از رنگ پس‌زمینه کاغذ/سطح به جای #fff
        backgroundColor: theme.palette.background.paper,
    },

    '& .Mui-error-root': {
        color: theme.palette.error.main, // استفاده از رنگ خطای تم
    },

    '& .MuiFormHelperText-root': {
        color: theme.palette.error.main, // هماهنگی متن راهنما با وضعیت خطا
    },

    '& .MuiFormLabel-root.Mui-error': {
        color: theme.palette.error.main,
        // جایگزینی #f5f5f5 با رنگ خاکستری بسیار روشن از تم یا شفافیت
        borderColor: `${theme.palette.action.hover} !important`,
    },

    '& .MuiOutlinedInput-root': {
        borderRadius: sizeConverter(25, 'radius'),
        minHeight: sizeConverter(30, 'height'),

        '& fieldset': {
            border: `${sizeConverter(1)}px solid`,
            borderColor: theme.palette.black?.['7'] || theme.palette.divider,
        },

        '&:hover fieldset': {
            borderColor: theme.palette.black?.['4'] || theme.palette.primary.light,
        },

        '&.Mui-focused fieldset': {
            borderColor: theme.palette.black?.['2'] || theme.palette.primary.main,
        },

        // اصلاح استایل فیلدست در حالت خطا
        '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
        },
    },

    // ================= MOBILE =================
    [theme.breakpoints.down('md')]: {
        margin: theme.spacing(1.5, 0), // استفاده از spacing تم به جای 12px
        padding: theme.spacing(0, 1.25), // استفاده از spacing تم به جای 10px

        '& .MuiOutlinedInput-input': {
            padding: '14px 16px',
            fontSize: '1.05rem',
        },

        '& label': {
            fontSize: '1rem',
            marginTop: '-8px',
        },

        '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.8)',
        },

        '& .MuiFormHelperText-root': {
            fontSize: '0.9rem',
            marginTop: '4px',
        },

        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',

            '& fieldset': {
                borderWidth: '1.5px',
            },

            '&.Mui-focused fieldset': {
                borderWidth: '2px',
                borderColor: theme.palette.primary.main,
            },

            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
    },
}))

export default StyledTextField
