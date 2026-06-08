// src/components/mobile/SettingsCard.tsx

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

import { sizeConverter } from '@utility/sizeConverter';

type SettingsCardProps = {
    name: string;
    hasAccess: boolean;
    description?: string;
    device?: string;

    onDelete?: () => void;
    onEdit?: () => void;
};

export default function SettingsCard({
    name,
    description,
    device,
    onDelete,
    onEdit,
    hasAccess,
}: SettingsCardProps) {
    return (
        <Card
            sx={{
                width: '100%',
                overflow: 'hidden',
                mb: sizeConverter(6, 'spaceY'),
                border: '1px solid #EAEAEA',
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    direction: 'rtl',
                    px: sizeConverter(32, 'spaceX'),   // کاهش یافته
                    pt: sizeConverter(14, 'spaceY'),
                    pb: sizeConverter(8, 'spaceY'),
                }}
            >
                <Grid container justifyContent={'flex-end'}>
                    <Typography
                        sx={{
                            fontSize: sizeConverter(46),   // کوچکتر
                            fontWeight: 700,
                            color: '#111',
                            lineHeight: 1.3,
                            textAlign: 'right',
                            wordBreak: 'break-word',
                        }}
                    >
                        {name}
                    </Typography>
                </Grid>

                {/* Device */}
                {device && (
                    <Grid
                        container
                        justifyContent="flex-end"
                        sx={{ mt: sizeConverter(2, 'spaceY') }}
                    >
                        <Typography
                            sx={{
                                color: '#6E6E6E',
                                fontSize: sizeConverter(38),   // کوچکتر
                            }}
                        >
                            {device}
                        </Typography>

                        <Typography
                            sx={{
                                color: '#6E6E6E',
                                fontWeight: 700,
                                fontSize: sizeConverter(38),
                            }}
                        >
                            : دستگاه
                        </Typography>
                    </Grid>
                )}

                {/* Description */}

                <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ mt: sizeConverter(1, 'spaceY') }}
                >
                    {description && <Typography
                        sx={{
                            color: '#6E6E6E',
                            fontSize: sizeConverter(38),
                            textAlign: 'right',
                        }}
                    >
                        {description}
                    </Typography>}

                    <Typography
                        sx={{
                            color: '#6E6E6E',
                            fontWeight: 700,
                            fontSize: sizeConverter(38),
                        }}
                    >
                        : توضیحات
                    </Typography>
                </Grid>
                {hasAccess && (
                    <>
                        <Divider
                            sx={{
                                my: sizeConverter(2.5, 'spaceY'),   // کاهش فاصله
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <ActionButton
                                icon={
                                    <EditOutlinedIcon
                                        sx={{ fontSize: sizeConverter(48) }}
                                    />
                                }
                                label="ویرایش"
                                onClick={onEdit}
                            />

                            <ActionButton
                                icon={
                                    <DeleteOutlineIcon
                                        sx={{ fontSize: sizeConverter(48) }}
                                    />
                                }
                                label="حذف"
                                onClick={onDelete}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Card>
    );
}

type ActionButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
};

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                borderRadius: sizeConverter(50, 'radius'),
                gap: 1,
                color: '#333',
                px: 2,
                py: 0.8,
            }}
        >
            {icon}

            <Typography
                sx={{
                    fontSize: sizeConverter(36),   // کوچکتر
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>
        </IconButton>
    );
}   