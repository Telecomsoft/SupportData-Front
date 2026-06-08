// src/components/mobile/MobileBottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeIndex = LAYOUT_SIDEBAR_DATA.findIndex(item =>
        location.pathname === item.link || 
        location.pathname === item.mobileLink ||
        (item.children && item.children.some(child => location.pathname.startsWith(child.link || '')))
    );

    const handleNavClick = (event: React.SyntheticEvent, newValue: number) => {
        const selectedItem = LAYOUT_SIDEBAR_DATA[newValue];
        
        // اولویت با لینک موبایل است، در غیر اینصورت لینک دسکتاپ
        const targetRoute = selectedItem.mobileLink || selectedItem.link;
        
        if (targetRoute) {
            navigate({ to: targetRoute });
        }
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 6000, pb: 'env(safe-area-inset-bottom)' }}>
            <BottomNavigation
                value={activeIndex !== -1 ? activeIndex : false}
                onChange={handleNavClick}
            >
                {LAYOUT_SIDEBAR_DATA.map((item) => {
                    const Icon = item.icon;
                    return (
                        <BottomNavigationAction
                            key={item.value}
                            label={item.name}
                            icon={<Icon />}
                        />
                    );
                })}
            </BottomNavigation>
        </Paper>
    );
}
