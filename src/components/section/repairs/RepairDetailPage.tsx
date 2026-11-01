/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BuildIcon from '@mui/icons-material/Build'
import BusinessIcon from '@mui/icons-material/Business'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { snackbarOpenType } from '@type/snackbarOpen'
import GeneralDialog from '@components/general/GeneralDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import RepairStateChip from '@components/section/repairs/RepairStateChip'
import RepairInfoTab from '@components/section/repairs/RepairInfoTab'
import RepairLogTab from '@components/section/repairs/RepairLogTab'

import { useGetData } from '@hooks/useGetData'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'
import { useRepairLookups } from '@src/hooks/useRepairLookups'
import { isRepairClosed, REPAIR_TRANSITIONS } from '@src/data/type/lookups'
import { buildRepairAssignForm, buildRepairChangeStateForm, buildRepairEditForm } from '@src/data/dialogArrays/repairForm'

type Opt = { id: number; name: string }
type Dialog = { kind: 'edit' | 'assign' } | { kind: 'state'; transition: (typeof REPAIR_TRANSITIONS)[number] } | null

/** The whole repair page: details, tabs and every action (state, assign, edit). */
const RepairDetailPage = ({ id, snackbarOpen }: { id: number; snackbarOpen: snackbarOpenType }) => {
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { accessCheck, canPerform } = useAccessCheck()
    const lookups = useRepairLookups()

    const repairQuery = useGetData<any>(`api/Repair/GetRepair/${id}`, 'repair-detail', { ids: [String(id)] })
    const r = repairQuery.data?.value

    const [tab, setTab] = useState<'info' | 'log'>('info')
    const [dialog, setDialog] = useState<Dialog>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    // the choices for a "multiple" combo: the known errors of THIS part model (needs "errors" read permission),
    // plus whatever the repair already has (GetRepair sends those with their texts, so they always show)
    const errorOptions = useMemo(() => {
        const all = new Map<number, Opt>()
        const add = (e: any) => all.set(e.id, { id: e.id, name: `${e.code} - ${e.title}` })
        lookups.errorList.filter((e) => e.deviceModelID === r?.deviceModelID).forEach(add)
        ;(r?.errors ?? []).forEach(add)
        ;(r?.errorIDs ?? []).forEach((eid: number) => { if (!all.has(eid)) all.set(eid, { id: eid, name: `خطا #${eid}` }) })
        return [...all.values()]
    }, [lookups.errorList, r])
    const workItemOptions = useMemo(() => {
        const all = new Map<number, Opt>(lookups.options.workItemIDs.map((w) => [w.id, w]))
        ;(r?.workItems ?? []).forEach((w: any) => { if (!all.has(w.id)) all.set(w.id, { id: w.id, name: w.name }) })
        ;(r?.workItemIDs ?? []).forEach((wid: number) => { if (!all.has(wid)) all.set(wid, { id: wid, name: `کار #${wid}` }) })
        return [...all.values()]
    }, [lookups.options.workItemIDs, r])

    const afterAction = () => { repairQuery.refetch(); setRefreshKey((k) => k + 1) }

    if (repairQuery.isLoading || lookups.isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CustomCircularProgress thickness={2} size={60} />
            </Box>
        )
    }
    if (!r) {
        return (
            <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">{repairQuery.data?.errorMessage ?? 'تعمیر پیدا نشد'}</Typography>
            </Paper>
        )
    }

    // ---- what this user may do now. The server checks everything again; this only decides which buttons show ----
    const hasWrite = accessCheck({ accessInfoId: 113, KindAccessInfo: 'writeAccess' })
    const closed = isRepairClosed(r.state)
    const canEdit = hasWrite && !closed
    const canAssign = hasWrite && !closed && canPerform(240)                    // "Repair - See all repairs" is needed to hand out work
    const transitions = hasWrite ? REPAIR_TRANSITIONS.filter((x) => x.from === r.state && (x.permission === 0 || canPerform(x.permission))) : []

    const canOpenTask = accessCheck({ accessInfoId: 111, KindAccessInfo: 'readAccess' })
    const canOpenKiosk = accessCheck({ accessInfoId: 110, KindAccessInfo: 'readAccess' })
    const editForm = buildRepairEditForm({ isMobile, canEditPart: !r.partTransferID, canEditCustomer: !r.kioskID })
    const close = () => setDialog(null)

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
                        <IconButton onClick={() => navigate({ to: '/repairsList' })} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' }, borderRadius: 2 }}>
                            <ArrowForwardIcon />
                        </IconButton>
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">تعمیر #{r.id}</Typography>
                                <RepairStateChip repair={r} />
                                {r.partTransferID && <Chip size="small" variant="outlined" label="از انتقال قطعه" />}
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" sx={{ color: 'text.secondary', typography: 'body2' }}>
                                <Stack direction="row" alignItems="center" gap={0.5}>
                                    <BuildIcon fontSize="small" color="action" />
                                    <span>{r.deviceModelName}</span>
                                    {r.serial && <span dir="ltr">({r.serial})</span>}
                                </Stack>
                                {r.customerName && <Stack direction="row" alignItems="center" gap={0.5}><BusinessIcon fontSize="small" color="action" /><span>{r.customerName}</span></Stack>}
                                {r.assignedToName && <Stack direction="row" alignItems="center" gap={0.5}><EngineeringIcon fontSize="small" color="action" /><span>{r.assignedToName}</span></Stack>}
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        {transitions.map((tr) => (
                            <Button
                                key={`${tr.from}-${tr.to}`}
                                variant={tr.to === 8 || tr.to === 3 ? 'contained' : 'outlined'}
                                color={tr.to === 9 || tr.to === 10 ? 'error' : 'primary'}
                                onClick={() => setDialog({ kind: 'state', transition: tr })}
                                sx={{ borderRadius: 2, boxShadow: 'none' }}
                            >
                                {tr.label}
                            </Button>
                        ))}
                        {canAssign && (
                            <Button startIcon={<PersonAddIcon />} variant="outlined" onClick={() => setDialog({ kind: 'assign' })} sx={{ borderRadius: 2 }}>
                                {r.assignedToID ? 'ارجاع مجدد' : 'ارجاع'}
                            </Button>
                        )}
                        {canEdit && (
                            <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setDialog({ kind: 'edit' })} sx={{ borderRadius: 2 }}>ویرایش</Button>
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
                    <Tab value="log" label="تاریخچه" />
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
                {tab === 'info' && (
                    <RepairInfoTab
                        repair={r}
                        onOpenTask={canOpenTask && r.workTaskID ? () => navigate({ to: `/workTaskDetail/${r.workTaskID}` }) : undefined}
                        onOpenKiosk={canOpenKiosk && r.kioskID ? () => navigate({ to: `/kioskDetail/${r.kioskID}` }) : undefined}
                    />
                )}
                {tab === 'log' && <RepairLogTab repairID={id} refreshKey={refreshKey} states={lookups.options.states} />}
            </Paper>

            {/* ---------------- dialogs ---------------- */}
            {dialog?.kind === 'edit' && (
                <GeneralDialog
                    open="edit"
                    title={`ویرایش تعمیر #${r.id}`}
                    width={sizeConverter(760, 'width')}
                    close={close}
                    array={editForm}
                    editEndpoint="api/Repair/UpdateRepair"
                    autoCompleteOption={{
                        deviceModelID: lookups.options.deviceModelID,
                        customerID: lookups.options.customerID,
                        errorIDs: errorOptions,
                        workItemIDs: workItemOptions,
                    }}
                    defaultValue={{ ...r }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        // the whole current row is the base, so fields that are not in the dialog keep their value.
                        // logs / errors / workItems are only for display (the server fills them on GET), never sent back.
                        const { logs: _logs, errors: _errors, workItems: _workItems, ...base } = r
                        void _logs; void _errors; void _workItems
                        return buildPayload(editForm, data, base)
                    }) as any}
                    wrapperFunc={afterAction}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {dialog?.kind === 'assign' && (() => {
                const form = buildRepairAssignForm()
                return (
                    <GeneralDialog
                        open="add"
                        title={`ارجاع تعمیر #${r.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/Repair/AssignRepair"
                        autoCompleteOption={{ assignedToID: lookups.options.assignedToID }}
                        addDefaultValue={{ assignedToID: lookups.options.assignedToID.find((o) => o.id === r.assignedToID) }}
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { repairID: r.id })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}

            {dialog?.kind === 'state' && (() => {
                const tr = dialog.transition
                // closing a part that came from one of our movements makes the server create the follow-up movement
                const followUp = r.partTransferID && tr.to === 8 ? ' (یک انتقال «خروج از کارگاه» برای قطعه ساخته می‌شود.)'
                    : r.partTransferID && tr.to === 9 ? ' (یک انتقال «اسقاط از کارگاه» برای قطعه ساخته می‌شود.)' : ''
                const form = buildRepairChangeStateForm(tr.confirm + followUp)
                return (
                    <GeneralDialog
                        open="add"
                        title={`${tr.label} - تعمیر #${r.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/Repair/ChangeRepairState"
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { repairID: r.id, newState: tr.to })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}
        </Box>
    )
}

export default RepairDetailPage
