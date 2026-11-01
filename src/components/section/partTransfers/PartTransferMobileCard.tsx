import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import PartTransferStateChip from '@components/section/partTransfers/PartTransferStateChip'
import { dateFn } from '@utility/dateConverter'

/** One movement in the mobile list. Tap = open the movement. */
const PartTransferMobileCard = ({ transfer, route, onOpen }: { transfer: any; route: string; onOpen: () => void }) => {
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
                    <Typography variant="body1" fontWeight={700}>#{transfer.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{transfer.kindName}</Typography>
                </Stack>
                <Typography variant="body2">{transfer.deviceModelName} × {transfer.quantity}</Typography>
                <Typography variant="body2" color="text.secondary">{[route, transfer.technicianName].filter(Boolean).join(' - ')}</Typography>
                <Typography variant="caption" color="text.secondary">ثبت: {dateFn(transfer.createdAt)}</Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap"><PartTransferStateChip transfer={transfer} /></Stack>
            </Stack>
            <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
}

export default PartTransferMobileCard
