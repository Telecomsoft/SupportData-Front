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
        <Box sx={{ minHeight: '100dvh', bgcolor: '#f8f9fa' }}>
            {/* AppBar */}
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

            {/* Breadcrumbs */}
            <Box sx={{ mt: 7 }}>
                <MobileBreadcrumbs />
            </Box>

            {/* Mobile Drawer - منوی ساده و مناسب موبایل */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: '80%', maxWidth: 320 } }}
            >
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">منو</Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <List sx={{ pt: 0 }}>
                    {/* اینجا منوی موبایل خودت رو بذار - فعلاً نمونه */}
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

            {/* Main Content */}
            <Box sx={{ p: 2, pb: 10, mt: 2 }}>
                {children}
            </Box>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </Box>
    );
}