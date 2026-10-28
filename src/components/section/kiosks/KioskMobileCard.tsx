import { Box, Chip, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import WarrantyChip from '@components/section/kiosks/WarrantyChip'

/** One kiosk in the mobile list. Tap = open the kiosk. */
const KioskMobileCard = ({ kiosk, onOpen }: { kiosk: any; onOpen: () => void }) => {
    const theme = useTheme()
    return (
        <Box
            onClick={onOpen}
            sx={{
                backgroundColor: theme.palette.white[0], borderRadius: 3, p: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
        >
            <Stack spacing={0.75}>
                <Typography variant="body1" fontWeight={700} dir="ltr" textAlign="right">{kiosk.serial}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {[kiosk.kioskModelName, kiosk.customerName].filter(Boolean).join(' - ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {[kiosk.cityName, kiosk.branchName].filter(Boolean).join(' - ')}
                </Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                    <WarrantyChip kiosk={kiosk} />
                    {!kiosk.isActive && <Chip size="small" label="غیرفعال" />}
                </Stack>
            </Stack>
            <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
}

export default KioskMobileCard