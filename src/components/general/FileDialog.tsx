// src/components/common/FileDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Box,
    useMediaQuery,
    Button,
} from '@mui/material';

import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';

import { useTheme } from '@mui/material/styles';
import { sizeConverter } from '@src/utility/sizeConverter';

export interface FileItem {
    id: string | number;
    name: string;
    rawFile: string;
}

type FileDialogProps = {
    open: boolean;
    onClose: () => void;
    files?: FileItem[];
    onDownloadClick?: (file: string) => void;
};

export default function FileDialog({
    open,
    onClose,
    files = [],
    onDownloadClick,
}: FileDialogProps) {
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getFileIcon = (rawFile: string) => {
        const extension = rawFile?.split('.').pop()?.toLowerCase();

        const imageExtensions = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'svg',
        ];

        if (extension === 'pdf') {
            return (
                <PictureAsPdfIcon
                    sx={{ color: theme.palette.primary.main }}
                />
            );
        }

        if (extension === 'txt') {
            return (
                <ArticleIcon
                    sx={{ color: theme.palette.primary.main }}
                />
            );
        }

        if (imageExtensions.includes(extension || '')) {
            return (
                <ImageIcon
                    sx={{ color: theme.palette.primary.main }}
                />
            );
        }

        return (
            <DownloadForOfflineIcon
                sx={{ color: theme.palette.primary.main }}
            />
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? '24px 24px 0 0' : 4,
                    width: '100%',
                    m: isMobile ? 0 : 2,

                    ...(isMobile && {
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
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
                فایل‌های ضمیمه

                {!isMobile && <IconButton onClick={onClose}>
                    <HighlightOffOutlinedIcon />
                </IconButton>}
            </DialogTitle>

            <DialogContent sx={{
                p: isMobile ? 0 : 2,
            }}>
                <List>
                    {files?.map((file) => (
                        <Box key={file.id}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        onDownloadClick?.(file.rawFile)
                                    }
                                >
                                    <ListItemText primary={file.name} />
                                    {getFileIcon(file.rawFile)}
                                </ListItemButton>
                            </ListItem>

                            <Divider />
                        </Box>
                    ))}
                </List>
            </DialogContent>
            <Box
                sx={{
                    flexShrink: 0,
                    px: isMobile ? sizeConverter(20, 'space') : sizeConverter(16, 'space'),
                    py: isMobile ? sizeConverter(16, 'spaceY') : sizeConverter(12, 'spaceY'),
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
        </Dialog>
    );
}