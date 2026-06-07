import React from 'react';
import { Box, Card, Typography, IconButton, Avatar, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';

type RoleItemCardProps = {
    name: string;
    isAcceess: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onClick: () => void;
    onRoleAdd: () => void;
};


export default function RoleItemCard({
    name,
    onEdit,
    onDelete,
    onClick,
    onRoleAdd,
    isAcceess
}: RoleItemCardProps) {

    const theme = useTheme()

    return (
        <Card
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mb: 2,
                borderRadius: 4,
                boxShadow: `0 2px 8px ${theme.palette.black[6]}`,
                border: `1px solid ${theme.palette.black[7]}`,
                bgcolor: theme.palette.bgColor[0],
            }}
        >
            <Grid container size={8.5} onClick={() => onRoleAdd()}  >
                <Avatar
                    sx={{
                        bgcolor: theme.palette.bgColor[2],
                        color: theme.palette.primary.main,
                        mr: 2
                    }}
                >
                    <PersonIcon />
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight="bold">{name}</Typography>
                </Box>
            </Grid>
            <Grid container size={3} alignItems={'center'}>

                {isAcceess && <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit?.();
                        }}
                        sx={{
                            border: `1px solid ${theme.palette.black[7]}`,
                            borderRadius: 2,
                            color: theme.palette.black[0],
                            bgcolor: theme.palette.white[0],
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
                            border: `1px solid ${theme.palette.black[7]}`,
                            borderRadius: 2,
                            color: theme.palette.black[0],
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>}
            </Grid>

        </Card>
    );
}
