// src/components/mobile/MobileErrorCard.tsx

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

import { sizeConverter } from '@utility/sizeConverter';

type MobileErrorCardProps = {
    title: string;
    subtitle?: string;
    device?: string;
    errorCode: string | number;
    hasAccess: boolean
    onDelete?: () => void;
    onEdit?: () => void;
    onFiles?: () => void;
    onInfo?: () => void;
};

export default function MobileErrorCard({
    title,
    subtitle,
    device,
    errorCode,
    onDelete,
    onEdit,
    onFiles,
    onInfo,
    hasAccess,
}: MobileErrorCardProps) {
    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                mb: sizeConverter(2, 'spaceY'),
                border: '1px solid #EAEAEA',
                boxShadow: '0 4px 12px rgba(0,0,0,.08)',
                backgroundColor: '#fff',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    minHeight: sizeConverter(100, 'height'),
                    direction: 'rtl',
                }}
            >
                {/* محتوا */}
                <Box
                    sx={{
                        flex: 1,
                        pt: sizeConverter(12, 'spaceY'),
                        pb: sizeConverter(3, 'spaceY'),
                        px: sizeConverter(36, 'spaceX'),
                    }}
                >
                    <Grid
                        container
                        wrap="nowrap"
                        alignItems="center"
                    // columnGap={1}
                    >
                        {/* Error Code */}
                        <Box
                            sx={{
                                flexShrink: 0,
                                width: 'fit-content',
                                maxWidth: '40%',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: sizeConverter(60, 'radius'),
                                background:
                                    'linear-gradient(180deg,#980027 0%,#B1002D 100%)',
                                color: '#fff',

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

                        {/* Title */}
                        <Box

                            sx={{
                                flex: 1,
                                minWidth: 0,
                                display: 'flex',
                                direction: 'ltr'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: sizeConverter(46),
                                    fontWeight: 'bold',
                                    color: '#111',
                                    lineHeight: 1.5,
                                    // textAlign: 'right',
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                            }}
                        >
                            <Grid container justifyContent={'flex-end'}>

                                <Typography
                                    sx={{
                                        color: '#6E6E6E',

                                        fontSize: sizeConverter(38),
                                    }}
                                >
                                    {device ?? '-'}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#6E6E6E',
                                        fontWeight: 'bold',
                                        fontSize: sizeConverter(38),
                                    }}
                                >
                                    : دستگاه
                                </Typography>
                            </Grid>
                            <Grid container justifyContent={'flex-end'}>
                                <Grid container size={10.8}>
                                    <Typography
                                        sx={{
                                            color: '#6E6E6E',

                                            fontSize: sizeConverter(38),
                                        }}
                                    >
                                        {subtitle ?? '-'}
                                    </Typography>
                                </Grid>

                                <Typography
                                    sx={{
                                        color: '#6E6E6E',
                                        fontWeight: 'bold',
                                        fontSize: sizeConverter(38),
                                    }}
                                >
                                    : بانک
                                </Typography>
                            </Grid>
                        </Box>
                    </Box>

                    <Divider sx={{ my: sizeConverter(2, 'spaceY') }} />

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
                            icon={<DownloadOutlinedIcon />}
                            label="فایل ها"
                            onClick={onFiles}
                        />

                        {hasAccess &&
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
                        }
                    </Box>
                </Box>


            </Box>
        </Card >
    );
}

type ActionButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
};

function ActionButton({
    icon,
    label,
    onClick,
}: ActionButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                borderRadius: 2,
                gap: 0.5,
                color: '#333',
            }}
        >
            {icon}

            <Typography
                sx={{
                    fontSize: sizeConverter(36),
                    fontWeight: 500,
                }}
            >
                {label}
            </Typography>
        </IconButton>
    );
}