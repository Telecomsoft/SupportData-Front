import { ReactNode } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MobileBottomNav from '@components/mobile/MobileBottomNav';
import MobileBreadcrumbs from '@components/mobile/MobileBreadcrumbs';
import { useTheme } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout'; // آیکون خروج
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // آیکون کاربر (اختیاری)
import Cookies from 'js-cookie';

type Props = { children: ReactNode };

export function MobileLayout({ children }: Props) {
    const theme = useTheme();
    const userName: string | undefined = Cookies.get('userName')
    // این مقادیر رو معمولاً از Context یا Redux می‌گیری

    const handleLogout = () => {
        Cookies.remove('auth_token')
        Cookies.remove('userName')
        Cookies.remove('userImage')
        Cookies.remove('userId')
        window.location.href = '/'
    }
    return (
        <Grid container sx={{
            minHeight: '100dvh',
            // bgcolor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            bgcolor: theme.palette.bgColor[1]
        }}>
            {/* AppBar ثابت */}
            <Grid
                size={12}
                container
                alignItems="center"
                justifyContent="space-between" // توزیع المان‌ها در دو طرف
                sx={{
                    position: 'fixed',
                    zIndex: 120,
                    bgcolor: theme.palette.dataGrid.main,
                    px: 2, // Padding افقی برای فاصله از لبه‌ها
                    height: '56px' // ارتفاع ثابت برای هماهنگی با محاسبات پایین
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <AccountCircleIcon sx={{ color: theme.palette.white[0], fontSize: 30 }} />
                    <Typography sx={{ color: theme.palette.white[0], fontWeight: 500 }}>
                        {userName}
                    </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 'bold', color: theme.palette.white[0] }}>
                    KIOSK SUPPORT INFO
                </Typography>
                <IconButton onClick={handleLogout} sx={{ color: theme.palette.white[0] }}>
                    <LogoutIcon sx={{
                        // transform: "rotate(360deg)"
                    }} fontSize="medium" />
                </IconButton>
            </Grid>
            <Box sx={{
                position: 'fixed',
                top: '56px',
                left: 0,
                right: 0,
                zIndex: 1100,
                bgcolor: 'primary.main',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <MobileBreadcrumbs />
            </Box>

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                mt: 'calc(56px + 45px)', // اصلاح ارتفاع بر اساس Breadcrumbs واقعی
                pb: 10,
                p: 2,
            }}>
                {children}
            </Box>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </Grid>
    );
}
