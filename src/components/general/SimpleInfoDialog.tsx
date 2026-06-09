// src/components/general/SimpleInfoDialog.tsx
import { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { sizeConverter } from '@src/utility/sizeConverter'
import { useDevice } from '@src/hooks/useDevice'

export type SimpleInfoDialogProps = {
    open: boolean
    onClose: () => void
    title: string
    message?: string
    customContent?: ReactNode
    dialogWidth?: number
}

export default function SimpleInfoDialog({
    open,
    onClose,
    title,
    message,
    customContent,
    dialogWidth = 800,
}: SimpleInfoDialogProps) {
    const { isMobile } = useDevice()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    ...(isMobile
                        ? { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 0, m: 0 }
                        : { minWidth: sizeConverter(dialogWidth, 'width'), maxHeight: '85vh', borderRadius: sizeConverter(16, 'radius') }
                    ),
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: isMobile ? sizeConverter(20, 'space') : sizeConverter(16, 'space'),
                    py: isMobile ? sizeConverter(16, 'spaceY') : sizeConverter(12, 'spaceY'),
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0, ...(isMobile && { mt: 12 }),
                }}
            >
                <Typography
                    sx={{
                        fontSize: isMobile ? sizeConverter(60) : sizeConverter(18),
                        fontWeight: 700,
                        lineHeight: 1.3,
                    }}
                >
                    {title}
                </Typography>

                <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                    <CloseIcon fontSize={isMobile ? 'medium' : 'small'} />
                </IconButton>
            </Box>

            {/* Content — scrollable */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    px: isMobile ? sizeConverter(20, 'space') : sizeConverter(16, 'space'),
                    py: sizeConverter(14, 'spaceY'),
                }}
            >
                {message || customContent ? (
                    <Typography
                        component="div"
                        sx={{
                            whiteSpace: 'pre-line',
                            fontSize: isMobile ? sizeConverter(52) : sizeConverter(14),
                            lineHeight: isMobile ? 1.8 : 1.7,
                            color: 'text.primary',
                        }}
                    >
                        {message || customContent}
                    </Typography>
                ) : (
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            fontSize: isMobile ? sizeConverter(48) : sizeConverter(13),
                            lineHeight: 1.8,
                        }}
                    >
                        دستورالعملی برای این خطا نوشته نشده است
                    </Typography>
                )}
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    flexShrink: 0,
                    px: isMobile ? sizeConverter(20, 'space') : sizeConverter(16, 'space'),
                    py: isMobile ? sizeConverter(16, 'spaceY') : sizeConverter(12, 'spaceY'),
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pb: isMobile ? 8 : undefined,
                }}
            >
                <Button
                    onClick={onClose}
                    variant={isMobile ? "confirmMobile" : 'cancel'}
                    fullWidth={isMobile}
                    sx={{ height: isMobile ? sizeConverter(30, 'height') : undefined, }}
                >
                    {isMobile ? 'بستن' : 'انصراف'}
                </Button>
            </Box>
        </Dialog >
    )
}
