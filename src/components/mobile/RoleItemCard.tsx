import React from 'react';
import { Box, Card, Typography, IconButton, Avatar } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';

type RoleItemCardProps = {
    name: string;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
    onRoleAdd: () => void;
};

const mainColor = '#7a0016';

export default function RoleItemCard({
    name,
    onEdit,
    onDelete,
    onClick,
    onRoleAdd,
}: RoleItemCardProps) {

    return (
        <Card
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mb: 2,
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                cursor: 'pointer'
            }}
        >
            <Avatar onClick={() => onRoleAdd()} sx={{ bgcolor: '#fff5f5', color: mainColor, mr: 2 }}>
                <PersonIcon />
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold">{name}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                    onClick={(e) => {
                        e.preventDefault(); // جلوگیری از رفتار پیش‌فرض
                        e.stopPropagation(); // جلوگیری از انتقال کلیک به کارت اصلی (جلوگیری از باز شدن دیالوگ)
                        if (onEdit) onEdit(); // فراخوانی تابع ویرایش
                    }}
                    sx={{
                        border: '1px solid #eee',
                        borderRadius: 2,
                        color: mainColor
                    }}
                >
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onDelete) onDelete(); // فراخوانی تابع حذف
                    }}
                    sx={{
                        border: '1px solid #eee',
                        borderRadius: 2,
                        color: mainColor
                    }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Box>
        </Card>
    );
}
