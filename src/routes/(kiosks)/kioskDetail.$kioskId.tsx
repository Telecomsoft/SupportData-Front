/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import DevicesIcon from '@mui/icons-material/Devices'
import BusinessIcon from '@mui/icons-material/Business'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import WarrantyChip from '@components/section/kiosks/WarrantyChip'
import KioskInfoTab from '@components/section/kiosks/KioskInfoTab'
import KioskPartsTab from '@components/section/kiosks/KioskPartsTab'
import KioskPasswordsTab from '@components/section/kiosks/KioskPasswordsTab'
import { buildKioskForm } from '@src/data/dialogArrays/kioskForm'
import { useKioskLookups } from '@hooks/useKioskLookups'
import { useGetData } from '@hooks/useGetData'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'

export const Route = createFileRoute('/(kiosks)/kioskDetail/$kioskId')({
    component: withSnackbar(KioskDetail),
    staticData: { breadcrumb: 'مشخصات کیوسک' },
})

function KioskDetail({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { kioskId } = Route.useParams()
    const id = Number(kioskId)
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { accessCheck, canPerform } = useAccessCheck()
    const lookups = useKioskLookups()

    const kiosk = useGetData<any>(`api/Kiosk/GetKiosk/${id}`, 'kiosk-detail', { ids: [String(id)] })
    const [tab, setTab] = useState<'info' | 'parts' | 'passwords'>('info')
    const [editing, setEditing] = useState(false)

    const hasWriteAccess = accessCheck({ accessInfoId: 110, KindAccessInfo: 'writeAccess' })
    const canSeePasswords = canPerform(220)            // دسترسی مشاهده رمزها
    const k = kiosk.data?.value
    const form = buildKioskForm(isMobile)

    if (kiosk.isLoading || lookups.isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CustomCircularProgress thickness={2} size={60} />
            </Box>
        )
    }
    if (!k) {
        return (
            <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">{kiosk.data?.errorMessage ?? 'کیوسک پیدا نشد'}</Typography>
            </Paper>
        )
    }

    const supporters = (k.supporterIDs ?? [])
        .map((sid: number) => lookups.options.supporterIDs.find((o) => o.id === sid)?.name)
        .filter(Boolean) as string[]

    return (
        <Box 
            sx={{ 
                width: '100%', 
                height: { xs: 'auto', md: 'calc(100vh - 120px)' }, // فیکس کردن ارتفاع صفحه در دسکتاپ
                display: 'flex',
                flexDirection: 'column',
                pb: isMobile ? 12 : 2, 
                px: { xs: 2, md: 3 }, 
                pt: 2,
                overflow: 'hidden' 
            }}
        >
            {/* هدر اصلی صفحه (ثابت و بدون اسکرول) */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 2.5, 
                    mb: 2, 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                    flexShrink: 0
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
                    <Stack direction="row" alignItems="center" gap={2}>
                        <IconButton 
                            onClick={() => navigate({ to: '/kiosksList' })}
                            sx={{ 
                                bgcolor: 'action.hover', 
                                '&:hover': { bgcolor: 'action.selected' },
                                borderRadius: 2
                            }}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" mb={0.5}>
                                <Typography variant="h6" fontWeight="bold" dir="ltr" textAlign="right" color="text.primary">
                                    {k.serial}
                                </Typography>
                                {!k.isActive && (
                                    <Chip 
                                        label="غیرفعال" 
                                        size="small" 
                                        color="error" 
                                        variant="outlined" 
                                        sx={{ fontWeight: 500 }} 
                                    />
                                )}
                            </Stack>

                            {/* جزئیات و مشخصات همراه با آیکون */}
                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                gap={2} 
                                flexWrap="wrap" 
                                sx={{ color: 'text.secondary', typography: 'body2', mt: 0.5 }}
                            >
                                {k.kioskModelName && (
                                    <Stack direction="row" alignItems="center" gap={0.5}>
                                        <DevicesIcon fontSize="small" color="action" />
                                        <span>{k.kioskModelName}</span>
                                    </Stack>
                                )}
                                {k.customerName && (
                                    <>
                                        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>
                                        <Stack direction="row" alignItems="center" gap={0.5}>
                                            <BusinessIcon fontSize="small" color="action" />
                                            <span>{k.customerName}</span>
                                        </Stack>
                                    </>
                                )}
                                {k.cityName && (
                                    <>
                                        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>
                                        <Stack direction="row" alignItems="center" gap={0.5}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            <span>{k.cityName}</span>
                                        </Stack>
                                    </>
                                )}
                                {k.branchName && (
                                    <>
                                        <Box component="span" sx={{ opacity: 0.4 }}>•</Box>
                                        <Stack direction="row" alignItems="center" gap={0.5}>
                                            <StorefrontIcon fontSize="small" color="action" />
                                            <span>{k.branchName}</span>
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
                        <WarrantyChip kiosk={k} size="medium" />
                        {hasWriteAccess && (
                            <Button 
                                startIcon={<EditIcon />} 
                                variant="contained" 
                                color="primary"
                                onClick={() => setEditing(true)}
                                sx={{ 
                                    borderRadius: 2, 
                                    textTransform: 'none', 
                                    px: 2.5,
                                    boxShadow: 'none',
                                    '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }
                                }}
                            >
                                ویرایش اطلاعات
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* تب‌های ناوبری (ثابت زیر هدر) */}
            <Paper 
                elevation={0}
                sx={{ 
                    mb: 2, 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    flexShrink: 0
                }}
            >
                <Tabs 
                    value={tab} 
                    onChange={(_, v) => setTab(v)} 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                        px: 2,
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderTopLeftRadius: 3,
                            borderTopRightRadius: 3,
                            backgroundColor: 'primary.main',
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minHeight: 46,
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main',
                            }
                        }
                    }}
                >
                    <Tab value="info" label="مشخصات کلی" />
                    <Tab value="parts" label="قطعات کیوسک" />
                    {canSeePasswords && <Tab value="passwords" label="رمزهای عبور" />}
                </Tabs>
            </Paper>

            {/* محتوای تب‌ها: دارای پس‌زمینه (Paper) و اسکرول داخلی اختصاصی */}
            <Paper 
                elevation={0}
                sx={{ 
                    flexGrow: 1,
                    overflowY: 'auto', // فقط همین بخش اسکرول می‌خورد
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    p: 3,
                    mb: 2,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.02)',
                    // شخصی‌سازی اسکرول‌بار برای زیبایی بیشتر
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        borderRadius: '4px',
                    }
                }}
            >
                {tab === 'info' && <KioskInfoTab kiosk={k} technicianNames={supporters} />}
                {tab === 'parts' && <KioskPartsTab kioskID={id} canWrite={hasWriteAccess} snackbarOpen={snackbarOpen} />}
                {tab === 'passwords' && canSeePasswords && <KioskPasswordsTab kioskID={id} canWrite={hasWriteAccess} snackbarOpen={snackbarOpen} />}
            </Paper>

            {/* دیالوگ ویرایش */}
            {editing && (
                <GeneralDialog
                    open="edit"
                    title="ویرایش کیوسک"
                    width={sizeConverter(820, 'width')}
                    close={() => setEditing(false)}
                    array={form}
                    editEndpoint="api/Kiosk/UpdateKiosk"
                    autoCompleteOption={lookups.options}
                    defaultValue={{ ...k }}
                    sendFinalData
                    apiValueGetter={((data: any) => buildPayload(form, data, { ...k })) as any}
                    wrapperFunc={() => kiosk.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}
        </Box>
    )
}