/* eslint-disable */
//@ts-nocheck

import React from 'react'
import { keyframes } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@utility/sizeConverter.ts'

interface LoadingBarProps {
    width?: string
    color?: string
}

const loadingAnimation = keyframes`
    0% {
        left: -100%;
        right: 100%;
    }
    50% {
        left: 0%;
        right: 0%;
    }
    100% {
        left: 100%;
        right: -100%;
    }
`

const LoadingBar: React.FC<LoadingBarProps> = ({ width = '100%', color = 'dataGrid.main' }) => {
    return (
        <Grid
            container
            size={12}
            justifyContent="center"
            alignItems="center"
            sx={{ height: 'auto', overflow: 'hidden', position: 'absolute', zIndex: 10, }}
        >
            <Grid
                container
                size={12}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width,
                    height: sizeConverter(4),
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
            >
                <Grid
                    container
                    size={12}
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        top: 0,
                        backgroundColor: color,
                        animation: `${loadingAnimation} 3s ease-in-out infinite`,
                    }}
                />
            </Grid>
        </Grid>
    )
}

export default LoadingBar
