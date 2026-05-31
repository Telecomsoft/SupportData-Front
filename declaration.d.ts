import React from 'react'

declare module '*.svg' {
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
    const src: string
    export default src
}

declare module 'js-cookie' {
    export function get(key: string): string | undefined;
}

// Extend the Typography variants
declare module '@mui/material/styles' {
    interface TypographyVariants {
        bigHeader: React.CSSProperties
        header: React.CSSProperties
        subHeader: React.CSSProperties
        subItem: React.CSSProperties
        boxTitle: React.CSSProperties
        dialogTitle: React.CSSProperties
        dialogSubTitle: React.CSSProperties
        normal: React.CSSProperties
        normalHeader: React.CSSProperties
        normalBold: React.CSSProperties
        alertText: React.CSSProperties
        alertHeader: React.CSSProperties
    }

    interface ButtonVariants {
        main: React.CSSProperties
        confirm: React.CSSProperties
    }

    interface TypographyVariantsOptions {
        bigHeader?: React.CSSProperties
        header?: React.CSSProperties
        subHeader?: React.CSSProperties
        subItem: React.CSSProperties
        boxTitle?: React.CSSProperties
        dialogTitle?: React.CSSProperties
        dialogSubTitle?: React.CSSProperties
        normal?: React.CSSProperties
        normalHeader?: React.CSSProperties
        normalBold?: React.CSSProperties
        alertText?: React.CSSProperties
        alertHeader?: React.CSSProperties
    }

    interface ButtonVariantsOptions {
        main?: React.CSSProperties
        confirm?: React.CSSProperties
    }

    interface Palette {
        dataGrid: {
            main : string,
            hover: string,
            headerTagColor: string,
            textHeaderColor: string,
            input: string,
            inputHover: string,
            selection: string,
            resizeArrowColor: string,
            resizeArrowHoverColor: string,
            actionDisable: string,
            bgRowPinColor: string,
            bgHeaderPinColor: string,
            bgHeaderColor: string,
            borderColor: string,
            white: string,
            resizeArrowBlack: string,
        }
        bgColor: {
            0: string
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            hover: string
        }
        black: {
            0: string
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            7: string
        }
        white: {
            0: string
            1: string
        }
        yellow: {
            0: string
        }
    }

    interface PaletteOptions {
        dataGrid: {
            main : string,
            hover: string,
            headerTagColor: string,
            textHeaderColor: string,
            inputHover: string,
            input: string,
            selection: string,
            resizeArrowColor: string,
            resizeArrowHoverColor: string,
            actionDisable: string,
            bgRowPinColor: string,
            bgHeaderPinColor: string,
            bgHeaderColor: string,
            borderColor: string,
            white: string,
            resizeArrowBlack: string,
        }
        bgColor: {
            0: string
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            hover: string
        }
        black: {
            0: string
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            7: string
        }
        white: {
            0: string
            1: string
        }
        yellow: {
            0: string
        }
        green: {
            0: string
            1: string
        }
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        bigHeader: true
        header: true
        subHeader: true
        subItem: true
        boxTitle: true
        dialogTitle: true
        dialogSubTitle: true
        normal: true
        normalHeader: true
        normalBold: true
        alertText: true
        alertHeader: true
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        main: true
        confirm: true
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        PACKAGE_NAME: string;
        PACKAGE_VERSION: string;
    }
}
