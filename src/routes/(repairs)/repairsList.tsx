/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { Box, Button, Fab, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { TelecomColumnsType, ServerCtrDataType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import RepairFilterBar, { EMPTY_REPAIR_FILTER, RepairFilterState } from '@components/section/repairs/RepairFilterBar'
import RepairMobileCard from '@components/section/repairs/RepairMobileCard'
import RepairStateChip from '@components/section/repairs/RepairStateChip'
import { buildRepairCreateForm } from '@src/data/dialogArrays/repairForm'
import { useRepairLookups } from '@hooks/useRepairLookups'
import { usePostQuery } from '@hooks/usePostQuery'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { dateFn } from '@utility/dateConverter'
import { buildPayload } from '@utility/buildPayload'

export const Route = createFileRoute('/(repairs)/repairsList')({
    component: withSnackbar(RepairsList),
    staticData: { breadcrumb: 'تعمیرات' },
})

const PAGE_SIZE = 50
const rial = (v?: number | null) => (v ? Number(v).toLocaleString('fa-IR') : '')

function RepairsList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { accessCheck } = useAccessCheck()
    const lookups = useRepairLookups()
    const canCreate = accessCheck({ accessInfoId: 113, KindAccessInfo: 'writeAccess' })    // the server's own rule for AddRepair

    const [filter, setFilter] = useState<RepairFilterState>(EMPTY_REPAIR_FILTER)
    const [serverCtrl, setServerCtrl] = useState<ServerCtrDataType | null>(null)   // the grid's search text and page
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [adding, setAdding] = useState(false)
    const [mobileItems, setMobileItems] = useState<any[]>([])
    const [mobileSearch, setMobileSearch] = useState('')

    const page = serverCtrl?.currentPage ?? 1
    // This is the exact body of POST api/Repair/ListRepairs (RepairFilter). The filter has no free-text field,
    // so what is typed in the grid's search box (or the mobile search box) is used as the part serial.
    const body = useMemo(() => ({
        states: filter.states.length ? filter.states.map((s) => s.id) : null,
        deviceModelID: filter.deviceModel?.id ?? null,
        serial: filter.serial.trim() || serverCtrl?.globalFilter || null,
        customerID: filter.customer?.id ?? null,
        assignedToID: filter.assignedTo?.id ?? null,
        workTaskID: Number(filter.workTaskID) || null,
        receivedFrom: filter.from,
        receivedTo: filter.to,
        index: (page - 1) * PAGE_SIZE,
        number: PAGE_SIZE,
    }), [serverCtrl?.globalFilter, filter, page])

    const list = usePostQuery<{ items: any[]; total: number }>('api/Repair/ListRepairs', 'list-repairs', body)
    const items = list.data?.value?.items ?? []
    const total = list.data?.value?.total ?? 0

    // a new filter or search always starts from page 1
    const changeFilter = (next: RepairFilterState) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data, isMobile])

    const open = (id: number) => navigate({ to: `/repairDetail/${id}` })

    const createForm = buildRepairCreateForm(isMobile)
    const columns: TelecomColumnsType[] = [
        { field: 'id', headerName: 'شماره', width: sizeConverter(70, 'width') },
        { field: 'deviceModelName', headerName: 'مدل قطعه', width: sizeConverter(160, 'width') },
        { field: 'serial', headerName: 'سریال', width: sizeConverter(140, 'width') },
        { field: 'stateName', headerName: 'وضعیت', width: sizeConverter(120, 'width'), renderCell: (p) => <RepairStateChip repair={p.row} /> },
        { field: 'customerName', headerName: 'مشتری', width: sizeConverter(140, 'width') },
        { field: 'kioskSerial', headerName: 'کیوسک', width: sizeConverter(130, 'width') },
        { field: 'workTaskID', headerName: 'فعالیت', width: sizeConverter(90, 'width') },
        { field: 'assignedToName', headerName: 'ارجاع‌شده به', width: sizeConverter(130, 'width') }, {
            field: 'receivedAt',
            headerName: 'زمان دریافت',
            width: sizeConverter(150, 'width'),
            valueGetter: (r) => (r.receivedAt ? dateFn(r.receivedAt) : ''),
            renderCell: (p) => (
                <Grid container alignItems="center" justifyContent="center">
                    <Typography variant="body2">
                        {p.row.receivedAt ? dateFn(p.row.receivedAt) : ''}
                    </Typography>
                </Grid>
            )
        },
        {
            field: 'repairedAt',
            headerName: 'زمان تعمیر',
            width: sizeConverter(150, 'width'),
            valueGetter: (r) => (r.repairedAt ? dateFn(r.repairedAt) : ''),
            renderCell: (p) => (
                <Grid container alignItems="center" justifyContent="center">
                    <Typography variant="body2">
                        {p.row.repairedAt ? dateFn(p.row.repairedAt) : ''}
                    </Typography>
                </Grid>
            )
        },
        { field: 'repairCost', headerName: 'هزینه‌ی تعمیر', width: sizeConverter(120, 'width'), valueGetter: (r) => rial(r.repairCost) },
        { field: 'chargedAmount', headerName: 'مبلغ دریافتی', width: sizeConverter(120, 'width'), valueGetter: (r) => rial(r.chargedAmount) },
        { field: 'description', headerName: 'توضیحات', width: sizeConverter(240, 'width') },
    ]

    const filterBar = (
        <RepairFilterBar
            value={filter}
            onChange={changeFilter}
            states={lookups.options.states}
            deviceModels={lookups.options.deviceModelID}
            customers={lookups.options.customerID}
            technicians={lookups.options.assignedToID}
        />
    )
    const isLoading = lookups.isLoading || (list.isLoading && !list.data)

    return (
        <Grid container size={12} sx={{ position: 'relative', height: isMobile ? '100dvh' : 'auto', overflow: isMobile ? 'hidden' : 'visible' }}>
            {isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}><CustomCircularProgress thickness={2} size={60} /></Grid>
            ) : isMobile ? (
                // ---------------- mobile: search + cards + "load more" ----------------
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', pb: 26, gap: 1.5 }}>
                    <TextField size="small" placeholder="جستجوی سریال قطعه" value={mobileSearch} onChange={(e) => setMobileSearch(e.target.value)} />
                    {filterBar}
                    {mobileItems.map((r) => <RepairMobileCard key={r.id} repair={r} onOpen={() => open(r.id)} />)}
                    {mobileItems.length < total && (
                        <Button onClick={() => setServerCtrl((prev) => ({ ...prev, currentPage: page + 1 }))} disabled={list.isFetching}>بیشتر</Button>
                    )}
                    <Typography variant="caption" textAlign="center">{mobileItems.length} از {total}</Typography>
                    {canCreate && (
                        <Fab color="primary" sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }} onClick={() => setAdding(true)}><AddIcon /></Fab>
                    )}
                </Box>
            ) : (
                // ---------------- desktop: filter bar + server-paged grid ----------------
                <Box sx={{ width: '100%' }}>
                    {filterBar}
                    <TelecomDataGrid
                        data={items}
                        loading={list.isFetching}
                        serverData={{ totalDataCount: total, maxRowInPage: PAGE_SIZE, currentPage: page }}
                        setServerCtrData={setServerCtrl}
                        height={sizeConverter(550, 'height')}
                        maxRowInPage={PAGE_SIZE}
                        doubleClickFunc={() => selectedID && open(selectedID)}
                        CustomToolBar={() => (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'مشاهده'} Icon={OpenInNewIcon} disable={!selectedID} clickFunc={() => selectedID && open(selectedID)} />
                                {canCreate && <DataGridIconProvider toolTipText={'ثبت تعمیر'} Icon={AddIcon} disable={false} clickFunc={() => setAdding(true)} />}
                            </Grid>
                        )}
                        setRows={(data: any) => data && setSelectedID(data?.[0])}
                        multiSelect={false}
                        disableRowSelection={false}
                        columns={columns}
                    />
                </Box>
            )}

            {adding && (
                <GeneralDialog
                    open="add"
                    title="ثبت تعمیر"
                    width={sizeConverter(680, 'width')}
                    close={() => setAdding(false)}
                    array={createForm}
                    createEndpoint="api/Repair/AddRepair"
                    autoCompleteOption={{
                        deviceModelID: lookups.options.deviceModelID,
                        customerID: lookups.options.customerID,
                    }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        const payload: Record<string, unknown> = buildPayload(createForm, data, {})
                        // the server's ReceivedAt is not nullable: leave it out to mean "now"
                        if (!payload.receivedAt) delete payload.receivedAt
                        // an empty task number must be null, not 0 (0 would mean "task #0 not found")
                        if (!payload.workTaskID) payload.workTaskID = null
                        return payload
                    }) as any}
                    wrapperFunc={(created) => { list.refetch(); if (created?.id) open(created.id) }}
                    snackbarOpen={snackbarOpen}
                />
            )}
        </Grid>
    )
}
