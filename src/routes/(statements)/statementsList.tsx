/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { Box, Button, Fab, Typography } from '@mui/material'
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
import StatementFilterBar, { EMPTY_STATEMENT_FILTER, StatementFilterState } from '@components/section/statements/StatementFilterBar'
import StatementMobileCard from '@components/section/statements/StatementMobileCard'
import StatementStateChip from '@components/section/statements/StatementStateChip'
import {  num } from '@components/section/statements/statementFormat'
import { buildStatementCreateForm } from '@src/data/dialogArrays/statementForm'
import { useStatementLookups } from '@hooks/useStatementLookups'
import { useStatementRules } from '@hooks/useStatementRules'
import { usePostQuery } from '@hooks/usePostQuery'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { dateFn } from '@utility/dateConverter'
import { buildPayload } from '@utility/buildPayload'

export const Route = createFileRoute('/(statements)/statementsList')({
    component: withSnackbar(StatementsList),
    staticData: { breadcrumb: 'صورت‌حساب‌ها' },
})

const PAGE_SIZE = 50

function StatementsList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const lookups = useStatementLookups()
    const rules = useStatementRules()

    const [filter, setFilter] = useState<StatementFilterState>(EMPTY_STATEMENT_FILTER)
    const [serverCtrl, setServerCtrl] = useState<ServerCtrDataType | null>(null)   // the grid's page
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [adding, setAdding] = useState(false)
    const [mobileItems, setMobileItems] = useState<any[]>([])

    const page = serverCtrl?.currentPage ?? 1
    // This is the exact body of POST api/Statement/ListStatements (StatementFilter).
    // The filter has no free-text field, so the grid's own search box only searches the rows already on the page.
    const body = useMemo(() => ({
        contractorID: filter.contractor?.id ?? null,
        states: filter.states.length ? filter.states.map((s) => s.id) : null,
        includeSettled: filter.includeSettled,
        from: filter.from,
        to: filter.to,
        index: (page - 1) * PAGE_SIZE,
        number: PAGE_SIZE,
    }), [filter, page])

    const list = usePostQuery<{ items: any[]; total: number }>('api/Statement/ListStatements', 'list-statements', body)
    const items = list.data?.value?.items ?? []
    const total = list.data?.value?.total ?? 0

    // a new filter always starts from page 1
    const changeFilter = (next: StatementFilterState) => {
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

    const open = (id: number) => navigate({ to: `/statementDetail/${id}` })

    const createForm = buildStatementCreateForm({ isMobile })
    const columns: TelecomColumnsType[] = [
        { field: 'id', headerName: 'شماره', width: sizeConverter(70, 'width') },
        { field: 'caption', headerName: 'عنوان', width: sizeConverter(180, 'width') },
        { field: 'contractorName', headerName: 'پیمانکار', width: sizeConverter(170, 'width') },
        { field: 'fromDate', headerName: 'از تاریخ', width: sizeConverter(110, 'width'), valueGetter: (r) => dateFn(r.fromDate), renderCell: (p) =><Grid container justifyContent="center"><Typography variant="body2">{p.row.fromDate ? dateFn(p.row.fromDate) : ''}</Typography></Grid> },
        { field: 'toDate', headerName: 'تا تاریخ', width: sizeConverter(110, 'width'), valueGetter: (r) => dateFn(r.toDate), renderCell: (p) => <Grid container justifyContent="center"><Typography variant="body2">{p.row.toDate ? dateFn(p.row.toDate) : ''}</Typography></Grid> },
        { field: 'stateName', headerName: 'وضعیت', width: sizeConverter(120, 'width'), renderCell: (p) => <StatementStateChip statement={p.row} /> },
        { field: 'lineCount', headerName: 'ردیف', width: sizeConverter(70, 'width') },
        { field: 'total', headerName: 'جمع کل (ریال)', width: sizeConverter(140, 'width'), valueGetter: (r) => num(r.total) },
        { field: 'otherCosts', headerName: 'هزینه‌ی اضافی', width: sizeConverter(120, 'width'), valueGetter: (r) => (r.otherCosts ? num(r.otherCosts) : '') },
        { field: 'otherPenalties', headerName: 'جریمه‌ی اضافی', width: sizeConverter(120, 'width'), valueGetter: (r) => (r.otherPenalties ? num(r.otherPenalties) : '') },
        { field: 'calculatedAt', headerName: 'زمان محاسبه', width: sizeConverter(150, 'width'), valueGetter: (r) => (r.calculatedAt ? dateFn(r.calculatedAt) : ''), renderCell: (p) => <Grid container justifyContent="center"><Typography variant="body2">{p.row.calculatedAt ? dateFn(p.row.calculatedAt) : ''}</Typography></Grid> },
        { field: 'description', headerName: 'توضیحات', width: sizeConverter(220, 'width') },
    ]

    const filterBar = (
        <StatementFilterBar value={filter} onChange={changeFilter} states={lookups.options.states} contractors={lookups.options.contractorID} isContractor={rules.isContractor} />
    )
    const isLoading = lookups.isLoading || (list.isLoading && !list.data)

    return (
        <Grid container size={12} sx={{ position: 'relative', height: isMobile ? '100dvh' : 'auto', overflow: isMobile ? 'hidden' : 'visible' }}>
            {isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}><CustomCircularProgress thickness={2} size={60} /></Grid>
            ) : isMobile ? (
                // ---------------- mobile: cards + "load more" ----------------
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', pb: 26, gap: 1.5 }}>
                    {filterBar}
                    {mobileItems.map((st) => <StatementMobileCard key={st.id} statement={st} onOpen={() => open(st.id)} />)}
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
                        height={sizeConverter(540, 'height')}
                        data={items}
                        loading={list.isFetching}
                        serverData={{ totalDataCount: total, maxRowInPage: PAGE_SIZE, currentPage: page }}
                        setServerCtrData={setServerCtrl}
                        maxRowInPage={PAGE_SIZE}
                        doubleClickFunc={() => selectedID && open(selectedID)}
                        CustomToolBar={() => (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'مشاهده'} Icon={OpenInNewIcon} disable={!selectedID} clickFunc={() => selectedID && open(selectedID)} />
                                {rules.hasWrite && <DataGridIconProvider toolTipText={'ثبت صورت‌حساب'} Icon={AddIcon} disable={false} clickFunc={() => setAdding(true)} />}
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
                    title="ثبت صورت‌حساب"
                    width={sizeConverter(720, 'width')}
                    close={() => setAdding(false)}
                    array={createForm}
                    createEndpoint="api/Statement/AddStatement"
                    autoCompleteOption={{ contractorID: lookups.options.contractorID }}
                    sendFinalData
                    apiValueGetter={((data: any) => buildPayload(createForm, data, {})) as any}
                    wrapperFunc={(created) => { list.refetch(); if (created?.id) open(created.id) }}
                    snackbarOpen={snackbarOpen}
                />
            )}
        </Grid>
    )
}
