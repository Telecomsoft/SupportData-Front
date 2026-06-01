// src/layouts/MobileLayout.tsx
import { ReactNode, useState } from 'react';
import { 
    AppBar, Toolbar, IconButton, Drawer, Box, Typography, List, ListItem, 
    ListItemButton, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MobileBottomNav from '@components/mobile/MobileBottomNav';
import MobileBreadcrumbs from '@components/mobile/MobileBreadcrumbs';

type Props = { children: ReactNode };

export function MobileLayout({ children }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Box sx={{ 
            minHeight: '100dvh', 
            bgcolor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* AppBar ثابت */}
            <AppBar position="fixed" color="primary" elevation={3}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Typography variant="h6" sx={{ ml: 2, flexGrow: 1, fontWeight: 'bold' }}>
                        KIOSK SUPPORT INFO
                    </Typography>
                </Toolbar>
            </AppBar>

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
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: '80%', maxWidth: 320 } }}
            >
                {/* ... محتوای Drawer بدون تغییر ... */}
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">منو</Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <List sx={{ pt: 0 }}>
                    <ListItemButton>
                        <ListItemIcon><MenuIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
                        <ListItemText primary="داشبورد" />
                    </ListItemButton>
                    
                    <ListItemButton>
                        <ListItemIcon><MenuIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
                        <ListItemText primary="خطاها" />
                    </ListItemButton>

                    <Divider />
                    
                    <ListItemButton onClick={() => { /* handle logout */ }}>
                        <ListItemText primary="خروج" sx={{ color: 'error.main' }} />
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </Box>
    );
}