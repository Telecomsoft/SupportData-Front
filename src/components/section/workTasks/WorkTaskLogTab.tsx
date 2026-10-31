/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { useGetData } from '@hooks/useGetData'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { dateFn } from '@utility/dateConverter'
import { nameOf, TASK_LOG_KINDS, TASK_STATES } from '@src/data/type/lookups'

/**
 * The history of a task: every state change, reassignment, date correction and edit of a closed task.
 * The server only ever adds rows here, so this is an audit trail: nothing in it can be edited.
 */
const WorkTaskLogTab = ({ taskID, refreshKey }: { taskID: number; refreshKey: number }) => {
    // refreshKey is part of the query key: after an action on the page the log is read again
    const logs = useGetData<any[]>(`api/WorkTask/ListWorkTaskLogs/${taskID}`, 'worktask-logs', { ids: [String(taskID), String(refreshKey)] })

    if (logs.isLoading) return <CustomCircularProgress thickness={2} size={40} />

    const change = (l: any) => {
        if (l.kind === 1) return `${nameOf(TASK_STATES, l.oldState) || '-'}  ←  ${nameOf(TASK_STATES, l.newState)}`
        return `${l.oldValue ?? '-'}  ←  ${l.newValue ?? '-'}`
    }

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>زمان ثبت</TableCell><TableCell>زمان وقوع</TableCell><TableCell>نوع</TableCell>
                        <TableCell>تغییر</TableCell><TableCell>کاربر</TableCell><TableCell>توضیح</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(logs.data?.value ?? []).map((l) => (
                        <TableRow key={l.id}>
                            <TableCell>{dateFn(l.changedAt)}</TableCell>
                            <TableCell>{l.effectiveAt ? dateFn(l.effectiveAt) : '-'}</TableCell>
                            <TableCell><Chip size="small" label={nameOf(TASK_LOG_KINDS, l.kind)} /></TableCell>
                            <TableCell>
                                <Tooltip title={<span style={{ whiteSpace: 'pre-wrap' }}>{change(l)}</span>}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 360 }}>{change(l)}</Typography>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{l.userName ?? '-'}</TableCell>
                            <TableCell>{l.note ?? '-'}</TableCell>
                        </TableRow>
                    ))}
                    {(logs.data?.value ?? []).length === 0 && <TableRow><TableCell colSpan={6} align="center">سابقه‌ای ثبت نشده است</TableCell></TableRow>}
                </TableBody>
            </Table>
        </Box>
    )
}

export default WorkTaskLogTab
