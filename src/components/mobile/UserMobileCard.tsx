// src/components/mobile/UserMobileCard.tsx
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
import LockResetIcon from '@mui/icons-material/LockReset';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import CircleIcon from '@mui/icons-material/Circle';

import { sizeConverter } from '@utility/sizeConverter';

type UserMobileCardProps = {
    user: any;
    roleName: string;
    hasAccess: boolean;
    onAction: (actionType: string, user: any) => void;
};

export default function UserMobileCard({
    user,
    roleName,
    hasAccess,
    onAction,
}: UserMobileCardProps) {
    return (
        <Card
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: sizeConverter(40, 'radius'),
                mb: sizeConverter(4, 'spaceY'),
                border: '1px solid #EAEAEA',
                boxShadow: '0 4px 12px rgba(0,0,0,.08)',
                backgroundColor: '#fff',
                
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    // direction: 'rtl',
                    px: sizeConverter(24, 'spaceX'),
                    pt: sizeConverter(14, 'spaceY'),
                    pb: sizeConverter(8, 'spaceY'),
                }}
            >
                {/* Header: Name and Status */}
                <Grid container justifyContent="space-between" alignItems="center">
                    <Typography
                        sx={{
                            fontSize: sizeConverter(48),
                            fontWeight: 700,
                            color: '#111',
                            lineHeight: 1.3,
                            textAlign: 'right',
                            wordBreak: 'break-word',
                        }}
                    >
                        {user.userName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: sizeConverter(42), color: '#6E6E6E' }}>
                            {user.disabled ? 'غیرفعال' : 'فعال'}
                        </Typography>
                        <CircleIcon 
                            sx={{ 
                                color: !user.disabled ? 'primary.main' : 'gray',
                                fontSize: sizeConverter(60)
                            }} 
                        />
                    </Box>
                </Grid>

                {/* Role */}
                <Grid container justifyContent="flex-start" sx={{ mt: sizeConverter(3, 'spaceY'), gap: 1 }}>
                    <Typography
                        sx={{
                            color: '#6E6E6E',
                            fontWeight: 700,
                            fontSize: sizeConverter(42),
                        }}
                    >
                        نقش کاربر:
                    </Typography>
                    <Typography
                        sx={{
                            color: '#111',
                            fontSize: sizeConverter(42),
                        }}
                    >
                        {roleName || 'نامشخص'}
                    </Typography>
                </Grid>

                {hasAccess && (
                    <>
                        <Divider sx={{ my: sizeConverter(3, 'spaceY') }} />
                        
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                gap: 1
                            }}
                        >
                            <ActionButton
                                icon={<EditOutlinedIcon sx={{ fontSize: sizeConverter(66) }} />}
                                label="ویرایش"
                                onClick={() => onAction('edit/user', user)}
                            />
                            <ActionButton
                                icon={<DeleteOutlineIcon sx={{ fontSize: sizeConverter(66) }} />}
                                label="حذف"
                                onClick={() => onAction('delete', user)}
                            />
                            <ActionButton
                                icon={<PasswordRoundedIcon sx={{ fontSize: sizeConverter(66) }} />}
                                label="رمز عبور"
                                onClick={() => onAction('add/password', user)}
                            />
                            <ActionButton
                                icon={<LockResetIcon sx={{ fontSize: sizeConverter(66) }} />}
                                label="بازنشانی"
                                onClick={() => onAction('add/reset', user)}
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
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
            }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: sizeConverter(24, 'radius'),
                gap: 0.5,
                color: '#333',
                p: 1,
            }}
        >
            {icon}
            <Typography sx={{ fontSize: sizeConverter(28), fontWeight: 600 }}>
                {label}
            </Typography>
        </IconButton>
    );
}
