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
    const theme = useTheme();

    return (
        <Card
            onClick={onClick}
            sx={{
                width: '100%',
                backgroundColor: theme.palette.white[0],
                borderRadius: 3,
                p: 2,
                mb: 2,
                boxShadow: `0 4px 12px rgba(0,0,0,0.03)`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: `0 6px 16px rgba(0,0,0,0.06)`,
                }
            }}
        >
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
            >
                <Grid
                    size={{ xs: isAcceess ? 7 : 12, sm: 8, md: 9 }}
                    display="flex"
                    alignItems="center"
                    onClick={onRoleAdd}
                >
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.bgColor[2],
                            color: theme.palette.primary.main,
                            ml: 0,
                            mr: 2
                        }}
                    >
                        <PersonIcon />
                    </Avatar>

                    <Typography
                        fontWeight="bold"
                        sx={{
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {name}
                    </Typography>
                </Grid>

                {isAcceess && (
                    <Grid
                        size={{ xs: 5, sm: 4, md: 3 }}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
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
                                    p: { xs: 0.5, sm: 1 }
                                }}
                            >
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                                sx={{
                                    border: `1px solid ${theme.palette.black[7]}`,
                                    borderRadius: 2,
                                    color: theme.palette.black[0],
                                    p: { xs: 0.5, sm: 1 }
                                }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Card>
    );
}