// src/components/mobile/MobileSubMenu.tsx
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';

export default function MobileSubMenu({ parentValue }: { parentValue: string }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const parentItem = LAYOUT_SIDEBAR_DATA.find(item => item.value === parentValue);

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {parentItem?.children?.map(child => {
                const Icon = child.icon; // رندر آیکون از دیتا
                return (
                    <Paper
                        key={child.value}
                        elevation={1}
                        onClick={() => navigate({ to: child.link })}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 2, 
                            borderRadius: 3,
                            cursor: 'pointer' 
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                        <Box sx={{ flexGrow: 1, textAlign: 'right', pr: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {child.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                مشاهده و مدیریت {child.name}
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            ml: 2, 
                            p: 1.5, 
                            bgcolor: theme.palette.error.light, // رنگ پس زمینه آیکون را با تم خود تنظیم کنید
                            color: theme.palette.error.main,
                            borderRadius: 2,
                            display: 'flex'
                        }}>
                            <Icon />
                        </Box>
                    </Paper>
                )
            })}
        </Box>
    )
}
