import { ReactNode, useState } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MobileBottomNav from '@components/mobile/MobileBottomNav';
import MobileBreadcrumbs from '@components/mobile/MobileBreadcrumbs';
import { useTheme } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout'; // آیکون خروج
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // آیکون کاربر (اختیاری)
import Cookies from 'js-cookie';
import { logout } from '@utility/session';
import LockResetIcon from '@mui/icons-material/LockReset';
import ChangePasswordDialog from './ChangePasswordDialog';
import BaleLinkDialog from '@components/section/bale/BaleLinkDialog';
import SmartToyIcon from '@mui/icons-material/SmartToyOutlined';
import { withSnackbar } from '@components/hoc/withSnackbar';

type Props = { children: ReactNode };

function MobileLayoutBase({ children, snackbarOpen }: Props & { snackbarOpen: any }) {
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [baleOpen, setBaleOpen] = useState(false);
    const theme = useTheme();
    const userName: string | undefined = Cookies.get('userName')
    // این مقادیر رو معمولاً از Context یا Redux می‌گیری

    const handleLogout = logout
    return (
        <Grid container sx={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            bgcolor: theme.palette.bgColor[1],
            overflow: 'hidden',
        }}>
            {/* AppBar ثابت */}
            <Grid
                size={12}
                container
                alignItems="center"
                justifyContent="space-between" // توزیع المان‌ها در دو طرف
                sx={{
                    position: 'fixed',
                    zIndex: 12000,
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
                <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => setBaleOpen(true)} aria-label="ارتباط با بله" sx={{ color: theme.palette.white[0] }}>
                        <SmartToyIcon />
                    </IconButton>
                    <IconButton onClick={() => setPasswordOpen(true)} aria-label="تغییر رمز عبور" sx={{ color: theme.palette.white[0] }}>
                        <LockResetIcon fontSize="medium" />
                    </IconButton>
                <IconButton onClick={handleLogout} sx={{ color: theme.palette.white[0] }}>
                    <LogoutIcon sx={{
                        transform: "rotate(180deg)"
                    }} fontSize="medium" />
                </IconButton>
                </Stack>
            </Grid>
            <Box sx={{
                position: 'fixed',
                top: '56px',
                left: 0,
                right: 0,
                zIndex: 12000,
                bgcolor: 'primary.main',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <MobileBreadcrumbs />
            </Box>

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                px: 2,
                pt: 14,
                pb: 20,
                minHeight: 0,
            }}>
                {children}
            </Box>

            {/* Bottom Navigation */}
            <MobileBottomNav />
            <ChangePasswordDialog open={passwordOpen} close={() => setPasswordOpen(false)} snackbarOpen={snackbarOpen} />
            <BaleLinkDialog open={baleOpen} close={() => setBaleOpen(false)} snackbarOpen={snackbarOpen} />
        </Grid>
    );
}

export const MobileLayout = withSnackbar(MobileLayoutBase as any) as any;
