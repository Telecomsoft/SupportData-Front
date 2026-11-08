/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { num } from '@components/section/statements/statementFormat'

type Props = {
    lines: any[]
    onOpenTask?: (taskID: number) => void     // set only when the user may open work tasks
}

/**
 * The lines of a statement: one per work task, made by "calculate" (a task can be in ONE statement only).
 * The columns are the old StatementDetail: the rate for the task type, transportation, other amounts, penalties.
 */
const StatementLinesTab = ({ lines, onOpenTask }: Props) => {
    const sum = (key: string) => lines.reduce((a, l) => a + Number(l[key] ?? 0), 0)

    if (lines.length === 0) {
        return <Typography variant="body2" color="text.secondary">هنوز ردیفی نیست. با «محاسبه» فعالیت های تمام‌شده‌ی پیمانکار در این بازه اضافه می‌شوند.</Typography>
    }

    return (
        <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>فعالیت</TableCell><TableCell>نوع</TableCell><TableCell>کیوسک</TableCell><TableCell>مراجعه</TableCell>
                        <TableCell>روز تاخیر</TableCell><TableCell>فاصله (km)</TableCell><TableCell>مبلغ کار</TableCell>
                        <TableCell>ایاب و ذهاب</TableCell><TableCell>سایر</TableCell><TableCell>جریمه</TableCell><TableCell>جمع ردیف</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lines.map((l) => (
                        <TableRow key={l.id}>
                            <TableCell>
                                {onOpenTask ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => onOpenTask(l.workTaskID)}>#{l.workTaskID}</Button> : `#${l.workTaskID}`}
                            </TableCell>
                            <TableCell>{l.typeName ?? '-'}</TableCell>
                            <TableCell dir="ltr" sx={{ textAlign: 'right' }}>{l.kioskSerial ?? '-'}</TableCell>
                            <TableCell>{num(l.numberOfVisits)}</TableCell>
                            <TableCell>{num(l.delayDays)}</TableCell>
                            <TableCell>{num(l.distanceKm)}</TableCell>
                            <TableCell>{num(l.taskAmount)}</TableCell>
                            <TableCell>{num(l.transportationAmount)}</TableCell>
                            <TableCell>{num(l.otherAmounts)}</TableCell>
                            <TableCell>{num(l.penalties)}</TableCell>
                            <TableCell><b>{num(l.lineTotal)}</b></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}><b>جمع ({lines.length} ردیف)</b></TableCell>
                        <TableCell><b>{num(sum('taskAmount'))}</b></TableCell>
                        <TableCell><b>{num(sum('transportationAmount'))}</b></TableCell>
                        <TableCell><b>{num(sum('otherAmounts'))}</b></TableCell>
                        <TableCell><b>{num(sum('penalties'))}</b></TableCell>
                        <TableCell><b>{num(sum('lineTotal'))}</b></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </Box>
    )
}

export default StatementLinesTab
