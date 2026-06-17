// src/components/mobile/SettingsCard.tsx

import {
    Card,
    Typography,
    Box,
    IconButton,
    Divider,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useTheme } from '@mui/material/styles';
import { sizeConverter } from '@utility/sizeConverter';

type SettingsCardProps = {
    name: string;
    hasAccess: boolean;
    description?: string;
    code?: string;
    deviceName?: string;
    deviceModelDocument?: string;
    isDeviceModelDocument?: string;
    onDelete?: () => void;
    onEdit?: () => void;
    onShowDocument?: () => void;
};

export default function SettingsCard({
    name,
    description,
    code,
    onDelete,
    onEdit,
    hasAccess,
    deviceName,
    deviceModelDocument,
    onShowDocument
}: SettingsCardProps) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                width: '100%',
                overflow: 'hidden',
                mb: sizeConverter(6, 'spaceY'),
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
        >
            <Box
                sx={{
                    px: 1,
                    pt: 2,
                }}
            >
                {/* Title & Document Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Typography
                        sx={{
                            fontSize: sizeConverter(46),
                            fontWeight: 700,
                            color: theme.palette.black[0],
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            flex: 1
                        }}
                    >
                        {name}
                    </Typography>
                </Box>

                {/* Code */}
                {code && (
                    <Box sx={{ display: 'flex', mt: 0.5, gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, color: theme.palette.black[3], fontSize: sizeConverter(38), whiteSpace: 'nowrap' }}>
                            کد :
                        </Typography>
                        <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                            {code ?? '-'}
                        </Typography>
                    </Box>
                )}

                {/* Device Name */}
                {deviceName && (
                    <Box sx={{ display: 'flex', mt: 0.5, gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, color: theme.palette.black[3], fontSize: sizeConverter(38), whiteSpace: 'nowrap' }}>
                            قطعه :
                        </Typography>
                        <Typography sx={{ color: theme.palette.black[3], fontSize: sizeConverter(38) }}>
                            {deviceName ?? '-'}
                        </Typography>
                    </Box>
                )}

                {/* Description */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mt: 0.5, gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, color: theme.palette.black[3], fontSize: sizeConverter(38), whiteSpace: 'nowrap' }}>
                        توضیحات :
                    </Typography>
                    <Typography
                        sx={{
                            flex: 1,
                            color: theme.palette.black[3],
                            fontSize: sizeConverter(38),
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {description || '-'}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <>
                    <Divider sx={{
                        my: sizeConverter(2, 'spaceY'),
                        borderColor: theme.palette.black[7],
                    }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        {!!onShowDocument && (
                            <ActionButton
                                icon={<DownloadOutlinedIcon />}
                                label="تصویر مدل قطعه"
                                onClick={onShowDocument}
                                disabled={!deviceModelDocument}
                            />
                        )}
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
                </>
            </Box>
        </Card>
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
            onClick={onClick}
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
            <Typography sx={{ fontSize: sizeConverter(36), fontWeight: 600 }}>
                {label}
            </Typography>
        </IconButton>
    );
}