/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Box, Chip, Divider, Typography } from '@mui/material'
import { dateFn } from '@utility/dateConverter'

const rial = (v?: number | null) => `${Number(v ?? 0).toLocaleString('fa-IR')} ریال`

/** Costs of the task: what we pay (staff only; the server zeroes them for customers anyway) and what we bill. */
const WorkTaskCostsTab = ({ task }: { task: any }) => {
    const ours = [
        ['بلیت', task.costTicket], ['ایاب و ذهاب', task.costTransportation], ['اقامت', task.costStay], ['سایر', task.costOther],
    ] as [string, number][]
    const customer = [
        ['هزینه‌ی کارشناسی', task.customerInspectionCost], ['هزینه‌ی ایاب و ذهاب', task.customerTransportationCost],
        ['هزینه‌ی قطعه', task.customerPartCost], ['سایر', task.customerOtherCost],
    ] as [string, number][]
    const sum = (rows: [string, number][]) => rows.reduce((a, [, v]) => a + Number(v ?? 0), 0)

    const group = (title: string, rows: [string, number][]) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={1}>
                {rows.map(([label, value]) => (
                    <Grid key={label} size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                        <Typography variant="body2">{rial(value)}</Typography>
                    </Grid>
                ))}
                <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="body2" fontWeight={700}>جمع: {rial(sum(rows))}</Typography>
                </Grid>
            </Grid>
        </Box>
    )

    return (
        <Box>
            {group('هزینه‌های ما', ours)}
            {group('مبالغ مشتری', customer)}

            <Box>
                <Typography variant="subtitle2" fontWeight={700}>دریافت و پرداخت</Typography>
                <Divider sx={{ mb: 1 }} />
                <Grid container spacing={1}>
                    <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">مبلغ دریافتی</Typography><Typography variant="body2">{rial(task.receivedAmount)}</Typography></Grid>
                    <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">شماره فاکتور</Typography><Typography variant="body2" dir="ltr" textAlign="right">{task.invoiceNo ?? '-'}</Typography></Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">وضعیت پرداخت</Typography>
                        <Box>{task.isPaid ? <Chip size="small" color="success" label="پرداخت شده" /> : <Chip size="small" label="پرداخت نشده" />}</Box>
                    </Grid>
                    {task.isPaid && (
                        <>
                            <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">مبلغ پرداخت‌شده</Typography><Typography variant="body2">{rial(task.paidAmount)}</Typography></Grid>
                            <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">مرجع پرداخت</Typography><Typography variant="body2" dir="ltr" textAlign="right">{task.paymentRef ?? '-'}</Typography></Grid>
                            <Grid size={{ xs: 6, md: 3 }}><Typography variant="caption" color="text.secondary">تاریخ پرداخت</Typography><Typography variant="body2">{task.paidAt ? dateFn(task.paidAt) : '-'}</Typography></Grid>
                        </>
                    )}
                </Grid>
            </Box>
        </Box>
    )
}

export default WorkTaskCostsTab
