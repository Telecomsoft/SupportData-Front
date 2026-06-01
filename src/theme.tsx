import { red } from '@mui/material/colors'
import iranYekanRegular from '/fonts/IRANYekanX-Regular.woff'
import iranYekanBold from '/fonts/IRANYekanX-Bold.woff'
import iranYekanMedium from '/fonts/IRANYekanX-Medium.woff'
import iranYekanLight from '/fonts/IRANYekanX-Light.woff'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { createTheme } from '@mui/material'
import { Theme } from '@mui/system'

// const theme = createTheme({
//     direction: 'rtl',
//     colorSchemes: {
//         light: {
//             palette: {
//                 dataGrid: {
//                     main: '#316f6d',
//                     bgHeaderPinColor: '#1f4d4b',
//                     bgHeaderColor: '#316f6d',
//                     headerTagColor: '#b0b0b0',
//                     textHeaderColor:'#E5EAF2',
//                     hover: 'rgb(225,225,225)',
//                     // bgHeaderColor: '#f5f5f5',
//                     selection: 'rgb(203,203,203)',
//                     resizeArrowColor: '#B0B0B0',
//                     resizeArrowHoverColor: '#fff',
//                     resizeArrowBlack: '#fff',
//                     actionDisable: '#e0e0e0',
//                     bgRowPinColor: '#eeeeee',
//                     borderColor: '#D3D3D3',
//                     white: '#ffffff',
//                     input: '#eeeeee',
//                     inputHover: '#b0b0b0'
//                 },
//                 bgColor: {
//                     0: '#ffffff',
//                     1: '#ececec',
//                     2: '#f9f9f9',
//                     3: '#f5f5f5',
//                     4: '#e0e0e0',
//                     5: '#b0b0b0',
//                     6: '#a09e9e',
//                     hover: '#1f4d4b',
//                 },
//                 black: {
//                     0: '#000000',
//                     1: '#1C2025',
//                     2: '#333333',
//                     3: '#666666',
//                     4: '#999999',
//                     5: '#B0B0B0',
//                     6: '#CCCCCC',
//                     7: '#D3D3D3',
//                 },
//                 white: {
//                     0: '#ffffff',
//                     1: '#E5EAF2',
//                 },
//                 yellow: {
//                     0: '#f49e14',
//                 },
//                 green: {
//                     0: '#0BD862',
//                     1: '#0BA362',
//                 },
//                 primary: {
//                     main: '#316f6d',
//                 },
//                 secondary: {
//                     main: '#c3c3c3',
//                 },
//                 error: {
//                     main: red.A400,
//                 },
//             },
//         },
//     },
//     typography: {
//         fontFamily: ['yekanNormal', 'yekanBold', 'yekanMedium', 'yekanLight'].join(','),
//         bigHeader: {
//             color: '#1C2025',
//             fontSize: sizeConverter(28),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         header: {
//             color: '#1C2025',
//             fontSize: sizeConverter(20),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         subHeader: {
//             color: '#1C2025',
//             fontSize: sizeConverter(14),
//             fontFamily: 'yekanMedium',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//         },
//         subItem: {
//             color: '#1C2025',
//             fontSize: sizeConverter(12),
//             fontFamily: 'yekanMedium',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//         },
//         boxTitle: {
//             color: '#1C2025',
//             fontSize: sizeConverter(14),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         dialogTitle: {
//             color: '#1C2025',
//             fontSize: sizeConverter(13),
//             fontFamily: 'yekanNormal',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         dialogSubTitle: {
//             color: '#1C2025',
//             fontSize: sizeConverter(12),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         normalHeader: {
//             color: '#1C2025',
//             fontSize: sizeConverter(14),
//             fontFamily: 'yekanMedium',
//             letterSpacing: 'normal',
//             lineHeight: 1.8,
//         },
//         normal: {
//             color: '#1C2025',
//             fontSize: sizeConverter(12),
//             fontFamily: 'yekanNormal',
//             letterSpacing: 'normal',
//             lineHeight: 1.8,
//         },
//         normalBold: {
//             color: '#1C2025',
//             fontSize: sizeConverter(12),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.8,
//         },
//         alertHeader: {
//             color: '#1C2025',
//             fontSize: sizeConverter(13),
//             fontFamily: 'yekanBold',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         alertText: {
//             color: '#1C2025',
//             fontSize: sizeConverter(12),
//             fontFamily: 'yekanMedium',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//         caption: {
//             fontSize: sizeConverter(10),
//             fontFamily: 'yekanNormal',
//             fontWeight: 'normal',
//             letterSpacing: 'normal',
//             lineHeight: 1.2,
//             textAlign: 'center',
//         },
//     },
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     variants: [
//                         {
//                             props: { variant: 'main' },
//                             style: ({ theme }: { theme: Theme }) => ({
//                                 backgroundColor: theme.palette.primary['main'],
//                                 borderRadius: sizeConverter(50, 'radius'),
//                                 height: sizeConverter(22, 'height'),
//                                 minWidth: sizeConverter(100, 'width'),
//                                 overflow: 'hidden',
//                                 boxShadow:
//                                     '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
//                                 padding: `${sizeConverter(50, 'space')}px`,
//                                 fontSize: sizeConverter(11),
//                                 fontWeight: 500,
//                                 fontFamily: 'yekanNormal',
//                                 lineHeight: 1,
//                                 letterSpacing: 'normal',
//                                 textTransform: 'capitalize',
//                                 color: theme.palette.white[0],
//                                 '&:hover': {
//                                     backgroundColor: theme.palette.bgColor['hover'],
//                                 },
//                                 '&:active': {
//                                     backgroundColor: '#131313',
//                                 },
//                                 '&:disabled': {
//                                     opacity: 0.5,
//                                     color: theme.palette.white[0],
//                                 },

//                                 '@media (max-width:900px)': {
//                                     padding: sizeConverter(14, 'space'),
//                                 },
//                             }),
//                         },
//                         {
//                             props: { variant: 'confirm' },
//                             style: ({ theme }: { theme: Theme }) => ({
//                                 backgroundColor: theme.palette.green['0'],
//                                 borderRadius: sizeConverter(50, 'radius'),
//                                 height: sizeConverter(22, 'height'),
//                                 minWidth: sizeConverter(100, 'width'),
//                                 overflow: 'hidden',
//                                 boxShadow:
//                                     '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
//                                 padding: `${sizeConverter(50, 'space')}px`,
//                                 fontSize: sizeConverter(11),
//                                 fontWeight: 500,
//                                 fontFamily: 'yekanNormal',
//                                 lineHeight: 1,
//                                 letterSpacing: 'normal',
//                                 textTransform: 'capitalize',
//                                 color: theme.palette.white[0],
//                                 '&:hover': {
//                                     backgroundColor: theme.palette.green['1'],
//                                 },
//                                 '&:active': {
//                                     backgroundColor: '#131313',
//                                 },
//                                 '&:disabled': {
//                                     opacity: 0.5,
//                                     color: theme.palette.white[0],
//                                 },

//                                 '@media (max-width:900px)': {
//                                     padding: sizeConverter(14, 'space'),
//                                 },
//                             }),
//                         },
//                     ],
//                 },
//             },
//         },
//         MuiCssBaseline: {
//             styleOverrides: `
//         @font-face {
//           font-family: 'yekanNormal';
//           font-style: normal;
//           font-display: swap;
//           font-weight: 500;
//           src: url(${iranYekanRegular}) format('woff');
//         }
//         @font-face {
//           font-family: 'yekanBold';
//           font-style: normal;
//           font-display: swap;
//           font-weight: 500;
//           src: url(${iranYekanBold}) format('woff');
//         }
//         @font-face {
//           font-family: 'yekanMedium';
//           font-style: normal;
//           font-display: swap;
//           font-weight: 500;
//           src: url(${iranYekanMedium}) format('woff');
//         }
//         @font-face {
//           font-family: 'yekanLight';
//           font-style: normal;
//           font-display: swap;
//           font-weight: 500;
//           src: url(${iranYekanLight}) format('woff');
//         }
//         html {
//           scroll-behavior: smooth;
//           height:100%;
//         }
//         * {
//           scroll-margin-top: 20px;
//         }
//         body {
//            .MuiDialog-paper {
//               border-radius: ${sizeConverter(20)}px !important;
//            }
//           user-select: none;
//           overflow-x: hidden;
//           min-height: 100vh;
//           min-width: 100wv;
//           height:100%;
//           background-color: #f9f9f9;
//           & a {
//             text-decoration: none;
//             color: inherit;
//           }
//           & .MuiList-root {
//             padding-top: 0px;
//             padding-bottom: 0px;
//           }
//           & .max-width-1136 {
//             max-width: 1136px !important;
//           }
//           & .max-width-1312 {
//             max-width: 1312px !important;
//           }
//           & .section-margin-bottom {
//             margin-bottom: 144px !important;
//             @media (max-width:900px) {
//               margin-bottom: 104px !important;
//             }
//           } 
//           min-height: 100%;
//           margin: 0px;
//           &::-webkit-scrollbar, & *::-webkit-scrollbar {
//             background-color: transparent;
//             width: 6px;
//             height: 6px;
//             border-radius: 2px;
//           }
//           &::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb {
//             border-radius: 20px;
//             background-color: #CCCCCC;
//             padding: 0px 1px;
//             min-height: 110px;
//           }     
//           scrollbar-color: #ccc transparent;
//           scrollbar-width: thin;
//         }
//       `,
//         },
//     },
// })
const theme = createTheme({
    direction: 'rtl',
    colorSchemes: {
        light: {
            palette: {
                dataGrid: {
                    main: '#800020',                      // زرشکی اصلی
                    bgHeaderPinColor: '#4A0D1A',
                    // '#5E0015',        // زرشکی بسیار تیره
                    bgHeaderColor: '#800020',             // زرشکی تیره برای هدر
                    headerTagColor: '#E0B88A',            // طلایی کهنه برای تگ‌ها
                    textHeaderColor: '#FFF2E6',           // کرم روشن برای متن هدر
                    hover: '#F2E0D4',                     // کرم متمایل به صورتی برای حالت hover
                    selection: '#EAD1C2',                 // کرم پررنگ‌تر برای انتخاب
                    resizeArrowColor: '#C49B73',          // طلایی ملایم برای فلش تغییر اندازه
                    resizeArrowHoverColor: '#800020',     // زرشکی در حالت hover فلش
                    resizeArrowBlack: '#FFFFFF',          // سفید برای فلش در حالت خاص
                    actionDisable: '#D9C4B0',             // بژ مایل به قهوه‌ای برای اکشن غیرفعال
                    bgRowPinColor: '#FFF8F2',             // کرم بسیار روشن برای سطر پین شده
                    borderColor: '#E0C8B0',               // بژ خاکستری برای حاشیه‌ها
                    white: '#FFFFFF',                     // سفید خالص
                    input: '#FDF3EA',                     // کرم کمرنگ برای ورودی
                    inputHover: '#F0DDCE'                 // کرم پررنگ‌تر برای حالت hover ورودی
                },
                bgColor: {
                    0: '#FFFFFF',                         // سفید
                    1: '#FCF7F0',                         // کرم بسیار روشن
                    2: '#F8F0E8',                         // کرم روشن
                    3: '#F3ECE2',                         // کرم ملایم
                    4: '#EADCCE',                         // بژ روشن
                    5: '#CFBDA6',                         // بژ متوسط
                    6: '#B8A186',                         // بژ پررنگ مایل به قهوه‌ای
                    hover: '#6B001A'                      // زرشکی تیره برای حالت hover عمومی
                },
                black: {
                    0: '#1A1A1A',                         // تقریبا سیاه با ته رنگ گرم
                    1: '#2B2B2B',
                    2: '#404040',
                    3: '#666666',
                    4: '#8C8C8C',
                    5: '#B0B0B0',
                    6: '#CCCCCC',
                    7: '#E0D6CC'                          // خاکستری متمایل به بژ
                },
                white: {
                    0: '#FFFFFF',                          // سفید
                    1: '#FDF8F0'                           // کرم شکری
                },
                yellow: {
                    0: '#f49e14'                          // طلایی پررنگ (بدون تغییر)
                },
                green: {
                    0: '#0BD862',                         // سبز زمردی روشن
                    1: '#0BA362'                          // سبز زمردی تیره‌تر
                },
                primary: {
                    main: '#800020'                       // زرشکی اصلی
                },
                secondary: {
                    main: '#C5A059'                       // طلایی کهنه به عنوان رنگ ثانویه
                },
                error: {
                    main: red.A400                         // قرمز خطا (همانند قبل)
                },
            },
        },
    },
    typography: {   // بدون تغییر باقی می‌ماند
        fontFamily: ['yekanNormal', 'yekanBold', 'yekanMedium', 'yekanLight'].join(','),
        bigHeader: {
            color: '#1C2025',
            fontSize: sizeConverter(28),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        header: {
            color: '#1C2025',
            fontSize: sizeConverter(20),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        subHeader: {
            color: '#1C2025',
            fontSize: sizeConverter(14),
            fontFamily: 'yekanMedium',
            letterSpacing: 'normal',
            lineHeight: 1.2,
        },
        subItem: {
            color: '#1C2025',
            fontSize: sizeConverter(12),
            fontFamily: 'yekanMedium',
            letterSpacing: 'normal',
            lineHeight: 1.2,
        },
        boxTitle: {
            color: '#1C2025',
            fontSize: sizeConverter(14),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        dialogTitle: {
            color: '#1C2025',
            fontSize: sizeConverter(13),
            fontFamily: 'yekanNormal',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        dialogSubTitle: {
            color: '#1C2025',
            fontSize: sizeConverter(12),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        normalHeader: {
            color: '#1C2025',
            fontSize: sizeConverter(14),
            fontFamily: 'yekanMedium',
            letterSpacing: 'normal',
            lineHeight: 1.8,
        },
        normal: {
            color: '#1C2025',
            fontSize: sizeConverter(12),
            fontFamily: 'yekanNormal',
            letterSpacing: 'normal',
            lineHeight: 1.8,
        },
        normalBold: {
            color: '#1C2025',
            fontSize: sizeConverter(12),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.8,
        },
        alertHeader: {
            color: '#1C2025',
            fontSize: sizeConverter(13),
            fontFamily: 'yekanBold',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        alertText: {
            color: '#1C2025',
            fontSize: sizeConverter(12),
            fontFamily: 'yekanMedium',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
        caption: {
            fontSize: sizeConverter(10),
            fontFamily: 'yekanNormal',
            fontWeight: 'normal',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textAlign: 'center',
        },
    },
    components: {   // بدون تغییر باقی می‌ماند
        MuiButton: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { variant: 'main' },
                            style: ({ theme }: { theme: Theme }) => ({
                                backgroundColor: theme.palette.primary['main'],
                                borderRadius: sizeConverter(50, 'radius'),
                                height: sizeConverter(22, 'height'),
                                minWidth: sizeConverter(100, 'width'),
                                overflow: 'hidden',
                                boxShadow:
                                    '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
                                padding: `${sizeConverter(50, 'space')}px`,
                                fontSize: sizeConverter(11),
                                fontWeight: 500,
                                fontFamily: 'yekanNormal',
                                lineHeight: 1,
                                letterSpacing: 'normal',
                                textTransform: 'capitalize',
                                color: theme.palette.white[0],
                                '&:hover': {
                                    backgroundColor: theme.palette.bgColor['hover'],
                                },
                                '&:active': {
                                    backgroundColor: '#131313',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                    color: theme.palette.white[0],
                                },

                                '@media (max-width:900px)': {
                                    padding: sizeConverter(14, 'space'),
                                },
                            }),
                        },
                        {
                            props: { variant: 'confirm' },
                            style: ({ theme }: { theme: Theme }) => ({
                                backgroundColor: theme.palette.green['0'],
                                borderRadius: sizeConverter(50, 'radius'),
                                height: sizeConverter(22, 'height'),
                                minWidth: sizeConverter(100, 'width'),
                                overflow: 'hidden',
                                boxShadow:
                                    '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
                                padding: `${sizeConverter(50, 'space')}px`,
                                fontSize: sizeConverter(11),
                                fontWeight: 500,
                                fontFamily: 'yekanNormal',
                                lineHeight: 1,
                                letterSpacing: 'normal',
                                textTransform: 'capitalize',
                                color: theme.palette.white[0],
                                '&:hover': {
                                    backgroundColor: theme.palette.green['1'],
                                },
                                '&:active': {
                                    backgroundColor: '#131313',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                    color: theme.palette.white[0],
                                },

                                '@media (max-width:900px)': {
                                    padding: sizeConverter(14, 'space'),
                                },
                            }),
                        },
                        {
                            props: { variant: 'confirmMobile' },
                            style: ({ theme }: { theme: Theme }) => ({
                                backgroundColor: theme.palette.dataGrid.main,
                                borderRadius: 50,
                                height: 22,
                                minWidth: 100,
                                overflow: 'hidden',
                                boxShadow:
                                    '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
                                padding: 50,
                                fontSize: 13,
                                fontWeight: 'bold',
                                fontFamily: 'yekanNormal',
                                lineHeight: 1,
                                letterSpacing: 'normal',
                                textTransform: 'capitalize',
                                color: theme.palette.white[0],
                                '&:hover': {
                                    backgroundColor: theme.palette.dataGrid.bgHeaderColor,
                                },
                                '&:active': {
                                    backgroundColor: '#131313',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                    color: theme.palette.white[0],
                                },

                                '@media (max-width:900px)': {
                                    padding: 14,
                                },
                            }),
                        },
                        {
                            props: { variant: 'cancelMobile' },
                            style: ({ theme }: { theme: Theme }) => ({
                                backgroundColor: theme.palette.black['6'],
                                borderRadius: 50,
                                height: 22,
                                minWidth: 100,
                                overflow: 'hidden',
                                boxShadow:
                                    '0 0 1px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 16px 24px 0 rgba(0, 0, 0, 0.06)',
                                padding: 50,
                                fontSize: 13,
                                fontWeight: 'bold',
                                fontFamily: 'yekanNormal',
                                lineHeight: 1,
                                letterSpacing: 'normal',
                                textTransform: 'capitalize',
                                color: theme.palette.black['0'],
                                '&:hover': {
                                    backgroundColor: theme.palette.dataGrid.bgHeaderColor,
                                },
                                '&:active': {
                                    backgroundColor: '#131313',
                                },


                                '@media (max-width:900px)': {
                                    padding: 14,
                                },
                            }),
                        },
                    ],
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'yekanNormal';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url(${iranYekanRegular}) format('woff');
        }
        @font-face {
          font-family: 'yekanBold';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url(${iranYekanBold}) format('woff');
        }
        @font-face {
          font-family: 'yekanMedium';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url(${iranYekanMedium}) format('woff');
        }
        @font-face {
          font-family: 'yekanLight';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url(${iranYekanLight}) format('woff');
        }
        html {
          scroll-behavior: smooth;
          height:100%;
        }
        * {
          scroll-margin-top: 20px;
        }
        body {
           .MuiDialog-paper {
              border-radius: ${sizeConverter(20)}px !important;
           }
          user-select: none;
          overflow-x: hidden;
          min-height: 100vh;
          min-width: 100wv;
          height:100%;
          background-color: #f9f9f9;
          & a {
            text-decoration: none;
            color: inherit;
          }
          & .MuiList-root {
            padding-top: 0px;
            padding-bottom: 0px;
          }
          & .max-width-1136 {
            max-width: 1136px !important;
          }
          & .max-width-1312 {
            max-width: 1312px !important;
          }
          & .section-margin-bottom {
            margin-bottom: 144px !important;
            @media (max-width:900px) {
              margin-bottom: 104px !important;
            }
          } 
          min-height: 100%;
          margin: 0px;
          &::-webkit-scrollbar, & *::-webkit-scrollbar {
            background-color: transparent;
            width: 6px;
            height: 6px;
            border-radius: 2px;
          }
          &::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: #CCCCCC;
            padding: 0px 1px;
            min-height: 110px;
          }     
          scrollbar-color: #ccc transparent;
          scrollbar-width: thin;
        }
      `,
        },
    },
})
export default theme
