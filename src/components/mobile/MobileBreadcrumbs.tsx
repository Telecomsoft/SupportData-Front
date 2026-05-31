// src/components/mobile/MobileBreadcrumbs.tsx
import { Box, Typography } from '@mui/material';
import { convertToPersianNumber } from '@utility/convertToPersianNumber';
import Cookies from 'js-cookie';

export default function MobileBreadcrumbs() {
    const userName = Cookies.get('userName') || 'کاربر';

    return (
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="body1" fontWeight="medium">
                به میز کار خودت خوش اومدی {userName} عزیز
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
                امروز: {new Date().toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })} 
                {' / '}
                نسخه: {process.env.PACKAGE_VERSION ? convertToPersianNumber(process.env.PACKAGE_VERSION) : '1.0.0'}
            </Typography>
        </Box>
    );
}