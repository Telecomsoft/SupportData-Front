/* eslint-disable */
//@ts-nocheck

import { MouseEvent, useState, useRef, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { SvgIconComponent } from '@mui/icons-material'
import { sizeConverter } from '@utility/sizeConverter.ts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { createPortal } from 'react-dom'
import { useTheme } from '@mui/system'

interface TooltipProps {
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    visible: boolean
    parentRect: DOMRect | null
}

const Tooltip = ({ text, position, visible, parentRect }: TooltipProps) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (visible && tooltipRef.current && parentRect) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            let top: number, left: number

            switch (position) {
                case 'top':
                    top = parentRect.top - tooltipRect.height - 10
                    left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2
                    break
                case 'bottom':
                    top = parentRect.bottom + 10
                    left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2
                    break
                case 'left':
                    top = parentRect.top + parentRect.height / 2 - tooltipRect.height / 2
                    left = parentRect.left - tooltipRect.width - 10
                    break
                case 'right':
                    top = parentRect.top + parentRect.height / 2 - tooltipRect.height / 2
                    left = parentRect.right + 10
                    break
                default:
                    top = parentRect.bottom + 10
                    left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2
            }

            // Adjust position if tooltip is out of viewport
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            if (left < 0) left = 0
            if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width
            if (top < 0) top = 0
            if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height

            tooltipRef.current.style.top = `${top}px`
            tooltipRef.current.style.left = `${left}px`
        }
    }, [visible, position, parentRect])

    return createPortal(
        <Box
            ref={tooltipRef}
            sx={{
                position: 'fixed',
                backgroundColor: 'white.0',
                color: 'black.1',
                padding: sizeConverter(6, 'space'),
                borderRadius: sizeConverter(4, 'radius'),
                zIndex: 9999,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                opacity: visible ? 1 : 0,
                visibility: visible ? 'visible' : 'hidden',
            }}
        >
            <Typography variant="caption">{text}</Typography>
        </Box>,
        document.body
    )
}

interface IconProviderProps {
    Icon: SvgIconComponent | any
    size?: number
    color?: string
    disable?: boolean
    borderRadius?: number
    clickFunc?: (event?: MouseEvent<HTMLDivElement>) => void
    extraStyle?: Record<string, any>
    noHover?: boolean
    toolTipText?: string
    position?: 'top' | 'bottom' | 'right' | 'left'
}

const IconProvider = ({
    Icon,
    size = sizeConverter(14),
    color = 'black.1',
    disable = false,
    borderRadius = sizeConverter(5, 'radius'),
    clickFunc,
    extraStyle = {},
    noHover = false,
    toolTipText,
    position = 'bottom',
}: IconProviderProps) => {
    const theme = useTheme()

    const [visible, setVisible] = useState(false)
    const [parentRect, setParentRect] = useState<DOMRect | null>(null)
    const iconRef = useRef<HTMLDivElement | null>(null)

    const handleMouseEnter = () => {
        setVisible(true)
        if (iconRef.current) {
            setParentRect(iconRef.current!.getBoundingClientRect())
        }
    }

    const handleMouseLeave = () => {
        setVisible(false)
    }

    return (
        <>
            <Grid
                ref={iconRef}
                container
                justifyContent={'center'}
                alignItems={'center'}
                size="auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(event: MouseEvent<HTMLDivElement>) => clickFunc?.(event)}
                sx={{
                    borderRadius: borderRadius!,
                    bgcolor: color!,
                    m: sizeConverter(1, 'space'),
                    cursor: 'pointer',
                    transition: 'all 0.1s ease-in-out',
                    pointerEvents: disable ? 'none' : 'auto',
                    opacity: disable ? '0.6' : 1,
                    position: 'relative',
                    ...(!noHover && {
                        '&:hover': {
                            bgcolor: 'bgColor.hover',
                        },
                    }),
                    ...extraStyle,
                }}
            >
                <Icon
                    style={{
                        width: size,
                        height: size,
                        color: theme.palette.white['0'],
                        margin: sizeConverter(25, 'space'),
                    }}
                    sx={{
                        width: size,
                        height: size,
                        color: 'white.0',
                        m: sizeConverter(3, 'space'),
                    }}
                />
            </Grid>
            {toolTipText && <Tooltip text={toolTipText} position={position} visible={visible} parentRect={parentRect} />}
        </>
    )
}

export default IconProvider
