import { useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'

export const useDevice = () => {
    const theme = useTheme()

    const isMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px

    return useMemo(() => ({
        isMobile,
        isDesktop: !isMobile,
    }), [isMobile])
}