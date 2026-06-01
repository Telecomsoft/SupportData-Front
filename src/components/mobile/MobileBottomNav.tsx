// src/components/mobile/MobileBottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import ComputerIcon from '@mui/icons-material/Computer';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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

    const currentIndex = LAYOUT_SIDEBAR_DATA.findIndex(
        item =>
            location.pathname === item.value
    )




    const settingsSubMenus: SubMenuItem[] = [
        {
            title: 'لیست قطعات مرتبط',
            subtitle: 'مشاهده و مدیریت لیست قطعات مرتبط',
            icon: <MemoryIcon sx={{ color: '#7b001c' }} />,
            route: '/devicesList' // مسیر دلخواه
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
            route: '/banksList' // مسیری که در پیام قبل ساختیم
        }
    ];
    const [openSubMenu, setOpenSubMenu] = useState(false);


    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
            }}
        >
            <BottomNavigation
                value={currentIndex !== -1 ? currentIndex : 0}
                onChange={(_, index) => {
                    const selectedItem = LAYOUT_SIDEBAR_DATA[index];

                    // بررسی اینکه آیا این آیتم زیرمنو دارد یا نه
                    if (selectedItem.children && selectedItem.children.length > 0) {
                        // اگر زیرمنو دارد، فقط دیالوگ را باز کن و تغییر مسیر نده
                        setOpenSubMenu(true);
                    } else if (selectedItem.link) {
                        // اگر زیرمنو ندارد، مثل قبل مسیریابی کن
                        navigate({
                            to: selectedItem.link,
                        });
                    }
                }}
            >
                {LAYOUT_SIDEBAR_DATA?.map((item) => {
                    const Icon = item.icon; // حرف اول باید بزرگ باشد تا در JSX استفاده شود
                    return (
                        <BottomNavigationAction
                            key={item.value} // استفاده از value به جای link چون link ممکن است undefined باشد
                            label={item.name}
                            icon={<Icon />} // رندر کردن کامپوننت
                        />
                    );
                })}
            </BottomNavigation>

            <MobileSubMenuDialog
                open={openSubMenu}
                onClose={() => setOpenSubMenu(false)}
                pageTitle="تنظیمات"
                items={settingsSubMenus}
            />

        </Paper>
    )
}