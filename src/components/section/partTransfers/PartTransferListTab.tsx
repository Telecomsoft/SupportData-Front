/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { Box, Button, Fab, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { snackbarOpenType } from '@type/snackbarOpen'
import { TelecomColumnsType, ServerCtrDataType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import PartTransferFilterBar, { EMPTY_PART_TRANSFER_FILTER, PartTransferFilterState } from '@components/section/partTransfers/PartTransferFilterBar'
import PartTransferMobileCard from '@components/section/partTransfers/PartTransferMobileCard'
import PartTransferStateChip from '@components/section/partTransfers/PartTransferStateChip'
import PartTransferActionDialog from '@components/section/partTransfers/PartTransferActionDialog'
import { buildPartTransferCreateForm, parseSerials } from '@src/data/dialogArrays/partTransferForm'
import { usePartTransferLookups } from '@hooks/usePartTransferLookups'
import { usePartTransferRules } from '@hooks/usePartTransferRules'
import { usePostQuery } from '@hooks/usePostQuery'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { dateFn } from '@utility/dateConverter'
import { buildPayload } from '@utility/buildPayload'

const PAGE_SIZE = 50

/** The movement list: filter, server-paged grid, register, and complete / cancel of a pending movement. */
const PartTransferListTab = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const lookups = usePartTransferLookups()
    const rules = usePartTransferRules()

    const [filter, setFilter] = useState<PartTransferFilterState>(EMPTY_PART_TRANSFER_FILTER)
    const [serverCtrl, setServerCtrl] = useState<ServerCtrDataType | null>(null)   // the grid's page
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [adding, setAdding] = useState(false)
    const [action, setAction] = useState<{ kind: 'complete' | 'cancel'; transfer: any } | null>(null)
    const [mobileItems, setMobileItems] = useState<any[]>([])

    const page = serverCtrl?.currentPage ?? 1
    // This is the exact body of POST api/PartTransfer/ListPartTransfers (PartTransferFilter).
    // The filter has no free-text field, so the grid's own search box only searches the rows already on the page.
    const body = useMemo(() => ({
        kind: filter.kind?.id ?? null,
        state: filter.state?.id ?? null,
        deviceModelID: filter.deviceModel?.id ?? null,
        technicianID: filter.technician?.id ?? null,
        workTaskID: Number(filter.workTaskID) || null,
        createdFrom: filter.from,
        createdTo: filter.to,
        index: (page - 1) * PAGE_SIZE,
        number: PAGE_SIZE,
    }), [filter, page])

    const list = usePostQuery<{ items: any[]; total: number }>('api/PartTransfer/ListPartTransfers', 'list-part-transfers', body)
    const items = list.data?.value?.items ?? []
    const total = list.data?.value?.total ?? 0
    const selected = items.find((t) => t.id === selectedID)

    const locName = (id: number) => lookups.options.locations.find((l) => l.id === id)?.name ?? String(id)
    const routeOf = (t: any) => `از ${locName(t.fromLocation)} به ${locName(t.toLocation)}`

    // a new filter always starts from page 1
    const changeFilter = (next: PartTransferFilterState) => {
        setFilter(next)
        setServerCtrl((prev) => ({ ...prev, currentPage: 1 }))
    }

    // mobile: the pages pile up under each other ("load more")
    useEffect(() => {
        if (!isMobile || !list.data?.value) return
        setMobileItems((prev) => {
            if (page === 1) return list.data!.value.items
            const known = new Set(prev.map((k) => k.id))
            return [...prev, ...list.data!.value.items.filter((k: any) => !known.has(k.id))]
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.data, isMobile])

    const open = (id: number) => navigate({ to: `/partTransferDetail/${id}` })
    const afterAction = () => { setAction(null); list.refetch() }

    const createForm = buildPartTransferCreateForm({ isMobile, isFieldTechnician: rules.isFieldTechnician })
    const columns: TelecomColumnsType[] = [
        { field: 'id', headerName: 'شماره', width: sizeConverter(70, 'width') },
        { field: 'kindName', headerName: 'نوع انتقال', width: sizeConverter(150, 'width') },
        { field: 'stateName', headerName: 'وضعیت', width: sizeConverter(110, 'width'), renderCell: (p) => <PartTransferStateChip transfer={p.row} /> },
        { field: 'deviceModelName', headerName: 'مدل قطعه', width: sizeConverter(160, 'width') },
        { field: 'quantity', headerName: 'تعداد', width: sizeConverter(70, 'width') },
        { field: 'serials', headerName: 'سریال‌ها', width: sizeConverter(160, 'width'), valueGetter: (r) => (r.serials ?? []).join('، ') },
        { field: 'route', headerName: 'مسیر', width: sizeConverter(170, 'width'), valueGetter: (r) => routeOf(r) },
        { field: 'technicianName', headerName: 'تکنسین', width: sizeConverter(130, 'width') },
        { field: 'workTaskID', headerName: 'دستورکار', width: sizeConverter(90, 'width') },
        { field: 'repairID', headerName: 'تعمیر', width: sizeConverter(80, 'width') },
        { field: 'createdAt', headerName: 'زمان ثبت', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.createdAt ? dateFn(r.createdAt) : '') },
        { field: 'doneAt', headerName: 'زمان انجام', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.doneAt ? dateFn(r.doneAt) : '') },
        { field: 'description', headerName: 'توضیحات', width: sizeConverter(220, 'width') },
    ]

    const filterBar = (
        <PartTransferFilterBar
            value={filter}
            onChange={changeFilter}
            kinds={lookups.options.kinds}
            states={lookups.options.states}
            deviceModels={lookups.options.deviceModelID}
            technicians={lookups.options.technicianID}
            isFieldTechnician={rules.isFieldTechnician}
        />
    )
    const isLoading = lookups.isLoading || (list.isLoading && !list.data)

    return (
        <Grid container size={12} sx={{ position: 'relative' }}>
            {isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '30%' : '10%' }}><CustomCircularProgress thickness={2} size={60} /></Grid>
            ) : isMobile ? (
                // ---------------- mobile: cards + "load more" ----------------
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 26, gap: 1.5 }}>
                    {filterBar}
                    {mobileItems.map((t) => <PartTransferMobileCard key={t.id} transfer={t} route={routeOf(t)} onOpen={() => open(t.id)} />)}
                    {mobileItems.length < total && (
                        <Button onClick={() => setServerCtrl((prev) => ({ ...prev, currentPage: page + 1 }))} disabled={list.isFetching}>بیشتر</Button>
                    )}
                    <Typography variant="caption" textAlign="center">{mobileItems.length} از {total}</Typography>
                    {rules.hasWrite && (
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
                        maxRowInPage={PAGE_SIZE}
                        doubleClickFunc={() => selectedID && open(selectedID)}
                        CustomToolBar={() => (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'مشاهده'} Icon={OpenInNewIcon} disable={!selectedID} clickFunc={() => selectedID && open(selectedID)} />
                                {rules.hasWrite && <DataGridIconProvider toolTipText={'ثبت انتقال'} Icon={AddIcon} disable={false} clickFunc={() => setAdding(true)} />}
                                {rules.hasWrite && (
                                    <DataGridIconProvider toolTipText={'تکمیل انتقال'} Icon={DoneAllIcon} disable={!selected || !rules.canComplete(selected)} clickFunc={() => selected && setAction({ kind: 'complete', transfer: selected })} />
                                )}
                                {rules.hasWrite && (
                                    <DataGridIconProvider toolTipText={'لغو انتقال'} Icon={CancelOutlinedIcon} disable={!selected || !rules.canCancel(selected)} clickFunc={() => selected && setAction({ kind: 'cancel', transfer: selected })} />
                                )}
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
                    title="ثبت انتقال قطعه"
                    width={sizeConverter(700, 'width')}
                    close={() => setAdding(false)}
                    array={createForm}
                    createEndpoint="api/PartTransfer/AddPartTransfer"
                    autoCompleteOption={{
                        kind: lookups.options.kind,
                        deviceModelID: lookups.options.deviceModelID,
                        technicianID: lookups.options.technicianID,
                    }}
                    addDefaultValue={{ quantity: 1 }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        const payload: Record<string, unknown> = buildPayload(createForm, data, {})
                        payload.serials = parseSerials(data.serials)             // one text -> the list the server wants
                        // empty must be null, not 0 (0 would mean "task #0 not found")
                        if (!payload.workTaskID) payload.workTaskID = null
                        if (!payload.technicianID) payload.technicianID = null
                        return payload
                    }) as any}
                    wrapperFunc={(created) => { list.refetch(); if (created?.id) open(created.id) }}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {action && (
                <PartTransferActionDialog action={action.kind} transfer={action.transfer} close={() => setAction(null)} onDone={afterAction} snackbarOpen={snackbarOpen} />
            )}
        </Grid>
    )
}

export default PartTransferListTab
