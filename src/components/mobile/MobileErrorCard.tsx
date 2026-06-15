import { useState } from 'react';
import {
    Card,
    Typography,
    Box,
    IconButton,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import { sizeConverter } from '@utility/sizeConverter';
import FileDialog from '@components/general/FileDialog';

interface FileItem {
    id: string | number;
    name: string;
    rawFile: any;
}

type MobileErrorCardProps = {
    title: string;
    subtitle?: string;
    device?: string;
    deviceModel?: string;
    errorCode: string | number;
    hasAccess: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onInfo?: () => void;
    files?: FileItem[];
    onDownloadClick?: (file: any) => void;
};

export default function MobileErrorCard({
    title,
    subtitle,
    device,
    deviceModel,
    errorCode,
    onDelete,
    onEdit,
    onInfo,
    hasAccess,
    files = [],
    onDownloadClick,
}: MobileErrorCardProps) {
    // استیت برای مدیریت باز و بسته بودن کشوی فایل‌ها
    const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false); const theme = useTheme();

    const handleOpenFiles = () => {
        if (files.length > 0) {
            setIsFilesDialogOpen(true);
        }
    };

    // const getFileIcon = (rawFile) => {
    //     const extension = rawFile?.split('.').pop().toLowerCase();
    //     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    //     if (extension === 'pdf') {
    //         return <PictureAsPdfIcon sx={{ color: theme.palette.primary.main }} />;
    //     }
    //     if (extension === 'txt') {
    //         return <ArticleIcon sx={{ color: theme.palette.primary.main }} />;
    //     }

    //     if (imageExtensions.includes(extension)) {
    //         return <ImageIcon sx={{ color: theme.palette.primary.main }} />;
    //     }

    //     return <DownloadForOfflineIcon sx={{ color: theme.palette.primary.main }} />;
    // }

    return (
        <>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: sizeConverter(100, 'height'),
                        direction: 'rtl',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            pt: sizeConverter(12, 'spaceY'),
                            pb: sizeConverter(3, 'spaceY'),
                            px: sizeConverter(36, 'spaceX'),
                        }}
                    >
                        <Grid container wrap="nowrap" alignItems="center">
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: 'fit-content',
                                    maxWidth: '40%',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: sizeConverter(60, 'radius'),
                                    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.dataGrid.bgHeaderColor} 100%)`,
                                    color: theme.palette.white[0],
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: sizeConverter(30),
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        pt: sizeConverter(2, 'spaceY'),
                                    }}
                                >
                                    {errorCode}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', direction: 'ltr' }}>
                                <Typography
                                    sx={{
                                        fontSize: sizeConverter(46),
                                        fontWeight: 'bold',
                                        color: theme.palette.black[0],
                                        lineHeight: 1.5,
                                        whiteSpace: 'normal',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {title}
                                </Typography>
                            </Box>
                        </Grid>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Box sx={{ flex: 1, textAlign: 'center' }}>
                                <Grid container justifyContent={'flex-end'}>
                                    <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                                        {device ?? '-'}
                                    </Typography>
                                    <Typography sx={{ color: theme.palette.black[3], fontWeight: 'bold', fontSize: sizeConverter(38) }}>
                                        : قطعه
                                    </Typography>
                                </Grid>
                                <Grid container justifyContent={'flex-end'}>
                                    <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                                        {deviceModel ?? '-'}
                                    </Typography>
                                    <Typography sx={{ color: theme.palette.black[3], fontWeight: 'bold', fontSize: sizeConverter(38) }}>
                                        : مدل قطعه
                                    </Typography>
                                </Grid>
                                <Grid container justifyContent={'flex-end'}>
                                    <Grid container size={10.8}>
                                        <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                                            {subtitle?.length > 0 ? subtitle : 'همه بانک ها'}
                                        </Typography>
                                    </Grid>
                                    <Typography sx={{ color: theme.palette.black[3], fontWeight: 'bold', fontSize: sizeConverter(38) }}>
                                        : بانک
                                    </Typography>
                                </Grid>
                            </Box>
                        </Box>

                        <Divider sx={{
                            my: sizeConverter(2, 'spaceY'),
                            borderColor: theme.palette.black[7]
                        }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <ActionButton icon={<InfoOutlinedIcon />} label="راهنما" onClick={onInfo} />

                            {/* تغییر دکمه فایل‌ها */}
                            <ActionButton
                                icon={<DownloadOutlinedIcon />}
                                label={`فایل‌ها ${files.length > 0 ? `(${files.length})` : ''}`}
                                onClick={handleOpenFiles}
                                disabled={files.length === 0}
                            />

                            {hasAccess && (
                                <>
                                    <ActionButton icon={<EditOutlinedIcon />} label="ویرایش" onClick={onEdit} />
                                    <ActionButton icon={<DeleteOutlineIcon />} label="حذف" onClick={onDelete} />
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Card>

            {/* کشوی نمایش فایل‌ها */}
            {/* <Drawer
                anchor="bottom"
                open={isFilesDrawerOpen}
                onClose={() => setIsFilesDrawerOpen(false)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 8, pt: 1, bgcolor: theme.palette.white[0] }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2, pr: 1, py: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">فایل‌ های ضمیمه</Typography>
                    <IconButton onClick={() => setIsFilesDrawerOpen(false)}>
                        <HighlightOffOutlinedIcon />
                    </IconButton>
                </Box>
                <List>
                    {files?.map((file) => (
                        <>
                            <Grid container justifyContent={'space-between'} >

                                <ListItem disablePadding key={file.id}>
                                    <ListItemButton
                                        sx={{ px: 2 }}
                                        key={file.id}
                                        onClick={() => {
                                            if (onDownloadClick) {
                                                onDownloadClick(file.rawFile);
                                            } else {
                                                console.error("onDownloadClick is undefined!");
                                            }
                                        }}
                                    >
                                        <ListItemText primary={file.name} />
                                        {getFileIcon(file.rawFile)}
                                    </ListItemButton>
                                </ListItem>

                            </Grid >
                            <Divider sx={{
                                mx: 2,
                                borderColor: theme.palette.black[7]
                            }} />
                        </>
                    ))}
                </List>
            </Drawer > */}
            <FileDialog
                open={isFilesDialogOpen}
                onClose={() => setIsFilesDialogOpen(false)}
                files={files}
                onDownloadClick={onDownloadClick}
            />
        </>
    );
}

type ActionButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};

function ActionButton({ icon, label, onClick, disabled }: ActionButtonProps) {
    const theme = useTheme();

    return (
        <IconButton
            onClick={(e) => {
                e.stopPropagation();
                if (onClick && !disabled) onClick();
            }}
            disabled={disabled}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: sizeConverter(24, 'radius'),
                gap: 0.5,
                color: disabled ? theme.palette.black[6] : theme.palette.black[1],
                p: 1,
                '&:hover': {
                    backgroundColor: theme.palette.bgColor[2],
                }
            }}
        >
            {icon}
            <Typography
                sx={{
                    fontSize: sizeConverter(28),
                    fontWeight: 600,
                    color: 'inherit'
                }}
            >
                {label}
            </Typography>
        </IconButton>
    );
}

