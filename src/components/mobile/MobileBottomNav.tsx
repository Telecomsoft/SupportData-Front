// src/components/mobile/MobileBottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data'; // اطمینان حاصل کنید که LAYOUT_SIDEBAR_DATA از اینجا ایمپورت شده
import MobileSubMenuDialog, { SubMenuItem } from './general/dialog/MobileSubMenuDialog';
import { useState } from 'react';

export default function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    // استیت‌ها برای مدیریت دیالوگ زیرمنو
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [subMenuItems, setSubMenuItems] = useState<SubMenuItem[]>([]);
    const [dialogTitle, setDialogTitle] = useState('');

    // پیدا کردن ایندکس تب فعال بر اساس مسیر فعلی
    const activeIndex = LAYOUT_SIDEBAR_DATA.findIndex(item =>
        location.pathname === item.link || (item.children && item.children.some(child => location.pathname.startsWith(child.link)))
    );

    // هندلر کلیک روی آیتم‌های نوار ناوبری
    const handleNavClick = (event: React.SyntheticEvent, newValue: number) => {
        // ۱. دیالوگ قبلی را می‌بندیم
        setIsSubMenuOpen(false);

        // ۲. آیتم کلیک شده را از دیتا پیدا می‌کنیم
        const selectedItem = LAYOUT_SIDEBAR_DATA[newValue];

        // ۳. اگر آیتم دارای فرزند (زیرمنو) بود
        if (selectedItem.children && selectedItem.children.length > 0) {
            // عنوان دیالوگ را از نام آیتم اصلی می‌گیریم
            setDialogTitle(selectedItem.name);

            // زیرمنوها را بر اساس فرزندان آیتم کلیک شده می‌سازیم
            const newSubMenuItems = selectedItem.children.map(child => {
                const ChildIcon = child.icon;
                return {
                    title: child.name,
                    subtitle: `مدیریت ${child.name}`, // می‌توانید متن مناسب‌تری انتخاب کنید
                    icon: <ChildIcon sx={{ color: '#7b001c' }} />,
                    route: child.link || '/',
                };
            });
            setSubMenuItems(newSubMenuItems);

            // با یک تاخیر کوتاه دیالوگ را باز می‌کنیم تا انیمیشن‌ها تداخل نکنند
            setTimeout(() => {
                setIsSubMenuOpen(true);
            }, 150);

        } else if (selectedItem.link) {
            // ۴. اگر آیتم فرزند نداشت، به مسیر آن هدایت می‌کنیم
            navigate({ to: selectedItem.link });
        }
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 6000 }}>
            <BottomNavigation
                value={activeIndex !== -1 ? activeIndex : false} // در صورت عدم تطابق، هیچ تبی فعال نباشد
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

            <MobileSubMenuDialog
                open={isSubMenuOpen}
                onClose={() => setIsSubMenuOpen(false)}
                pageTitle={dialogTitle}
                items={subMenuItems}
            />
        </Paper>
    );
}
