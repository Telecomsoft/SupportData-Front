import { Box, Stack, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { createFileRoute, useNavigate } from '@tanstack/react-router'; // یا react-router-dom
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data';
import { withSnackbar } from '@components/hoc/withSnackbar';
import { useAccessCheck } from '@src/utility/accessCheck';

export const Route = createFileRoute('/(settings)/mobileListSettings')({
    component: withSnackbar(mobileListSettings),
})

function mobileListSettings() {
    const navigate = useNavigate();
    const { accessCheck } = useAccessCheck();

    const hasItemAccess = (item: any): boolean => {
        const accessId = item.accessID;

        if (accessId === undefined || accessId === null) {
            return true;
        }

        if (Array.isArray(accessId)) {
            return accessId.some((id: number) =>
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

    const settingsData = LAYOUT_SIDEBAR_DATA.find(
        item => item.mobileLink === '/mobileListSettings'
    );

    const subItems =
        settingsData?.children?.filter((child) =>
            hasItemAccess(child)
        ) || [];


    return (
        <Box sx={{ p: 2, pb: 10 /* فاصله از پایین برای BottomNav */ }}>
            {subItems.map((child, index) => {
                const IconComponent = child.icon;

                return (
                    <Box
                        key={index}
                        onClick={() => navigate({ to: child.link })}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff',
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
                                    backgroundColor: '#fbe9e9', // رنگ پس‌زمینه آیکون (قرمز بسیار روشن)
                                    color: '#8b1935', // رنگ آیکون (قرمز تیره)
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
                        <KeyboardArrowLeftIcon sx={{ color: '#8b1935' }} />
                    </Box>
                );
            })}
        </Box>
    );
}
