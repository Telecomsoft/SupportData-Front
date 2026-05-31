// src/components/mobile/MobileErrorCard.tsx

import {
    Card,
    Typography,
    Box,
    IconButton,
    Divider,
    Grid2,
} from '@mui/material';

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
}: MobileErrorCardProps) {
    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                mb: 2,
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
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid2 container justifyContent={'space-between'} alignContent={'flex-start'}>

                        <Box
                            sx={{
                                width: sizeConverter(170, 'width'),
                                height: sizeConverter(20, 'height'),
                                borderRadius: '18px',
                                background:
                                    'linear-gradient(180deg,#980027 0%,#B1002D 100%)',
                                color: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: sizeConverter(30),
                                    fontWeight: 700,
                                    mt: 0.5,
                                }}
                            >
                                {errorCode}
                            </Typography>

                        </Box>
                        <Typography
                            sx={{
                                fontSize: sizeConverter(46),
                                fontWeight: 'bold',
                                color: '#111',
                                mb: 1,
                                lineHeight: 1.4,
                            }}
                        >
                            {title}
                        </Typography>
                    </Grid2>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                        }}
                    >

                        {/* متن */}
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                            }}
                        >

                            {/* {device && ( */}
                            <Grid2 container justifyContent={'flex-end'}>

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
                            </Grid2>

                            {/* )} */}

                            {/* {subtitle && ( */}
                            <Grid2 container justifyContent={'flex-end'}>
                                <Typography
                                    sx={{
                                        color: '#6E6E6E',
                                       
                                        fontSize: sizeConverter(38),
                                    }}
                                >
                                    {subtitle ?? '-'}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#6E6E6E',
                                        fontWeight: 'bold',
                                        fontSize: sizeConverter(38),
                                    }}
                                >
                                    : بانک
                                </Typography>
                            </Grid2>
                            {/* )} */}
                        </Box>
                    </Box>

                    <Divider sx={{ my: sizeConverter(2, 'spaceY') }} />

                    {/* عملیات */}
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
                    </Box>
                </Box>

                {/* نوار قرمز سمت چپ */}
                {/* <Box
                    sx={{
                        width: 12,
                        background:
                            'linear-gradient(180deg,#980027 0%,#B1002D 100%)',
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                    }}
                /> */}
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