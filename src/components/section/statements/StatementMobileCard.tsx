import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import StatementStateChip from '@components/section/statements/StatementStateChip'
import { day, rial } from '@components/section/statements/statementFormat'

/** One statement in the mobile list. Tap = open the statement. */
const StatementMobileCard = ({ statement, onOpen }: { statement: any; onOpen: () => void }) => {
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
                    <Typography variant="body1" fontWeight={700}>#{statement.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{statement.caption ?? ''}</Typography>
                </Stack>
                <Typography variant="body2">{statement.contractorName ?? '-'}</Typography>
                <Typography variant="caption" color="text.secondary">{day(statement.fromDate)} تا {day(statement.toDate)} — {statement.lineCount} ردیف</Typography>
                <Typography variant="body2" fontWeight={600}>{rial(statement.total)}</Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap"><StatementStateChip statement={statement} /></Stack>
            </Stack>
            <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
}

export default StatementMobileCard
