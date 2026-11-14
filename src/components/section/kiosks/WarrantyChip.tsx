import { Chip } from '@mui/material'
import { convertToShamsi } from '@utility/dateConverter'
import { convertToPersianNumber } from '@utility/convertToPersianNumber'

/** The warranty state of a kiosk. The server calculates it from the contract (Kiosk.UpdateWarranty). */
const WarrantyChip = ({ kiosk, size = 'small' }: { kiosk: any; size?: 'small' | 'medium' }) => {
    if (!kiosk?.warrantyEndDate) return <Chip size={size} label="بدون اطلاعات گارانتی" />
    return kiosk.isUnderWarranty
        ? <Chip size={size} color="success" label={`گارانتی تا ${convertToPersianNumber(convertToShamsi(kiosk.warrantyEndDate))}`} />
        : <Chip size={size} color="error" label="گارانتی تمام شده" />
}

export default WarrantyChip