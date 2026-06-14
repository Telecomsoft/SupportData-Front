import { withSnackbar } from '@components/hoc/withSnackbar';
import { Box, Stack, Typography } from '@mui/material';
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useAccessCheck } from '@src/utility/accessCheck';
import { useMemo } from 'react';
import { filterNavigationByAccess } from '@components/mobile/utils/navigationAccess';
import { useTheme } from '@mui/system';

export const Route = createFileRoute(
    '/(systemManagement)/mobileListSystemManagement',
)({
    component: withSnackbar(mobileListSettings),
})

function mobileListSettings() {
    const navigate = useNavigate();
    const { accessCheck } = useAccessCheck();
    const theme = useTheme()

    const menuItems = useMemo(
        () =>
            filterNavigationByAccess(
                LAYOUT_SIDEBAR_DATA,
                accessCheck
            ),
        [accessCheck]
    );

    const settingsData = menuItems.find(
        item =>
            item.mobileLink ===
            '/mobileListSystemManagement'
    );

    const subItems = settingsData?.children || [];


    return (
        <Box sx={{ p: 2, pb: 10 /* فاصله از پایین برای BottomNav */ }}>
            {subItems?.map((child, index) => {
                const IconComponent = child.icon;

                return (
                    <Box
                        key={index}
                        onClick={() => navigate({ to: child.link })}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: theme.palette.white[0],
                            borderRadius: 3,
                            p: 2,
                            mb: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', // سایه ملایم مشابه عکس
                            cursor: 'pointer',
                        }}
                    >
                        {/* بخش راست: آیکون و متون */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            {/* کادر آیکون با پس‌زمینه قرمز روشن */}
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.white[1], // رنگ پس‌زمینه آیکون (قرمز بسیار روشن)
                                    color: theme.palette.primary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {IconComponent && <IconComponent fontSize="medium" />}
                            </Box>

                            {/* عنوان و زیرعنوان */}
                            <Stack spacing={0.5}>
                                <Typography variant="body1" fontWeight={700} color="text.primary">
                                    {child.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    مدیریت {child.name}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* بخش چپ: فلش */}
                        <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main, }} />
                    </Box>
                );
            })}
        </Box>
    );
}