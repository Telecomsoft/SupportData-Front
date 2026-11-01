import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import RepairStateChip from '@components/section/repairs/RepairStateChip'
import { dateFn } from '@utility/dateConverter'

/** One repair in the mobile list. Tap = open the repair. */
const RepairMobileCard = ({ repair, onOpen }: { repair: any; onOpen: () => void }) => {
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
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body1" fontWeight={700}>#{repair.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{repair.deviceModelName}</Typography>
                </Stack>
                <Typography variant="body2" dir="ltr" textAlign="right">{repair.serial ?? '-'}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {[repair.customerName, repair.kioskSerial, repair.assignedToName].filter(Boolean).join(' - ')}
                </Typography>
                <Typography variant="caption" color="text.secondary">دریافت: {dateFn(repair.receivedAt)}</Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap"><RepairStateChip repair={repair} /></Stack>
            </Stack>
            <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
}

export default RepairMobileCard
