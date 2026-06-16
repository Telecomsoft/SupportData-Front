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
import MemoryIcon from '@mui/icons-material/Memory';

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
    deviceModelDocument?: string;
    deviceCode?: string;
    deviceModelCode?: string;
    errorCode: string | number;
    hasAccess: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onInfo?: () => void;
    files?: FileItem[];
    onDownloadClick?: (file: any) => void;
    onShowGuide?: () => void;

};

export default function MobileErrorCard({
    title,
    subtitle,
    device,
    deviceModel,
    errorCode,
    deviceCode,
    deviceModelCode,
    deviceModelDocument,
    onDelete,
    onEdit,
    onInfo,
    hasAccess,
    files = [],
    onShowGuide,
    onDownloadClick,
}: MobileErrorCardProps) {

    const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false); const theme = useTheme();

    const handleOpenFiles = () => {
        if (files.length > 0) {
            setIsFilesDialogOpen(true);
        }
    };


    return (
        <>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: sizeConverter(100, 'height'),
                        // direction: 'ltr',
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
                        {/* Header */}
                        <Grid container wrap="nowrap" alignItems="center" spacing={1}>
                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: sizeConverter(46),
                                        fontWeight: 'bold',
                                        color: theme.palette.black[0],
                                        lineHeight: 1.5,
                                        //
                                        whiteSpace: 'normal',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {title}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: 'fit-content',
                                    maxWidth: '40%',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: sizeConverter(60, 'radius'),
                                    background: `linear-gradient(
                                    180deg,
                                    ${theme.palette.primary.main} 0%,
                                    ${theme.palette.dataGrid.bgHeaderColor} 100%
                                )`,
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


                        </Grid>

                        {/* Device */}
                        <Box sx={{ mt: 1 }}>
                            {/* ردیف اول */}
                            <Grid container spacing={1}>
                                <Grid size={7}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            // justifyContent: 'flex-end',
                                            // alignItems: 'flex-start',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontWeight: 'bold',
                                                fontSize: sizeConverter(38),
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            قطعه :
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontSize: sizeConverter(38),
                                                flex: 1,

                                                wordBreak: 'break-word',
                                                overflowWrap: 'anywhere',
                                            }}
                                        >
                                            {device ?? '-'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid size={5}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-start',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontWeight: 'bold',
                                                fontSize: sizeConverter(38),
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            کد قطعه :
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontSize: sizeConverter(38),

                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {deviceCode ?? '-'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* ردیف دوم */}
                            <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                <Grid size={7}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-start',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontWeight: 'bold',
                                                fontSize: sizeConverter(38),
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            مدل قطعه :
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontSize: sizeConverter(38),
                                                flex: 1,

                                                wordBreak: 'break-word',
                                                overflowWrap: 'anywhere',
                                            }}
                                        >
                                            {deviceModel ?? '-'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid size={5}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-start',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontWeight: 'bold',
                                                fontSize: sizeConverter(38),
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            کد مدل قطعه :
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.palette.black[3],
                                                fontSize: sizeConverter(38),

                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {deviceModelCode ?? '-'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* بانک */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start',
                                    gap: 0.5,
                                    mt: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: theme.palette.black[3],
                                        fontWeight: 'bold',
                                        fontSize: sizeConverter(38),
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    بانک :
                                </Typography>

                                <Typography
                                    sx={{
                                        color: theme.palette.black[3],
                                        fontSize: sizeConverter(38),
                                        flex: 1,

                                        wordBreak: 'break-word',
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {subtitle?.length > 0 ? subtitle : 'همه بانک ها'}
                                </Typography>
                            </Box>
                        </Box>





                        <Divider
                            sx={{
                                my: sizeConverter(2, 'spaceY'),
                                borderColor: theme.palette.black[7],
                            }}
                        />

                        {/* Actions */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <ActionButton
                                icon={<InfoOutlinedIcon />}
                                label="راهنما"
                                onClick={onInfo}
                            />

                            <ActionButton
                                icon={<MemoryIcon />}
                                label="جزییات مدل قطعه"
                                onClick={onShowGuide}
                                disabled={!deviceModelDocument}
                            />

                            <ActionButton
                                icon={<DownloadOutlinedIcon />}
                                label={`فایل‌ها ${files.length > 0 ? `(${files.length})` : ''
                                    }`}
                                onClick={handleOpenFiles}
                                disabled={files.length === 0}
                            />

                            {hasAccess && (
                                <>
                                    <ActionButton
                                        icon={<EditOutlinedIcon />}
                                        label="ویرایش"
                                        onClick={onEdit}
                                    />
                                    <ActionButton
                                        icon={<DeleteOutlineIcon />}
                                        label="حذف"
                                        onClick={onDelete}
                                    />
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Card>

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

