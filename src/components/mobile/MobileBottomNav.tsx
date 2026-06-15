import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';
import { useMemo } from 'react';
import { useAccessCheck } from '@src/utility/accessCheck';
import { filterNavigationByAccess } from './utils/navigationAccess';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCheck } = useAccessCheck();

    const menuItems = useMemo(
        () =>
            filterNavigationByAccess(
                LAYOUT_SIDEBAR_DATA,
                accessCheck
            ),
        [accessCheck]
    );



    const activeIndex = menuItems?.findIndex(
        (item) =>
            location.pathname === item.link ||
            location.pathname === item.mobileLink ||
            item.children?.some((child) =>
                location.pathname.startsWith(child.link || '')
            )
    );

    const handleNavClick = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        const selectedItem = menuItems?.[newValue];

        const targetRoute =
            selectedItem.mobileLink || selectedItem.link;

        if (targetRoute) {
            navigate({ to: targetRoute });
        }
    };



    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 6000,
                pb: 'env(safe-area-inset-bottom)',
            }}
        >
            <BottomNavigation
                value={activeIndex !== -1 ? activeIndex : false}
                onChange={handleNavClick}
            >
                {menuItems.map((item) => {
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