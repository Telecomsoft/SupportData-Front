// src/components/mobile/MobileBottomNav.tsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useState } from 'react';

const navItems = [
    {
        label: 'تنظیمات سیستم',
        icon: <SettingsIcon />,
        value: 0,
    },
    {
        label: 'تنظیمات',
        icon: <TuneIcon />,
        value: 1,
    },
    {
        label: 'لیست خطاها',
        icon: <FormatListBulletedIcon />,
        value: 2,
    },
];

export default function MobileBottomNav() {
    const [value, setValue] = useState(2); // پیش‌فرض روی "لیست خطاها"

    return (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1300,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
            }} 
            elevation={6}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                sx={{
                    height: 72,
                    bgcolor: '#fff',
                    '& .MuiBottomNavigationAction-root': {
                        color: '#666',
                        transition: 'all 0.2s',
                        '&.Mui-selected': {
                            color: '#9c1c1c', // رنگ maroon اصلی پروژه شما
                            fontWeight: 'bold',
                        },
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.72rem',
                            marginTop: '4px',
                        },
                    },
                }}
            >
                {navItems.map((item) => (
                    <BottomNavigationAction
                        key={item.value}
                        label={item.label}
                        icon={item.icon}
                        sx={{
                            '&.Mui-selected svg': {
                                color: '#9c1c1c',
                            },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}