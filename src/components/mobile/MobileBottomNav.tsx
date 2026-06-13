import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';
import { useMemo } from 'react';
import { useAccessCheck } from '@src/utility/accessCheck';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessCheck } = useAccessCheck();

    const hasItemAccess = (item: any): boolean => {
        const accessId = item.accessID;

        if (accessId === undefined || accessId === null) {
            return true;
        }

        if (Array.isArray(accessId)) {
            return accessId.some((id) =>
                accessCheck({
                    accessInfoId: id,
                    KindAccessInfo: 'readAccess',
                })
            );
        }

        return accessCheck({
            accessInfoId: accessId,
            KindAccessInfo: 'readAccess',
        });
    };

  const mobileMenuItems = useMemo(() => {
    return LAYOUT_SIDEBAR_DATA.map((item) => {
        const filteredChildren =
            item.children?.filter((child) => hasItemAccess(child)) || [];

        return {
            ...item,
            children: filteredChildren,
        };
    }).filter((item) => {
        const hasChildren = item.children.length > 0;
        const hasSelfAccess = hasItemAccess(item);

        return hasSelfAccess || hasChildren;
    });
}, [accessCheck]);

    const activeIndex = mobileMenuItems.findIndex(
        (item) =>
            location.pathname === item.link ||
            location.pathname === item.mobileLink ||
            item.children?.some((child) =>
                location.pathname.startsWith(child.link || '')
            )
    );

    const handleNavClick = (
        event: React.SyntheticEvent,
        newValue: number
    ) => {
        const selectedItem = mobileMenuItems[newValue];

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
                {mobileMenuItems.map((item) => {
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