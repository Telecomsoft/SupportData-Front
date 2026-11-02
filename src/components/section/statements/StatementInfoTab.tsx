/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Box, Divider, Typography } from '@mui/material'
import { dateFn } from '@utility/dateConverter'
import { day, rial } from '@components/section/statements/statementFormat'

const text = (v?: string | number | null) => (v === null || v === undefined || v === '' ? '-' : String(v))
const when = (d?: string | null) => (d ? dateFn(d) : '-')

/**
 * The statement's details and how its total is made up, read-only.
 * Total = sum of the lines + other costs - other penalties (the server adds it up; it is never typed).
 */
const StatementInfoTab = ({ statement }: { statement: any }) => {
    const lineSum = (statement.lines ?? []).reduce((a: number, l: any) => a + Number(l.lineTotal ?? 0), 0)

    const cell = (label: string, value: string) => (
        <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography>
        </Grid>
    )
    const section = (title: string, children: React.ReactNode) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
            <Divider sx={{ mb: 1 }} />
            {children}
        </Box>
    )

    return (
        <Box>
            {section('مشخصات', (
                <Grid container spacing={1}>
                    {cell('شماره', text(statement.id))}
                    {cell('عنوان', text(statement.caption))}
                    {cell('وضعیت', text(statement.stateName))}
                    {cell('پیمانکار', text(statement.contractorName))}
                    {cell('از تاریخ', day(statement.fromDate))}
                    {cell('تا تاریخ', day(statement.toDate))}
                    {cell('فقط فرم سرویس دریافت‌شده', statement.onlyFormReceived ? 'بله' : 'خیر')}
                    {cell('تعداد ردیف', text(statement.lineCount))}
                    {cell('زمان محاسبه', when(statement.calculatedAt))}
                </Grid>
            ))}

            {section('مبلغ‌ها', (
                <Grid container spacing={1}>
                    {cell('جمع ردیف‌ها', rial(lineSum))}
                    {cell('هزینه‌های اضافی', `${rial(statement.otherCosts)}${statement.otherCostsDescription ? ` — ${statement.otherCostsDescription}` : ''}`)}
                    {cell('جریمه‌های اضافی', `${rial(statement.otherPenalties)}${statement.otherPenaltiesDescription ? ` — ${statement.otherPenaltiesDescription}` : ''}`)}
                    <Grid size={12}><Typography variant="subtitle1" fontWeight={700}>جمع کل: {rial(statement.total)}</Typography></Grid>
                </Grid>
            ))}

            {section('ثبت', (
                <Grid container spacing={1}>
                    {cell('زمان ثبت', when(statement.createdAt))}
                    {cell('آخرین تغییر', when(statement.updatedAt))}
                </Grid>
            ))}

            {section('توضیحات', <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text(statement.description)}</Typography>)}
        </Box>
    )
}

export default StatementInfoTab
