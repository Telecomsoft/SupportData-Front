import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'

import { styled } from '@mui/material/styles'
import { sizeConverter } from '@src/utility/sizeConverter'

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip
        slotProps={{
            popper: {
                modifiers: [
                    {
                        name: 'offset',
                        options: { offset: [0, -1 * sizeConverter(48, 'space')] },
                    },
                ],
            },
        }}
        {...props}
        classes={{ popper: className }}
    />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        textTransform: 'capitalize',
        boxShadow: theme.shadows[1],
        borderRadius: sizeConverter(15, 'radius'),
        fontSize: sizeConverter(11),
        fontFamily: 'roboto',
        fontWeight: 400,
        maxWidth: 'none',
    },
}))
