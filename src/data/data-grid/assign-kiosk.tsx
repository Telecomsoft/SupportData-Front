import { TelecomColumnsType } from '@type/TelecomDataGridType.ts'
import { sizeConverter } from '@utility/sizeConverter.ts'

export const ASSIGN_KIOSK: TelecomColumnsType[] = [
    {
        field: 'kioskName',
        headerName: 'نام کیوسک',
        align: 'center',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'kioskSerial',
        headerName: 'سریال کیوسک',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'model',
        headerName: 'مدل',
        headerAlign: 'center',
        align: 'center',
        minWidth: sizeConverter(90, 'width'),
    },
    {
        field: 'branchCode',
        headerName: 'کد شعبه',
        headerAlign: 'center',
        align: 'center',
        minWidth: sizeConverter(90, 'width'),
    },
    {
        field: 'kioskGroup',
        headerName: 'گروه کیوسک',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'region',
        headerName: 'نام استان',
        headerAlign: 'center',
        align: 'center',
        minWidth: sizeConverter(90, 'width'),
    },
    {
        field: 'managingName',
        headerName: 'نام مدیریت',
        headerAlign: 'center',
        minWidth: sizeConverter(100, 'width'),
    },
    {
        field: 'managingCode',
        headerName: 'کد مدیریت',
        headerAlign: 'center',
        minWidth: sizeConverter(100, 'width'),
    },
]
export const ASSIGN_KIOSK_GROUP: TelecomColumnsType[] = [
    {
        field: 'name',
        headerName: 'گروه کیوسک',
        align: 'center',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'description',
        headerName: 'توضیحات',
        headerAlign: 'center',
        minWidth: sizeConverter(200, 'width'),
    },
]

export const ASSIGN_KIOSK_HIDDEN_VISIBLE: { field: string; visible: boolean }[] = [
    {
        field: 'kioskName',
        visible: true,
    },
    {
        field: 'kioskSerial',
        visible: false,
    },
    {
        field: 'model',
        visible: true,
    },
    {
        field: 'branchCode',
        visible: false,
    },
    {
        field: 'kioskGroup',
        visible: true,
    },
    {
        field: 'region',
        visible: true,
    },
    {
        field: 'managingName',
        visible: false
    },
    {
        field: 'managingCode',
        visible: false
    },
]
// kioskName: 'asc'
export const ASSIGN_KIOSK_DEFAULT_SORT: Record<string, 'asc' | 'desc'> = {}

export const ASSIGN_PAYMENT: TelecomColumnsType[] = [
    {
        field: 'settingName',
        headerName: 'Setting Name',
        align: 'center',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'settingValue',
        headerName: 'Value',
        align: 'center',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
    {
        field: 'itemKind',
        headerName: 'Kind',
        align: 'center',
        headerAlign: 'center',
        minWidth: sizeConverter(120, 'width'),
    },
]
