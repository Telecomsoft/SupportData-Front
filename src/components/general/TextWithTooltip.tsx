import { LightTooltip } from './StyledTooltip'
import { sizeConverter } from '@src/utility/sizeConverter'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { ReactElement } from 'react'

type TextWithTooltipProps = {
    value: string | ReactElement | number
    fontSize?: number
    tooltipPlacement?:
        | 'top'
        | 'right'
        | 'bottom'
        | 'left'
        | 'bottom-end'
        | 'bottom-start'
        | 'left-end'
        | 'left-start'
        | 'right-end'
        | 'right-start'
        | 'top-end'
        | 'top-start'
    sx?: TypographyProps
    withoutDashReplacement?: boolean
    tooltipText?: string
}

const TextWithTooltip = ({
    value,
    fontSize = sizeConverter(9),
    tooltipPlacement = 'bottom',
    sx,
    withoutDashReplacement = false,
    tooltipText,
}: TextWithTooltipProps) => (
    <LightTooltip
        title={tooltipText || value}
        enterDelay={800}
        enterNextDelay={800}
        placement={tooltipPlacement}
        sx={{ fontSize: fontSize }}
    >
        <Typography
            sx={{
                fontSize: fontSize,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '1',
                WebkitBoxOrient: 'vertical',
                ...(!!sx && sx),
            }}
            noWrap
        >
            {!!withoutDashReplacement ? value : value || '-'}
        </Typography>
    </LightTooltip>
)

export default TextWithTooltip
