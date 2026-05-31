import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { readURLQueryParameters } from '@components/section/AssignDevice.tsx'
import { useMemo } from 'react'
import { sizeConverter } from '@utility/sizeConverter.ts'

type DataGridProps = {
    data: any
    loading: boolean
    columns: GridColDef[]
    filterByQueryParamsKey?: string
}

export default function CustomDataGrid({ data, loading, columns, filterByQueryParamsKey }: DataGridProps) {
    const queryParams = readURLQueryParameters()

    const rows = useMemo(() => {
        if (filterByQueryParamsKey && queryParams?.[filterByQueryParamsKey]) {
            const filterParams = queryParams?.[filterByQueryParamsKey]
            if (Array.isArray(filterParams) && filterParams.length > 0) {
                return data?.filter((i: Record<string, string>) => filterParams?.includes(i?.[filterByQueryParamsKey]))
            } else {
                return data?.filter((i: Record<string, unknown>) => i?.[filterByQueryParamsKey] === filterParams)
            }
        } else return data
    }, [data, filterByQueryParamsKey, queryParams])
    
    return (
        <DataGrid
            loading={loading}
            rows={rows ?? []}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            // pageSizeOptions={[5]}
            sx={{borderRadius: sizeConverter(12, 'radius')}}
            hideFooter={true}
            disableRowSelectionOnClick
            // onRowClick={}
        />
    )
}
