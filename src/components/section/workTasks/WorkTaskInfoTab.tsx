/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Box, Divider, Typography } from '@mui/material'
import { dateFn } from '@utility/dateConverter'
import { nameOf, WORK_MODES } from '@src/data/type/lookups'

const date = (d?: string | null) => (d ? dateFn(d) : '-')
const text = (v?: string | number | null) => (v === null || v === undefined || v === '' ? '-' : String(v))

type Props = {
    task: any
    contractorName?: string
    workItemNames: string[]
    isCustomer: boolean
}

/** The task's details, read-only. */
const WorkTaskInfoTab = ({ task, contractorName, workItemNames, isCustomer }: Props) => {
    const groups: { title: string; rows: [string, string][] }[] = [
        {
            title: 'مشخصات',
            rows: [
                ['شماره', text(task.id)], ['نوع', text(task.typeName)], ['وضعیت', text(task.stateName)],
                ['نحوه‌ی انجام', text(nameOf(WORK_MODES, task.workMode))], ['کیوسک', text(task.kioskSerial)], ['مشتری', text(task.customerName)],
                ['ارجاع‌شده به', text(task.assignedToName)], ['پیمانکار', text(contractorName)],
                ['فرم سرویس', task.serviceFormReceived ? 'دریافت شده' : 'دریافت نشده'],
            ],
        },
        {
            title: 'تاریخ‌ها',
            rows: [
                ['زمان گزارش', date(task.reportedAt)], ['زمان ثبت', date(task.createdAt)], ['مهلت', date(task.dueAt)],
                ['زمان اتمام', date(task.finishedAt)], ['زمان تایید', date(task.approvedAt)],
                ['روز تاخیر', text(task.delayDays)], ['تعداد مراجعه', text(task.numberOfVisits)],
            ],
        },
        { title: 'شرح مشکل', rows: [['', text(task.reportedIssue)]] },
    ]

    return (
        <Box>
            {groups.map((g) => (
                <Box key={g.title} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{g.title}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={1}>
                        {g.rows.map(([label, value]) => (
                            <Grid key={label + value} size={{ xs: 12, md: label === '' ? 12 : 4 }}>
                                {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

            {/* the error knowledge base is internal: the server sends it only to staff */}
            {!isCustomer && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>تشخیص و راه‌حل</Typography>
                    <Divider sx={{ mb: 1 }} />
                    {(task.errors ?? []).length === 0 && !task.diagnosisNote && <Typography variant="body2">-</Typography>}
                    {(task.errors ?? []).map((e: any) => (
                        <Box key={e.id} sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>{e.code} - {e.title} {e.deviceModelName ? `(${e.deviceModelName})` : ''}</Typography>
                            {e.solution && <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{e.solution}</Typography>}
                        </Box>
                    ))}
                    {task.diagnosisNote && <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{task.diagnosisNote}</Typography>}
                </Box>
            )}

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>کار انجام‌شده</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2">{workItemNames.length ? workItemNames.join('، ') : '-'}</Typography>
                {task.workDoneNote && <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{task.workDoneNote}</Typography>}
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={700}>توضیحات</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{text(task.description)}</Typography>
            </Box>
        </Box>
    )
}

export default WorkTaskInfoTab
