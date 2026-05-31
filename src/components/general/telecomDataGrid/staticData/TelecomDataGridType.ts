/* eslint-disable */

export type TelecomColumnsType = {
    field: string
    headerName: string
    headerAlign?: 'center' | 'left' | 'right'
    align?: 'center' | 'left' | 'right'
    minWidth?: number
    width?: number
    status?: boolean
    sortLock?: boolean
    renderCell?: (params: TelecomParamsType) => void
    valueGetter?: (row: Record<string, any>) => string | number
    renderHeader?: (colDef: TelecomColumnsType) => void
}

export type TelecomParamsType = {
    value: any
    row: Record<string, any>
    searchedText?: string
}

export type ServerCtrDataType = {
    globalFilter?: string
    currentPage?: number
    colSortDirection?: { [key: string]: 'asc' | 'desc' }
}
