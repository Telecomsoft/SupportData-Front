/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { Box, Button, Chip, Fab, TextField, Typography } from '@mui/material'
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
import WorkTaskFilterBar, { EMPTY_WORKTASK_FILTER, WorkTaskFilterState } from '@components/section/workTasks/WorkTaskFilterBar'
import WorkTaskMobileCard from '@components/section/workTasks/WorkTaskMobileCard'
import WorkTaskStateChip from '@components/section/workTasks/WorkTaskStateChip'
import { buildWorkTaskCreateForm } from '@src/data/dialogArrays/workTaskForm'
import { CUSTOMER_TASK_TYPES, TASK_TYPES } from '@src/data/type/lookups'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { usePostQuery } from '@hooks/usePostQuery'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { dateFn } from '@utility/dateConverter'
import { buildPayload } from '@utility/buildPayload'

export const Route = createFileRoute('/(workTasks)/workTasksList')({
    component: withSnackbar(WorkTasksList),
    staticData: { breadcrumb: 'دستورکارها' },
})

const PAGE_SIZE = 50

function WorkTasksList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { canPerform } = useAccessCheck()
    const { isCustomer } = useUserScope()
    const lookups = useWorkTaskLookups()
    const canCreate = canPerform(201)                 // "Task - Create"; the server also checks the customer rules

    const [filter, setFilter] = useState<WorkTaskFilterState>(EMPTY_WORKTASK_FILTER)
    const [serverCtrl, setServerCtrl] = useState<ServerCtrDataType | null>(null)   // the grid's search text and page
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [adding, setAdding] = useState(false)
    const [mobileItems, setMobileItems] = useState<any[]>([])
    const [mobileSearch, setMobileSearch] = useState('')

    const page = serverCtrl?.currentPage ?? 1
    // The server pages and filters: this is the exact body of POST api/WorkTask/ListWorkTasks (WorkTaskFilter)
    const body = useMemo(() => ({
        states: filter.states.length ? filter.states.map((s) => s.id) : null,
        types: filter.types.length ? filter.types.map((t) => t.id) : null,
        customerID: filter.customer?.id ?? null,
        cityID: filter.city?.id ?? null,
        assignedToID: filter.assignedTo?.id ?? null,
        kioskSerial: filter.kioskSerial.trim() || null,
        reportedFrom: filter.from,
        reportedTo: filter.to,
        overdueOnly: filter.overdueOnly ? true : null,
        text: serverCtrl?.globalFilter || null,
        index: (page - 1) * PAGE_SIZE,
        number: PAGE_SIZE,
    }), [serverCtrl?.globalFilter, filter, page])

    const list = usePostQuery<{ items: any[]; total: number }>('api/WorkTask/ListWorkTasks', 'list-worktasks', body)
    const items = list.data?.value?.items ?? []
    const total = list.data?.value?.total ?? 0

    // a new filter or search always starts from page 1
    const changeFilter = (next: WorkTaskFilterState) => {
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

    const open = (id: number) => navigate({ to: `/workTaskDetail/${id}` })

    const taskTypeOptions = isCustomer ? CUSTOMER_TASK_TYPES : TASK_TYPES
    const createForm = buildWorkTaskCreateForm({ isMobile, isCustomer, canAssign: canPerform(203) })
    const columns: TelecomColumnsType[] = [
        { field: 'id', headerName: 'شماره', width: sizeConverter(70, 'width') },
        { field: 'typeName', headerName: 'نوع', width: sizeConverter(100, 'width') },
        { field: 'stateName', headerName: 'وضعیت', width: sizeConverter(110, 'width'), renderCell: (p) => <WorkTaskStateChip task={p.row} /> },
        { field: 'kioskSerial', headerName: 'سریال کیوسک', width: sizeConverter(140, 'width') },
        ...(isCustomer ? [] : [{ field: 'customerName', headerName: 'مشتری', width: sizeConverter(140, 'width') }]),
        ...(isCustomer ? [] : [{ field: 'assignedToName', headerName: 'ارجاع‌شده به', width: sizeConverter(130, 'width') }]),
        { field: 'reportedAt', headerName: 'زمان گزارش', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.reportedAt ? dateFn(r.reportedAt) : '') },
        { field: 'dueAt', headerName: 'مهلت', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.dueAt ? dateFn(r.dueAt) : '') },
        { field: 'isOverdue', headerName: 'دیرکرد', width: sizeConverter(80, 'width'), valueGetter: (r) => (r.isOverdue ? 'دیرکرد' : ''), renderCell: (p) => (p.row.isOverdue ? <Chip size="small" color="error" label="دیرکرد" /> : null) },
        { field: 'finishedAt', headerName: 'زمان اتمام', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.finishedAt ? dateFn(r.finishedAt) : '') },
        { field: 'delayDays', headerName: 'روز تاخیر', width: sizeConverter(80, 'width') },
        { field: 'serviceFormReceived', headerName: 'فرم سرویس', width: sizeConverter(90, 'width'), valueGetter: (r) => (r.serviceFormReceived ? 'دریافت شده' : 'نشده') },
        { field: 'isPaid', headerName: 'پرداخت', width: sizeConverter(90, 'width'), valueGetter: (r) => (r.isPaid ? 'پرداخت شده' : 'نشده') },
        { field: 'reportedIssue', headerName: 'شرح مشکل', width: sizeConverter(240, 'width') },
    ]

    const isLoading = lookups.isLoading || (list.isLoading && !list.data)

    return (
        <Grid container size={12} sx={{ position: 'relative', height: isMobile ? '100dvh' : 'auto', overflow: isMobile ? 'hidden' : 'visible' }}>
            {isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}><CustomCircularProgress thickness={2} size={60} /></Grid>
            ) : isMobile ? (
                // ---------------- mobile: search + cards + "load more" ----------------
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', pb: 26, gap: 1.5 }}>
                    <TextField size="small" placeholder="جستجو در شرح مشکل و توضیحات" value={mobileSearch} onChange={(e) => setMobileSearch(e.target.value)} />
                    <WorkTaskFilterBar value={filter} onChange={changeFilter} customers={lookups.options.customerID} cities={lookups.options.cityID} technicians={lookups.options.assignedToID} isCustomer={isCustomer} />
                    {mobileItems.map((t) => <WorkTaskMobileCard key={t.id} task={t} onOpen={() => open(t.id)} />)}
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
                    <WorkTaskFilterBar value={filter} onChange={changeFilter} customers={lookups.options.customerID} cities={lookups.options.cityID} technicians={lookups.options.assignedToID} isCustomer={isCustomer} />
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
                                {canCreate && <DataGridIconProvider toolTipText={'ثبت دستورکار'} Icon={AddIcon} disable={false} clickFunc={() => setAdding(true)} />}
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
                    title="ثبت دستورکار"
                    width={sizeConverter(680, 'width')}
                    close={() => setAdding(false)}
                    array={createForm}
                    createEndpoint="api/WorkTask/AddWorkTask"
                    autoCompleteOption={{
                        workTaskType: taskTypeOptions,
                        customerID: lookups.options.customerID,
                        assignedToID: lookups.options.assignedToID,
                    }}
                    addDefaultValue={{ workTaskType: taskTypeOptions.find((o) => o.id === 1002) }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        const payload: Record<string, unknown> = buildPayload(createForm, data, {})
                        // the server's ReportedAt is not nullable: leave it out to mean "now"
                        if (!payload.reportedAt) delete payload.reportedAt
                        return payload
                    }) as any}
                    wrapperFunc={(created) => { list.refetch(); if (created?.id) open(created.id) }}
                    snackbarOpen={snackbarOpen}
                />
            )}
        </Grid>
    )
}
