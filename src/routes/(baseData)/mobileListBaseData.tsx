import { Box, Stack, Typography } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { useAccessCheck } from '@src/utility/accessCheck'
import { hasNavigationAccess } from '@components/mobile/utils/navigationAccess'
import { useTheme } from '@mui/system'

export const Route = createFileRoute('/(baseData)/mobileListBaseData')({
    component: withSnackbar(MobileListBaseData),
})

function MobileListBaseData() {
    const navigate = useNavigate()
    const { accessCheck } = useAccessCheck()
    const theme = useTheme()

    const group = LAYOUT_SIDEBAR_DATA.find((item) => item.mobileLink === '/mobileListBaseData')
    const subItems = group?.children?.filter((child) => hasNavigationAccess(child, accessCheck)) || []

    return (
        <Box sx={{ p: 2, pb: 10 }}>
            {subItems.map((child, index) => {
                const IconComponent = child.icon
                return (
                    <Box
                        key={index}
                        onClick={() => navigate({ to: child.link })}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: theme.palette.white[0], borderRadius: 3, p: 2, mb: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer',
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 50, height: 50, borderRadius: 2, backgroundColor: theme.palette.white[1],
                                    color: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                {IconComponent && <IconComponent fontSize="medium" />}
                            </Box>
                            <Stack spacing={0.5}>
                                <Typography variant="body1" fontWeight={700} color="text.primary">{child.name}</Typography>
                                <Typography variant="body2" color="text.secondary">مدیریت {child.name}</Typography>
                            </Stack>
                        </Stack>
                        <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
                    </Box>
                )
            })}
        </Box>
    )
}