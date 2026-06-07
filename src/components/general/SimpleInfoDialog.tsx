// src/components/general/SimpleInfoDialog.tsx
import { ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'

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
                sx: isMobile
                    ? {
                        width: '100%',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        borderRadius: 0,
                        mb: 0,
                    }
                    : {
                        minWidth: sizeConverter(dialogWidth, 'width'),
                        borderRadius: sizeConverter(12, 'radius'),
                    },
            }}
        >
            <Grid
                container
                direction="column"
                sx={{
                    p: isMobile ? sizeConverter(20, 'space') : sizeConverter(10, 'space'),
                    height: isMobile ? '100%' : 'auto',
                }}
            >
                {/* Header */}
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        pb: isMobile ? sizeConverter(16, 'spaceY') : 0,
                        borderBottom: isMobile ? '1px solid #EAEAEA' : 'none',
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

                    {!isMobile && (
                        <HighlightOffOutlinedIcon
                            sx={{
                                cursor: 'pointer',
                                fontSize: sizeConverter(48),
                                color: '#999',
                                '&:hover': { color: '#000' },
                            }}
                            onClick={onClose}
                        />
                    )}
                </Grid>

                {/* Content Area */}
                <Grid
                    sx={{
                        mt: sizeConverter(12, 'spaceY'),
                        flex: isMobile ? 1 : undefined,
                        overflowY: 'auto',
                        pr: isMobile ? 1 : 0, // کمی فاصله برای اسکرول
                    }}
                >
                    {(message || customContent) && (
                        <Grid
                            sx={{
                                p: isMobile ? sizeConverter(18, 'space') : sizeConverter(12, 'space'),
                                bgcolor: 'background.paper',
                                borderRadius: isMobile ? 0 : sizeConverter(12, 'radius'),
                                border: isMobile ? 'none' : '1px solid #e0e0e0',
                            }}
                        >
                            <Typography
                                component="div"
                                sx={{
                                    whiteSpace: 'pre-line',
                                    fontSize: isMobile ? sizeConverter(52) : sizeConverter(14),
                                    lineHeight: isMobile ? 1.8 : 1.7,
                                }}
                            >
                                {message || customContent}
                            </Typography>
                        </Grid>
                    )}

                    {!message && !customContent && (
                        <Typography
                            sx={{
                                p: sizeConverter(16, 'space'),
                                color: 'text.secondary',
                                fontSize: isMobile ? sizeConverter(48) : sizeConverter(13),
                                lineHeight: 1.8,
                            }}
                        >
                            دستورالعملی برای این خطا نوشته نشده است
                        </Typography>
                    )}
                </Grid>

                {/* Footer */}
                <Grid
                    container
                    justifyContent="flex-end"
                    sx={{
                        mt: isMobile ? 'auto' : sizeConverter(15, 'spaceY'),
                        pt: isMobile ? sizeConverter(16, 'spaceY') : 0,
                        pb: isMobile ? 8 : 0,
                        borderTop: isMobile ? '1px solid #EAEAEA' : 'none',
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="confirmMobile"
                        // color="primary"
                        fullWidth={isMobile}
                        sx={{
                            height: isMobile ? sizeConverter(30, 'height') : undefined,
                           
                        }}
                    >
                        بستن
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}