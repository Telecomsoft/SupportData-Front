import { Box, Chip, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import WorkTaskStateChip from '@components/section/workTasks/WorkTaskStateChip'
import { dateFn } from '@utility/dateConverter'

/** One task in the mobile list. Tap = open the task. */
const WorkTaskMobileCard = ({ task, onOpen }: { task: any; onOpen: () => void }) => {
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
                    <Typography variant="body1" fontWeight={700}>#{task.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.typeName}</Typography>
                </Stack>
                <Typography variant="body2" dir="ltr" textAlign="right">{task.kioskSerial ?? '-'}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {[task.customerName, task.assignedToName].filter(Boolean).join(' - ')}
                </Typography>
                <Typography variant="caption" color="text.secondary">گزارش: {dateFn(task.reportedAt)}</Typography>
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                    <WorkTaskStateChip task={task} />
                    {task.isOverdue && <Chip size="small" color="error" label="دیرکرد" />}
                </Stack>
            </Stack>
            <KeyboardArrowLeftIcon sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
}

export default WorkTaskMobileCard
