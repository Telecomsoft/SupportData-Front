/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, Button, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import CalculateIcon from '@mui/icons-material/Calculate'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PrintIcon from '@mui/icons-material/Print'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { snackbarOpenType } from '@type/snackbarOpen'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import StatementStateChip from '@components/section/statements/StatementStateChip'
import StatementInfoTab from '@components/section/statements/StatementInfoTab'
import StatementLinesTab from '@components/section/statements/StatementLinesTab'
import UnbilledTasksTab from '@components/section/statements/UnbilledTasksTab'
import StatementActionDialog, { StatementAction } from '@components/section/statements/StatementActionDialog'
import StatementPrintDialog from '@components/section/statements/StatementPrintDialog'
import { day, rial } from '@components/section/statements/statementFormat'
import { buildStatementEditForm } from '@src/data/dialogArrays/statementForm'
import { STATEMENT_STATE } from '@src/data/type/lookups'
import { useStatementLookups } from '@hooks/useStatementLookups'
import { useStatementRules } from '@hooks/useStatementRules'
import { useGetData } from '@hooks/useGetData'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'

type Dialog = { kind: 'edit' } | { kind: 'print' } | { kind: 'action'; action: StatementAction } | null

/** The whole statement page: details, lines, unbilled tasks and every action (calculate, state, edit, delete, print). */
const StatementDetailPage = ({ id, snackbarOpen }: { id: number; snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const lookups = useStatementLookups()
    const rules = useStatementRules()

    const query = useGetData<any>(`api/Statement/GetStatement/${id}`, 'statement-detail', { ids: [String(id)] })
    const s = query.data?.value

    const [tab, setTab] = useState<'info' | 'lines' | 'unbilled'>('info')
    const [dialog, setDialog] = useState<Dialog>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const afterAction = (kind?: StatementAction['kind']) => {
        if (kind === 'delete') return navigate({ to: '/statementsList' })      // it is gone: nothing left to show
        setDialog(null)
        query.refetch()
        setRefreshKey((k) => k + 1)
    }

    if (query.isLoading || lookups.isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CustomCircularProgress thickness={2} size={60} />
            </Box>
        )
    }
    if (!s) {
        return (
            <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">{query.data?.errorMessage ?? 'صورت‌حساب پیدا نشد'}</Typography>
            </Paper>
        )
    }

    const locked = s.state >= STATEMENT_STATE.APPROVED                           // contractor, period and form filter are frozen (S3)
    const editForm = buildStatementEditForm({ isMobile, locked })
    // the current contractor must always be a choice, even if the contractor lists did not load or he is inactive now
    const contractorOptions = lookups.options.contractorID.some((c) => c.id === s.contractorID)
        ? lookups.options.contractorID
        : [...lookups.options.contractorID, { id: s.contractorID, name: s.contractorName ?? `#${s.contractorID}` }]
    const close = () => setDialog(null)
    const act = (action: StatementAction) => setDialog({ kind: 'action', action })

    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: 'auto', md: 'calc(100vh - 120px)' },
                display: 'flex', flexDirection: 'column',
                pb: isMobile ? 12 : 2, px: { xs: 2, md: 3 }, pt: 2, overflow: 'hidden',
            }}
        >
            {/* header: fixed, no scroll */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
                    <Stack direction="row" alignItems="center" gap={2}>
                        <IconButton onClick={() => navigate({ to: '/statementsList' })} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' }, borderRadius: 2 }}>
                            <ArrowForwardIcon />
                        </IconButton>
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">صورت‌حساب #{s.id}{s.caption ? ` — ${s.caption}` : ''}</Typography>
                                <StatementStateChip statement={s} />
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" sx={{ color: 'text.secondary', typography: 'body2' }}>
                                <Stack direction="row" alignItems="center" gap={0.5}><EngineeringIcon fontSize="small" color="action" /><span>{s.contractorName}</span></Stack>
                                <span>{day(s.fromDate)} تا {day(s.toDate)}</span>
                                <b>{rial(s.total)}</b>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        {rules.canCalculate(s) && (
                            <Button startIcon={<CalculateIcon />} variant="contained" onClick={() => act({ kind: 'calculate' })} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                                {s.state === STATEMENT_STATE.NEW ? 'محاسبه' : 'محاسبه‌ی مجدد'}
                            </Button>
                        )}
                        {rules.transitions(s).map((tr) => (
                            <Button
                                key={`${tr.from}-${tr.to}`}
                                variant={tr.to === STATEMENT_STATE.APPROVED || tr.to === STATEMENT_STATE.SETTLED ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => act({ kind: 'state', to: tr.to, label: tr.label, confirm: tr.confirm })}
                                sx={{ borderRadius: 2, boxShadow: 'none' }}
                            >
                                {tr.label}
                            </Button>
                        ))}
                        {rules.canEdit(s) && (
                            <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setDialog({ kind: 'edit' })} sx={{ borderRadius: 2 }}>ویرایش</Button>
                        )}
                        <Button startIcon={<PrintIcon />} variant="outlined" onClick={() => setDialog({ kind: 'print' })} sx={{ borderRadius: 2 }}>چاپ</Button>
                        {rules.canDelete(s) && (
                            <Button startIcon={<DeleteOutlineIcon />} variant="outlined" color="error" onClick={() => act({ kind: 'delete' })} sx={{ borderRadius: 2 }}>حذف</Button>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {/* tabs */}
            <Paper elevation={0} sx={{ mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', flexShrink: 0 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        '& .MuiTabs-indicator': { height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: 'primary.main' },
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 46, color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } },
                    }}
                >
                    <Tab value="info" label="مشخصات کلی" />
                    <Tab value="lines" label={`ردیف‌ها (${s.lineCount ?? 0})`} />
                    {/* the server refuses this list to a contractor user, so the tab is not offered */}
                    {rules.canSeeUnbilled && <Tab value="unbilled" label="کارهای تسویه‌نشده" />}
                </Tabs>
            </Paper>

            {/* tab content: own scroll */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1, overflowY: 'auto', borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', p: 3, mb: 2,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.02)',
                    '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '4px' },
                }}
            >
                {tab === 'info' && <StatementInfoTab statement={s} />}
                {tab === 'lines' && (
                    <StatementLinesTab lines={s.lines ?? []} onOpenTask={rules.canOpenWorkTask ? (taskID) => navigate({ to: `/workTaskDetail/${taskID}` }) : undefined} />
                )}
                {tab === 'unbilled' && rules.canSeeUnbilled && (
                    <UnbilledTasksTab
                        contractorID={s.contractorID}
                        fromDate={s.fromDate}
                        toDate={s.toDate}
                        refreshKey={refreshKey}
                        onOpenTask={rules.canOpenWorkTask ? (taskID) => navigate({ to: `/workTaskDetail/${taskID}` }) : undefined}
                    />
                )}
            </Paper>

            {/* ---------------- dialogs ---------------- */}
            {dialog?.kind === 'edit' && (
                <GeneralDialog
                    open="edit"
                    title={`ویرایش صورت‌حساب #${s.id}`}
                    width={sizeConverter(760, 'width')}
                    close={close}
                    array={editForm}
                    editEndpoint="api/Statement/UpdateStatement"
                    autoCompleteOption={{ contractorID: contractorOptions }}
                    defaultValue={{ ...s }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        // the whole current row is the base, so fields that are not in the dialog keep their value.
                        // `lines` is only for display (the server fills it on GET), never sent back; the total is never sent as typed.
                        const { lines: _lines, ...base } = s
                        void _lines
                        return buildPayload(editForm, data, base)
                    }) as any}
                    wrapperFunc={() => afterAction()}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {dialog?.kind === 'action' && (
                <StatementActionDialog action={dialog.action} statement={s} close={close} onDone={afterAction} snackbarOpen={snackbarOpen} />
            )}

            {dialog?.kind === 'print' && <StatementPrintDialog statementID={s.id} close={close} />}
        </Box>
    )
}

export default StatementDetailPage
