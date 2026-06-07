import { useState } from 'react';
import {
    Card,
    Typography,
    Box,
    IconButton,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { sizeConverter } from '@utility/sizeConverter';


interface FileItem {
    id: string | number;
    name: string;
    rawFile: any;
}

type MobileErrorCardProps = {
    title: string;
    subtitle?: string;
    device?: string;
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
    errorCode,
    onDelete,
    onEdit,
    onInfo,
    hasAccess,
    files = [],
    onDownloadClick,
}: MobileErrorCardProps) {
    // استیت برای مدیریت باز و بسته بودن کشوی فایل‌ها
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);
    const theme = useTheme();

    const handleOpenFiles = () => {
        if (files.length > 0) {
            setIsFilesDrawerOpen(true);
        }
    };

    return (
        <>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: sizeConverter(45, 'radius'),

                    // border: `1px solid ${theme.palette.black[7]}`,
                    boxShadow: `0 4px 6px ${theme.palette.black[7]}`,
                    backgroundColor: theme.palette.white[0],
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
                                        : دستگاه
                                    </Typography>
                                </Grid>
                                <Grid container justifyContent={'flex-end'}>
                                    <Grid container size={10.8}>
                                        <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                                            {subtitle ?? '-'}
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
            <Drawer
                anchor="bottom"
                open={isFilesDrawerOpen}
                onClose={() => setIsFilesDrawerOpen(false)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 8, pt: 1,bgcolor:theme.palette.bgColor[1] }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">فایل‌های ضمیمه</Typography>
                    <IconButton onClick={() => setIsFilesDrawerOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List>
                    {files?.map((file) => (
                        <ListItem disablePadding key={file.id}>
                            <ListItemButton
                                key={file.id}
                                onClick={() => {
                                    console.log("Clicked file:", file);
                                    if (onDownloadClick) {
                                        onDownloadClick(file.rawFile);
                                    } else {
                                        console.error("onDownloadClick is undefined!");
                                    }
                                }}
                            >
                                <ListItemText primary={file.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
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

