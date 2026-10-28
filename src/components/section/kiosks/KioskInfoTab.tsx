import Grid from '@mui/material/Grid2'
import { Box, Divider, Typography } from '@mui/material'
import { convertToShamsi } from '@utility/dateConverter'

const date = (d?: string | null) => (d ? convertToShamsi(d) : '-')
const text = (v?: string | number | null) => (v === null || v === undefined || v === '' ? '-' : String(v))

/** The kiosk's details, read-only, grouped like the edit form. */
const KioskInfoTab = ({ kiosk, technicianNames }: { kiosk: any; technicianNames: string[] }) => {
    const groups: { title: string; rows: [string, string][] }[] = [
        {
            title: 'مشخصات',
            rows: [
                ['سریال', text(kiosk.serial)], ['مدل', text(kiosk.kioskModelName)], ['مشتری', text(kiosk.customerName)],
                ['قرارداد', text(kiosk.contractName)], ['وضعیت', kiosk.isActive ? 'فعال' : 'غیرفعال'],
            ],
        },
        {
            title: 'محل نصب',
            rows: [
                ['شهر', text(kiosk.cityName)], ['کد شعبه', text(kiosk.branchCode)], ['نام شعبه', text(kiosk.branchName)],
                ['فاصله تا مرکز استان', kiosk.distanceFromCenterKm ? `${kiosk.distanceFromCenterKm} کیلومتر` : '-'], ['آدرس', text(kiosk.address)],
            ],
        },
        {
            title: 'تاریخ‌ها',
            rows: [
                ['فروش', date(kiosk.saleDate)], ['ارسال', date(kiosk.shippingDate)], ['نصب', date(kiosk.installationDate)],
                ['شروع گارانتی', date(kiosk.warrantyStartDate)], ['پایان گارانتی', date(kiosk.warrantyEndDate)],
            ],
        },
        {
            title: 'پشتیبانی',
            rows: [['پشتیبان‌ها', technicianNames.length ? technicianNames.join('، ') : '-']],
        },
        {
            title: 'ترمینال و ذی‌نفع',
            rows: [
                ['IP', text(kiosk.ipAddress)], ['TerminalID', text(kiosk.terminalID)], ['Merchant', text(kiosk.merchant)],
                ['Terminal', text(kiosk.terminal)], ['شماره پرونده', text(kiosk.fileNo)],
                ['ذی‌نفع', text(kiosk.beneficiaryName)], ['تلفن ذی‌نفع', text(kiosk.beneficiaryPhone)],
            ],
        },
        { title: 'توضیحات', rows: [['', text(kiosk.description)]] },
    ]

    return (
        <Box>
            {groups.map((g) => (
                <Box key={g.title} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{g.title}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={1}>
                        {g.rows.map(([label, value]) => (
                            <Grid key={label + value} size={{ xs: 12, md: label === 'آدرس' || label === '' ? 12 : 4 }}>
                                {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}
                                <Typography variant="body2">{value}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </Box>
    )
}

export default KioskInfoTab