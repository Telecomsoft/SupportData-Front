import { sizeConverter } from '@utility/sizeConverter.ts'
import { TelecomColumnsType } from '@type/TelecomDataGridType.ts'

export const INGREDIENT: TelecomColumnsType[] = [
   { field: 'enName', headerName: 'نام انگلیسی', width: sizeConverter(120, 'width') },
   { field: 'faName', headerName: 'نام فارسی', width: sizeConverter(120, 'width') },
   // { field: 'deactive', headerName: 'فعال', renderCell: dataGridBooleanCell },
]
