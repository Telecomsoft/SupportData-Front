// src/components/mobile/MobileBottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import ComputerIcon from '@mui/icons-material/Computer';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
    useLocation,
    useNavigate,
} from '@tanstack/react-router'
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';
import MobileSubMenuDialog, { SubMenuItem } from './general/dialog/MobileSubMenuDialog';
import { useState } from 'react';

export default function MobileBottomNav() {
    const location = useLocation()
    const navigate = useNavigate()

    // محاسبه ایندکس فعال بر اساس مسیر فعلی
    const currentIndex = LAYOUT_SIDEBAR_DATA.findIndex(
        item =>
            location.pathname === item.link ||
            (item.children && item.children.some(child => location.pathname === child.link))
    );

    // دیتای تستی برای زیرمنو
    const settingsSubMenus: SubMenuItem[] = [
        {
            title: 'لیست قطعات مرتبط',
            subtitle: 'مشاهده و مدیریت لیست قطعات مرتبط',
            icon: <MemoryIcon sx={{ color: '#7b001c' }} />,
            route: '/devicesList'
        },
        {
            title: 'لیست مدل قطعات مرتبط',
            subtitle: 'مشاهده و مدیریت مدل‌های قطعات مرتبط',
            icon: <ComputerIcon sx={{ color: '#7b001c' }} />,
            route: '/deviceModelsList'
        },
        {
            title: 'لیست بانک های مرتبط',
            subtitle: 'مشاهده و مدیریت بانک‌های مرتبط',
            icon: <AccountBalanceIcon sx={{ color: '#7b001c' }} />,
            route: '/banksList'
        }
    ];

    // استیت برای باز و بسته کردن دیالوگ
    const [openSubMenu, setOpenSubMenu] = useState(false);

    // هندلر مدیریت کلیک روی تب‌های نویگیشن پایین
    const handleNavClick = (event: React.SyntheticEvent, newValue: number) => {
        // ۱. ابتدا دیالوگ را می‌بندیم (اگر باز باشد)
        setOpenSubMenu(false);

        // ۲. پیدا کردن دیتای آیتمی که کلیک شده
        const selectedItem = LAYOUT_SIDEBAR_DATA[newValue];

        // ۳. اگر آیتم دارای فرزند (Sub-menu) بود
        if (selectedItem.children && selectedItem.children.length > 0) {
            // نکته: اگر می‌خواهید دیتای دیالوگ داینامیک باشد باید یک استیت دیگر هم برای آن بسازید
            // اما فعلا چون لیست ثابت دادید، فقط دیالوگ را باز می‌کنیم

            // تاخیر برای جلوگیری از تداخل انیمیشن در صورت جابجایی بین دو تبی که هر دو دیالوگ دارند
            setTimeout(() => {
                setOpenSubMenu(true);
            }, 150);
        } else {
            // ۴. اگر آیتم فرزند نداشت، فقط به مسیر آن هدایت می‌کنیم
            if (selectedItem.link) {
                navigate({ to: selectedItem.link });
            }
        }
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 600,
            }}
        >
            <BottomNavigation
                value={currentIndex !== -1 ? currentIndex : 0}
                onChange={handleNavClick} // استفاده از هندلری که تعریف کردیم
            >
                {LAYOUT_SIDEBAR_DATA?.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <BottomNavigationAction
                            key={item.value || index}
                            label={item.name}
                            icon={<Icon />}
                        />
                    );
                })}
            </BottomNavigation>

            <MobileSubMenuDialog
                open={openSubMenu}
                onClose={() => setOpenSubMenu(false)}
                pageTitle="تنظیمات" // این مقادیر می‌توانند بر اساس تب انتخاب شده داینامیک شوند
                items={settingsSubMenus}
            />
        </Paper>
    );
}
