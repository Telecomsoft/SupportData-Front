// src/components/common/ImageDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Button,
} from '@mui/material';

import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

// import { useTheme } from '@mui/material/styles';
import { sizeConverter } from '@src/utility/sizeConverter';
import { useDevice } from '@src/hooks/useDevice';
// import getEndpoint from '@src/utility/getEndPoint';

type ImageDialogProps = {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
    description?: string;
};

export default function ImageDialog({
    open,
    onClose,
    imageUrl,
    description,
}: ImageDialogProps) {
    // const theme = useTheme();

    const { isMobile } = useDevice()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            PaperProps={{
                sx: {
                    overflow: 'hidden',
                    minWidth: isMobile ? '100%' : sizeConverter(800, 'width'),
                    borderRadius: isMobile ? 0 : sizeConverter(12, 'radius'),
                    maxHeight: isMobile ? '100%' : sizeConverter(1200, 'height'),
                    // px:sizeConverter(16,'spaceX'),
                    ...(isMobile && {
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        m: 0,
                    }),
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                جزئیات

                <IconButton onClick={onClose}>
                    <HighlightOffOutlinedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Image */}
                <Box
                    sx={{
                        width: '100%',
                        height: 500, // ارتفاع ثابت
                        // backgroundColor: '#f5f5f5',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        component="img"
                        // src={`${getEndpoint()}${imageUrl}`}
                        src={imageUrl}
                        alt="preview"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                </Box>

                {/* Description */}
                <Box
                    sx={{
                        p: 2,
                        maxHeight: 180,
                        overflowY: 'auto',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 2,
                        }}
                    >
                        {description || 'توضیحی ثبت نشده است.'}
                    </Typography>
                </Box>
            </DialogContent>

            <Box
                sx={{
                    px: isMobile
                        ? sizeConverter(20, 'space')
                        : sizeConverter(16, 'space'),
                    py: isMobile
                        ? sizeConverter(16, 'spaceY')
                        : sizeConverter(12, 'spaceY'),
                    pb: isMobile ? 8 : undefined,
                }}
            >
                <Button
                    onClick={onClose}
                    variant={isMobile ? 'confirmMobile' : 'cancel'}
                    fullWidth={isMobile}
                >
                    بستن
                </Button>
            </Box>
        </Dialog>
    );
}