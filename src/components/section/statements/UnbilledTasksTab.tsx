/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Alert, Box, Button, Chip, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useGetData } from '@hooks/useGetData'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { dateFn } from '@utility/dateConverter'

type Props = {
    contractorID: number
    fromDate: string
    toDate: string
    refreshKey: number
    onOpenTask?: (taskID: number) => void     // set only when the user may open work tasks
}

/**
 * Finished tasks of this statement's contractor that are in NO statement (GET api/Statement/UnbilledTasks):
 * the ones "calculate" left out (e.g. the service form has not arrived) or that finished after the period.
 * By default only the statement's own period; the switch asks for all of them.
 */
const UnbilledTasksTab = ({ contractorID, fromDate, toDate, refreshKey, onOpenTask }: Props) => {
    const [thisPeriod, setThisPeriod] = useState(true)

    // the server wants plain dates; a statement's dates are days (midnight), so the first 10 characters are the day
    const url = `api/Statement/UnbilledTasks?contractorID=${contractorID}${thisPeriod ? `&from=${fromDate.slice(0, 10)}&to=${toDate.slice(0, 10)}` : ''}`
    // refreshKey is part of the query key: after an action on the page the list is read again
    const tasks = useGetData<any[]>(url, 'st-unbilled', { ids: [url, String(refreshKey)] })

    return (
        <Box>
            <FormControlLabel
                control={<Switch checked={thisPeriod} onChange={(e) => setThisPeriod(e.target.checked)} />}
                label="فقط بازه‌ی این صورت‌حساب"
            />
            {tasks.isLoading ? <CustomCircularProgress thickness={2} size={40} />
                : tasks.data?.error !== 0 ? <Alert severity="warning">{tasks.data?.errorMessage ?? 'دریافت دستورکارها انجام نشد'}</Alert>
                : (tasks.data?.value ?? []).length === 0 ? <Typography variant="body2" color="text.secondary">دستورکار تسویه‌نشده‌ای نیست.</Typography>
                : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>دستورکار</TableCell><TableCell>نوع</TableCell><TableCell>وضعیت</TableCell><TableCell>کیوسک</TableCell>
                                    <TableCell>زمان اتمام</TableCell><TableCell>فرم سرویس</TableCell><TableCell>روز تاخیر</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(tasks.data?.value ?? []).map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell>{onOpenTask ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => onOpenTask(t.id)}>#{t.id}</Button> : `#${t.id}`}</TableCell>
                                        <TableCell>{t.typeName ?? '-'}</TableCell>
                                        <TableCell>{t.stateName ?? '-'}</TableCell>
                                        <TableCell dir="ltr" sx={{ textAlign: 'right' }}>{t.kioskSerial ?? '-'}</TableCell>
                                        <TableCell>{t.finishedAt ? dateFn(t.finishedAt) : '-'}</TableCell>
                                        <TableCell>{t.serviceFormReceived ? <Chip size="small" color="success" label="دریافت شده" /> : <Chip size="small" label="نشده" />}</TableCell>
                                        <TableCell>{t.delayDays ?? 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
        </Box>
    )
}

export default UnbilledTasksTab
