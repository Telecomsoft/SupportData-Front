/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Box, Button, Divider, Typography } from '@mui/material'
import { dateFn } from '@utility/dateConverter'

const date = (d?: string | null) => (d ? dateFn(d) : '-')
const text = (v?: string | number | null) => (v === null || v === undefined || v === '' ? '-' : String(v))
const rial = (v?: number | null) => `${Number(v ?? 0).toLocaleString('fa-IR')} ریال`

type Props = {
    repair: any
    onOpenTask?: () => void      // set only when the user may open work tasks
    onOpenKiosk?: () => void     // set only when the user may open kiosks
}

/** The repair's details, read-only. The server fills `errors` and `workItems` (with their texts) on GetRepair. */
const RepairInfoTab = ({ repair, onOpenTask, onOpenKiosk }: Props) => {
    const link = (label: string, onClick?: () => void, ltr?: boolean) =>
        onClick ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={onClick} dir={ltr ? 'ltr' : undefined}>{label}</Button> : <Typography variant="body2" dir={ltr ? 'ltr' : undefined}>{label}</Typography>

    const cell = (label: string, node: React.ReactNode) => (
        <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Box>{typeof node === 'string' ? <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{node}</Typography> : node}</Box>
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
            {section('مشخصات قطعه', (
                <Grid container spacing={1}>
                    {cell('شماره', text(repair.id))}
                    {cell('مدل قطعه', text(repair.deviceModelName))}
                    {cell('سریال', <Typography variant="body2" dir="ltr" textAlign="right">{text(repair.serial)}</Typography>)}
                    {cell('وضعیت', text(repair.stateName))}
                    {cell('ارجاع‌شده به', text(repair.assignedToName))}
                    {cell('منشأ', repair.partTransferID ? `انتقال قطعه #${repair.partTransferID}` : 'ثبت مستقیم')}
                </Grid>
            ))}

            {section('منشأ و ارتباط‌ها', (
                <Grid container spacing={1}>
                    {cell('کیوسک', repair.kioskSerial ? link(repair.kioskSerial, onOpenKiosk, true) : '-')}
                    {cell('فعالیت', repair.workTaskID ? link(`#${repair.workTaskID}`, onOpenTask) : '-')}
                    {cell('مشتری', text(repair.customerName))}
                </Grid>
            ))}

            {section('تاریخ‌ها', (
                <Grid container spacing={1}>
                    {cell('زمان دریافت', date(repair.receivedAt))}
                    {cell('زمان تعمیر', date(repair.repairedAt))}
                    {cell('زمان ثبت', date(repair.createdAt))}
                </Grid>
            ))}

            {section('تشخیص و کار انجام‌شده', (
                <>
                    {(repair.errors ?? []).length === 0 && <Typography variant="body2">خطایی ثبت نشده</Typography>}
                    {(repair.errors ?? []).map((e: any) => (
                        <Box key={e.id} sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>{e.code} - {e.title}</Typography>
                            {e.solution && <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{e.solution}</Typography>}
                        </Box>
                    ))}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        کارهای انجام‌شده: {(repair.workItems ?? []).length ? (repair.workItems as any[]).map((w) => w.name).join('، ') : '-'}
                    </Typography>
                </>
            ))}

            {section('هزینه‌ها', (
                <Grid container spacing={1}>
                    {cell('هزینه‌ی تعمیر (برای ما)', rial(repair.repairCost))}
                    {cell('مبلغ دریافتی از مشتری', rial(repair.chargedAmount))}
                </Grid>
            ))}

            {section('توضیحات', <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text(repair.description)}</Typography>)}
        </Box>
    )
}

export default RepairInfoTab
