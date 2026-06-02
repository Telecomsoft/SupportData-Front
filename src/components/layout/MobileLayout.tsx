// src/layouts/MobileLayout.tsx
import { ReactNode, } from 'react';
import { Box, Typography, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MobileBottomNav from '@components/mobile/MobileBottomNav';
import MobileBreadcrumbs from '@components/mobile/MobileBreadcrumbs';
import { useTheme } from '@mui/system'

type Props = { children: ReactNode };

export function MobileLayout({ children }: Props) {
    const theme = useTheme()
    return (
        <Grid container  sx={{
            minHeight: '100dvh',
            bgcolor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* AppBar ثابت */}
            <Grid size={12} container justifyContent={'center'} sx={{ position: 'fixed', zIndex: 120, bgcolor: theme.palette.dataGrid.main }}>

                <Typography variant="h6" sx={{ p: 2, ml: 2, fontWeight: 'bold', color: theme.palette.white[0] }}>
                    KIOSK SUPPORT INFO
                </Typography>
            </Grid>

            {/* MobileBreadcrumbs ثابت (کادر قرمز) */}
            <Box sx={{
                position: 'fixed',
                top: '56px',           // ارتفاع AppBar (معمولاً 56px)
                left: 0,
                right: 0,
                zIndex: 1100,
                bgcolor: 'primary.main',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <MobileBreadcrumbs />
            </Box>

            {/* Main Content - اسکرول فقط اینجا */}
            <Box sx={{
                flex: 1,
                mt: 'calc(56px + 80px)',   // AppBar + ارتفاع تقریبی MobileBreadcrumbs
                pb: 10,                     // فضای پایین برای BottomNav
                p: 2,
                // overflowY: 'auto',
                // WebkitOverflowScrolling: 'touch' // اسکرول روان در iOS
            }}>
                {children}
            </Box>

            {/* Drawer */}

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </Grid >
    );
}