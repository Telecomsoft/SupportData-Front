
import React, { forwardRef } from 'react';
import {
    Dialog,
    Slide,
    Box,
    Typography,
    Card,
    CardActionArea,
    IconButton
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useNavigate } from '@tanstack/react-router';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
// انیمیشن باز شدن دیالوگ از پایین به بالا
const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// تایپ‌ها
export type SubMenuItem = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    route: string; // مسیر TanStack Router
};

interface MobileSubMenuDialogProps {
    open: boolean;
    onClose: () => void;
    pageTitle: string; // مثلا "تنظیمات"
    items: SubMenuItem[];
}

export default function MobileSubMenuDialog({ open, onClose, items }: MobileSubMenuDialogProps) {
    const navigate = useNavigate();

    const handleNavigation = (route: string) => {
        onClose(); // بستن دیالوگ قبل از تغییر مسیر
        navigate({ to: route });
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    backgroundColor: '#fafafa', // رنگ پس‌زمینه روشن طبق تصویر
                }
            }}
        >

            <IconButton sx={{ display: 'flex', justifyContent: 'flex-end', color: '#666', p: 0.5, }}>
                <HighlightOffOutlinedIcon sx={{
                    color: '#CCCCCC',
                    width: 30,
                    height: 30,
                    cursor: 'pointer',
                    transition: '0.2s ease-in-out',
                    '&:hover': {
                        color: '#000',
                    },
                }}
                    onClick={onClose} />
            </IconButton>


            <Box sx={{ p: 2 }}>

                {/* لیست آیتم‌ها (کارت‌ها) */}
                {items?.map((item, index) => (
                    <Card
                        key={index}
                        sx={{
                            mb: 2,
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleNavigation(item.route)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* آیکون فلش سمت چپ */}
                            <Box sx={{
                                bgcolor: '#fce4e4',
                                p: 1.5,
                                borderRadius: '10px',
                                display: 'flex'
                            }}>
                                {item.icon}
                            </Box>
                            {/* متن‌ها */}
                            <Box sx={{ flexGrow: 1, pl: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#777', mt: 0.5 }}>
                                    {item.subtitle}
                                </Typography>
                            </Box>
                            <ArrowBackIosNewIcon sx={{ color: '#7b001c', fontSize: '1.2rem' }} />

                            {/* آیکون اصلی سمت راست */}

                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Dialog>
    );
}
