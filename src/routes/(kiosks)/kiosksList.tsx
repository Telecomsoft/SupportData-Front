/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { Box, Button, Fab, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { TelecomColumnsType, ServerCtrDataType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider'
import GeneralDialog from '@components/general/GeneralDialog'
import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import KioskFilterBar, { EMPTY_KIOSK_FILTER, KioskFilterState } from '@components/section/kiosks/KioskFilterBar'
import KioskMobileCard from '@components/section/kiosks/KioskMobileCard'
import WarrantyChip from '@components/section/kiosks/WarrantyChip'
import { buildKioskForm } from '@src/data/dialogArrays/kioskForm'
import { useKioskLookups } from '@hooks/useKioskLookups'
import { usePostQuery } from '@hooks/usePostQuery'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { convertToShamsi } from '@utility/dateConverter'
import { buildPayload } from '@utility/buildPayload'
import CircleIcon from '@mui/icons-material/Circle'

export const Route = createFileRoute('/(kiosks)/kiosksList')({
    component: withSnackbar(KiosksList),
    staticData: { breadcrumb: 'کیوسک‌ها' },
})

const PAGE_SIZE = 50
type Mode = 'add' | 'edit' | 'delete' | null

function KiosksList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { accessCheck } = useAccessCheck()
    const lookups = useKioskLookups()
    const hasWriteAccess = accessCheck({ accessInfoId: 110, KindAccessInfo: 'writeAccess' })

    const [filter, setFilter] = useState<KioskFilterState>(EMPTY_KIOSK_FILTER)
    const [serverCtrl, setServerCtrl] = useState<ServerCtrDataType | null>(null)   // the grid's search text and page
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [openDialog, setOpenDialog] = useState<Mode>(null)
    const [mobileItems, setMobileItems] = useState<any[]>([])
    const [mobileSearch, setMobileSearch] = useState('')

    const page = serverCtrl?.currentPage ?? 1
    // The server pages and filters: this is the exact body of POST api/Kiosk/ListKiosks (KioskFilter)
    const body = useMemo(() => ({
        serial: serverCtrl?.globalFilter || null,
        customerID: filter.customer?.id ?? null,
        cityID: filter.city?.id ?? null,
        kioskModelID: filter.model?.id ?? null,
        branchCode: filter.branchCode || null,
        isActive: filter.isActive,
        index: (page - 1) * PAGE_SIZE,
        number: PAGE_SIZE,
    }), [serverCtrl?.globalFilter, filter, page])

    const list = usePostQuery<{ items: any[]; total: number }>('api/Kiosk/ListKiosks', 'list-kiosks', body)
    const items = list.data?.value?.items ?? []
    const total = list.data?.value?.total ?? 0
    const selectedRow = items.find((k) => k.id === selectedID)

    // a new filter or search always starts from page 1
    const changeFilter = (next: KioskFilterState) => {
        setFilter(next)
        setServerCtrl((prev) => ({ ...prev, currentPage: 1 }))
    }
    useEffect(() => { setServerCtrl((prev) => (prev && prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev)) }, [serverCtrl?.globalFilter])

    // mobile: the pages pile up under each other ("load more"); mobile has its own search box
    useEffect(() => {
        if (!isMobile) return
        const t = setTimeout(() => setServerCtrl((prev) => ({ ...prev, globalFilter: mobileSearch, currentPage: 1 })), 400)
        return () => clearTimeout(t)
    }, [mobileSearch, isMobile])
    useEffect(() => {
        if (!isMobile || !list.data?.value) return
        setMobileItems((prev) => {
            if (page === 1) return list.data!.value.items
            const known = new Set(prev.map((k) => k.id))
            return [...prev, ...list.data!.value.items.filter((k: any) => !known.has(k.id))]
        })
    }, [list.data, isMobile])

    const open = (id: number) => navigate({ to: `/kioskDetail/${id}` })

    const form = buildKioskForm(isMobile)
    const columns: TelecomColumnsType[] = [
        { field: 'serial', headerName: 'سریال', width: sizeConverter(150, 'width') },
        { field: 'kioskModelName', headerName: 'مدل', width: sizeConverter(120, 'width') },
        { field: 'customerName', headerName: 'مشتری', width: sizeConverter(140, 'width') },
        { field: 'cityName', headerName: 'شهر', width: sizeConverter(110, 'width') },
        { field: 'branchName', headerName: 'شعبه', width: sizeConverter(140, 'width') },
        { field: 'branchCode', headerName: 'کد شعبه', width: sizeConverter(90, 'width') },
        { field: 'installationDate', headerName: 'تاریخ نصب', width: sizeConverter(100, 'width'), valueGetter: (r) => (r.installationDate ? convertToShamsi(r.installationDate) : '') },
        { field: 'warrantyEndDate', headerName: 'گارانتی', width: sizeConverter(190, 'width'), renderCell: (p) => <WarrantyChip kiosk={p.row} /> },
        {
            field: 'isActive', headerName: 'وضعیت', width: sizeConverter(80, 'width'), valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'), renderCell: (param) =>
                <Grid justifyContent="center" alignItems="center" container>
                    <CircleIcon sx={{ color: param?.value ? 'primary.main' : 'gray' }} />
                </Grid>
        },
    ]

    const isLoading = lookups.isLoading || (list.isLoading && !list.data)

    return (
        <Grid container size={12} sx={{ position: 'relative', height: isMobile ? '100dvh' : 'auto', overflow: isMobile ? 'hidden' : 'visible' }}>
            {isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}><CustomCircularProgress thickness={2} size={60} /></Grid>
            ) : isMobile ? (
                // ---------------- mobile: search + cards + "load more" ----------------
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', pb: 26, gap: 1.5 }}>
                    <TextField size="small" placeholder="جستجوی سریال" value={mobileSearch} onChange={(e) => setMobileSearch(e.target.value)} />
                    <KioskFilterBar value={filter} onChange={changeFilter} customers={lookups.options.customerID} cities={lookups.options.cityID} models={lookups.options.kioskModelID} />
                    {mobileItems.map((k) => <KioskMobileCard key={k.id} kiosk={k} onOpen={() => open(k.id)} />)}
                    {mobileItems.length < total && (
                        <Button onClick={() => setServerCtrl((prev) => ({ ...prev, currentPage: page + 1 }))} disabled={list.isFetching}>بیشتر</Button>
                    )}
                    <Typography variant="caption" textAlign="center">{mobileItems.length} از {total}</Typography>
                    {hasWriteAccess && (
                        <Fab color="primary" sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }} onClick={() => setOpenDialog('add')}><AddIcon /></Fab>
                    )}
                </Box>
            ) : (
                // ---------------- desktop: filter bar + server-paged grid ----------------
                <Box sx={{ width: '100%' }}>
                    <KioskFilterBar value={filter} onChange={changeFilter} customers={lookups.options.customerID} cities={lookups.options.cityID} models={lookups.options.kioskModelID} />
                    <TelecomDataGrid
                        data={items}
                        loading={list.isFetching}
                        serverData={{ totalDataCount: total, maxRowInPage: PAGE_SIZE, currentPage: page }}
                        setServerCtrData={setServerCtrl}
                        maxRowInPage={PAGE_SIZE}
                        doubleClickFunc={() => selectedID && open(selectedID)}
                        CustomToolBar={() => (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'مشاهده'} Icon={OpenInNewIcon} disable={!selectedID} clickFunc={() => selectedID && open(selectedID)} />
                                {hasWriteAccess && <DataGridIconProvider toolTipText={'اضافه'} Icon={AddIcon} disable={false} clickFunc={() => setOpenDialog('add')} />}
                                {hasWriteAccess && <DataGridIconProvider toolTipText={'ویرایش'} Icon={EditIcon} disable={!selectedID} clickFunc={() => setOpenDialog('edit')} />}
                                {hasWriteAccess && <DataGridIconProvider toolTipText={'حذف'} Icon={DeleteIcon} disable={!selectedID} clickFunc={() => setOpenDialog('delete')} />}
                            </Grid>
                        )}
                        setRows={(data: any) => data && setSelectedID(data?.[0])}
                        multiSelect={false}
                        disableRowSelection={false}
                        columns={columns}
                    />
                </Box>
            )}

            {(openDialog === 'add' || openDialog === 'edit') && (
                <GeneralDialog
                    open={openDialog}
                    title="کیوسک"
                    width={sizeConverter(820, 'width')}
                    close={() => setOpenDialog(null)}
                    array={form}
                    createEndpoint="api/Kiosk/AddKiosk"
                    editEndpoint="api/Kiosk/UpdateKiosk"
                    autoCompleteOption={lookups.options}
                    addDefaultValue={{ isActive: true }}
                    defaultValue={openDialog === 'edit' ? { ...selectedRow } : undefined}
                    sendFinalData
                    apiValueGetter={((data: any) => buildPayload(form, data, openDialog === 'edit' ? { ...selectedRow } : { isActive: true })) as any}
                    wrapperFunc={() => list.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {openDialog === 'delete' && (
                <GeneralDeleteDialog
                    dialogTitle="کیوسک"
                    deleteID={selectedID}
                    deleteDescription={selectedRow ? `آیا از حذف کیوسک ${selectedRow.serial} اطمینان دارید؟ (کیوسکی که تسک دارد حذف نمی‌شود؛ آن را غیرفعال کن)` : ''}
                    snackbarOpen={snackbarOpen}
                    deleteEndPoint="api/Kiosk/DeleteKiosk/"
                    isDialogOpen={openDialog}
                    customFunAfterSuccess={() => { list.refetch(); setSelectedID(undefined) }}
                    dialogCloseFun={() => setOpenDialog(null)}
                />
            )}
        </Grid>
    )
}