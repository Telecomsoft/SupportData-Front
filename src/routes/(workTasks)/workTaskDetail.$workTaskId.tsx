/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Box, Button, Chip, IconButton, Menu, MenuItem, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BusinessIcon from '@mui/icons-material/Business'
import AtmIcon from '@mui/icons-material/Atm'
import EngineeringIcon from '@mui/icons-material/Engineering'
import LockIcon from '@mui/icons-material/Lock'
import { SNACKBAR_SEVERITIES, withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import GeneralDialog from '@components/general/GeneralDialog'
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import WorkTaskStateChip from '@components/section/workTasks/WorkTaskStateChip'
import WorkTaskInfoTab from '@components/section/workTasks/WorkTaskInfoTab'
import WorkTaskCostsTab from '@components/section/workTasks/WorkTaskCostsTab'
import WorkTaskLogTab from '@components/section/workTasks/WorkTaskLogTab'
import {
    buildAssignForm, buildChangeStateForm, buildCorrectDatesForm, buildPaymentForm, buildReplacePartForm, buildWorkTaskEditForm,
} from '@src/data/dialogArrays/workTaskForm'
import { isTaskClosed, TASK_TRANSITIONS, TASK_TYPES, WORK_MODES } from '@src/data/type/lookups'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useGetData } from '@hooks/useGetData'
import { usePutData } from '@hooks/usePutData'
import { useUserScope } from '@hooks/useUserScope'
import { useAccessCheck } from '@utility/accessCheck'
import { useDevice } from '@hooks/useDevice'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'

export const Route = createFileRoute('/(workTasks)/workTaskDetail/$workTaskId')({
    component: withSnackbar(WorkTaskDetail),
    staticData: { breadcrumb: 'مشخصات دستورکار' },
})

type Opt = { id: number; name: string }
type Dialog =
    | { kind: 'edit' | 'assign' | 'dates' | 'payment' | 'form' | 'part' }
    | { kind: 'state'; transition: (typeof TASK_TRANSITIONS)[number] }
    | null

// the options of a "multiple" combo must contain every id the task already has, or saving would silently drop it
const withMissing = (options: Opt[], ids: number[] | null | undefined, make: (id: number) => Opt) => {
    const have = new Set(options.map((o) => o.id))
    return [...options, ...(ids ?? []).filter((id) => !have.has(id)).map(make)]
}

function WorkTaskDetail({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { workTaskId } = Route.useParams()
    const id = Number(workTaskId)
    const navigate = useNavigate()
    const { isMobile } = useDevice()
    const { accessCheck, canPerform } = useAccessCheck()
    const { isCustomer, isFieldTechnician, personnelID } = useUserScope()
    const lookups = useWorkTaskLookups()

    const taskQuery = useGetData<any>(`api/WorkTask/GetWorkTask/${id}`, 'worktask-detail', { ids: [String(id)] })
    const t = taskQuery.data?.value

    // known errors for the device models inside this kiosk (needs "tasks" read, not "errors" read; staff only)
    const suggestions = useGetData<any[]>(`api/Error/SuggestForKiosk/${t?.kioskID}`, 'worktask-error-suggestions', {
        ids: [String(t?.kioskID)], enabled: !!t?.kioskID && !isCustomer,
    })

    const [tab, setTab] = useState<'info' | 'costs' | 'log'>('info')
    const [dialog, setDialog] = useState<Dialog>(null)
    const [menu, setMenu] = useState<HTMLElement | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    // "replace part": the part comes from the TECHNICIAN's own stock (the logged-in technician, else the one the task is assigned to)
    const partTechID: number | null = (isFieldTechnician ? personnelID : t?.assignedToID) ?? null
    const partsOpen = dialog?.kind === 'part'
    const kioskParts = useGetData<any[]>(`api/Kiosk/ListKioskParts/${t?.kioskID}`, 'wt-replace-kiosk-parts', { ids: [String(t?.kioskID)], enabled: partsOpen && !!t?.kioskID })
    const myParts = useGetData<any[]>(`api/PartTransfer/MyParts?technicianID=${partTechID}`, 'wt-replace-my-parts', { ids: [String(partTechID)], enabled: partsOpen && !!partTechID })
    const confirmForm = usePutData<any, any>(`api/WorkTask/ConfirmServiceForm/${id}`, 'wt-confirm-form')

    const editForm = buildWorkTaskEditForm({ isMobile })
    const errorOptions = useMemo(() => {
        const all = new Map<number, Opt>()
        const add = (e: any) => all.set(e.id, { id: e.id, name: `${e.code} - ${e.title}` })
        ;(suggestions.data?.value ?? []).forEach(add)
        ;(t?.errors ?? []).forEach(add)                                              // the ones already chosen (with their text)
        ;(t?.errorIDs ?? []).forEach((eid: number) => { if (!all.has(eid)) all.set(eid, { id: eid, name: `خطا #${eid}` }) })
        return [...all.values()]
    }, [suggestions.data, t])
    const workItemOptions = useMemo(
        () => withMissing(lookups.options.workItemIDs, t?.workItemIDs, (wid) => ({ id: wid, name: `کار #${wid}` })),
        [lookups.options.workItemIDs, t]
    )

    const afterAction = () => { taskQuery.refetch(); setRefreshKey((k) => k + 1) }

    if (taskQuery.isLoading || lookups.isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CustomCircularProgress thickness={2} size={60} />
            </Box>
        )
    }
    if (!t) {
        return (
            <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">{taskQuery.data?.errorMessage ?? 'دستورکار پیدا نشد'}</Typography>
            </Paper>
        )
    }

    // ---- what this user may do now. The server checks everything again; this only decides which buttons show ----
    const hasWrite = accessCheck({ accessInfoId: 111, KindAccessInfo: 'writeAccess' })
    const locked = !!t.isLocked                                   // in an approved statement: nothing can change
    const closed = isTaskClosed(t.state)
    const staff = !isCustomer && !locked
    const canEdit = staff && canPerform(202) && (!closed || canPerform(207))
    const canAssign = staff && canPerform(203) && !closed
    const transitions = staff && hasWrite
        ? TASK_TRANSITIONS.filter((x) => x.from === t.state && (x.permission === 0 || canPerform(x.permission)))
        : []
    const canCorrectDates = staff && canPerform(210)
    const canConfirmForm = staff && canPerform(208) && !t.serviceFormReceived
    const canPay = staff && hasWrite && t.state !== 3
    const canReplacePart = staff && hasWrite && !!t.kioskID && (!closed || canPerform(207))
    const hasMore = canCorrectDates || canConfirmForm || canPay || canReplacePart

    const contractorName = lookups.options.contractorID.find((c) => c.id === t.contractorID)?.name
    const workItemNames = (t.workItemIDs ?? []).map((wid: number) => workItemOptions.find((o) => o.id === wid)?.name).filter(Boolean) as string[]
    const close = () => setDialog(null)
    const pick = (k: 'dates' | 'payment' | 'form' | 'part') => {
        setMenu(null)
        if (k === 'part' && !partTechID) return snackbarOpen('اول دستورکار را به یک تکنسین ارجاع بده؛ قطعه از موجودی او نصب می‌شود', SNACKBAR_SEVERITIES.ERROR)
        setDialog({ kind: k })
    }
    // the confirm dialog treats any reply as success, but the server refuses with HTTP 200 + error != 0,
    // so the request is made here (noApiRequest) and its `error` is checked
    const confirmServiceForm = () =>
        confirmForm.mutate(undefined, {
            onSuccess: (res: any) => {
                if (res?.error === 0) { snackbarOpen('دریافت فرم سرویس ثبت شد', SNACKBAR_SEVERITIES.SUCCESS); afterAction() }
                else snackbarOpen(`${res?.error ?? ''} ${res?.errorMessage ?? ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
            },
            onError: (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR),
        })

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
                        <IconButton onClick={() => navigate({ to: '/workTasksList' })} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' }, borderRadius: 2 }}>
                            <ArrowForwardIcon />
                        </IconButton>
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">دستورکار #{t.id}</Typography>
                                {t.typeName && <Chip size="small" variant="outlined" label={t.typeName} />}
                                <WorkTaskStateChip task={t} />
                                {t.isOverdue && <Chip size="small" color="error" label="دیرکرد" />}
                                {locked && <Chip size="small" icon={<LockIcon />} label="قفل (در صورت‌حساب تایید‌شده)" />}
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" sx={{ color: 'text.secondary', typography: 'body2' }}>
                                {t.kioskSerial && (
                                    <Stack direction="row" alignItems="center" gap={0.5}>
                                        <AtmIcon fontSize="small" color="action" />
                                        {t.kioskID && accessCheck({ accessInfoId: 110, KindAccessInfo: 'readAccess' })
                                            ? <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => navigate({ to: `/kioskDetail/${t.kioskID}` })} dir="ltr">{t.kioskSerial}</Button>
                                            : <span dir="ltr">{t.kioskSerial}</span>}
                                    </Stack>
                                )}
                                {t.customerName && <Stack direction="row" alignItems="center" gap={0.5}><BusinessIcon fontSize="small" color="action" /><span>{t.customerName}</span></Stack>}
                                {t.assignedToName && <Stack direction="row" alignItems="center" gap={0.5}><EngineeringIcon fontSize="small" color="action" /><span>{t.assignedToName}</span></Stack>}
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        {transitions.map((tr) => (
                            <Button
                                key={`${tr.from}-${tr.to}`}
                                variant={tr.to === 3 ? 'outlined' : 'contained'}
                                color={tr.to === 3 ? 'error' : 'primary'}
                                onClick={() => setDialog({ kind: 'state', transition: tr })}
                                sx={{ borderRadius: 2, boxShadow: 'none' }}
                            >
                                {tr.label}
                            </Button>
                        ))}
                        {canAssign && (
                            <Button startIcon={<PersonAddIcon />} variant="outlined" onClick={() => setDialog({ kind: 'assign' })} sx={{ borderRadius: 2 }}>
                                {t.assignedToID ? 'ارجاع مجدد' : 'ارجاع'}
                            </Button>
                        )}
                        {canEdit && (
                            <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setDialog({ kind: 'edit' })} sx={{ borderRadius: 2 }}>ویرایش</Button>
                        )}
                        {hasMore && (
                            <>
                                <IconButton onClick={(e) => setMenu(e.currentTarget)} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}><MoreVertIcon /></IconButton>
                                <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)}>
                                    {canReplacePart && <MenuItem onClick={() => pick('part')}>تعویض قطعه</MenuItem>}
                                    {canConfirmForm && <MenuItem onClick={() => pick('form')}>تایید دریافت فرم سرویس</MenuItem>}
                                    {canPay && <MenuItem onClick={() => pick('payment')}>ثبت پرداخت</MenuItem>}
                                    {canCorrectDates && <MenuItem onClick={() => pick('dates')}>تصحیح تاریخ‌ها</MenuItem>}
                                </Menu>
                            </>
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
                    {!isCustomer && <Tab value="costs" label="هزینه‌ها و پرداخت" />}
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
                {tab === 'info' && <WorkTaskInfoTab task={t} contractorName={contractorName} workItemNames={workItemNames} isCustomer={isCustomer} />}
                {tab === 'costs' && !isCustomer && <WorkTaskCostsTab task={t} />}
                {tab === 'log' && <WorkTaskLogTab taskID={id} refreshKey={refreshKey} />}
            </Paper>

            {/* ---------------- dialogs ---------------- */}
            {dialog?.kind === 'edit' && (
                <GeneralDialog
                    open="edit"
                    title={`ویرایش دستورکار #${t.id}`}
                    width={sizeConverter(820, 'width')}
                    close={close}
                    array={editForm}
                    editEndpoint="api/WorkTask/UpdateWorkTask"
                    autoCompleteOption={{ workTaskType: TASK_TYPES, workMode: WORK_MODES, errorIDs: errorOptions, workItemIDs: workItemOptions }}
                    defaultValue={{ ...t }}
                    sendFinalData
                    apiValueGetter={((data: any) => {
                        // the whole current row is the base, so fields that are not in the dialog keep their value.
                        // `errors` is only for display (the server fills it on GET), never sent back.
                        const { errors: _errors, ...base } = t
                        void _errors
                        return buildPayload(editForm, data, base)
                    }) as any}
                    wrapperFunc={afterAction}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {dialog?.kind === 'assign' && (() => {
                const form = buildAssignForm()
                return (
                    <GeneralDialog
                        open="add"
                        title={`ارجاع دستورکار #${t.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/WorkTask/AssignWorkTask"
                        autoCompleteOption={{ assignedToID: lookups.options.assignedToID, contractorID: lookups.options.contractorID }}
                        addDefaultValue={{
                            assignedToID: lookups.options.assignedToID.find((o) => o.id === t.assignedToID),
                            contractorID: lookups.options.contractorID.find((o) => o.id === t.contractorID),
                        }}
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { workTaskID: t.id })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}

            {dialog?.kind === 'state' && (() => {
                const tr = dialog.transition
                const form = buildChangeStateForm(tr.confirm + (tr.to === 7 && t.workMode === 1 ? ' (چون کار از راه دور بوده، تایید نهایی هم خودکار ثبت می‌شود.)' : ''))
                return (
                    <GeneralDialog
                        open="add"
                        title={`${tr.label} - دستورکار #${t.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/WorkTask/ChangeWorkTaskState"
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { workTaskID: t.id, newState: tr.to })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}

            {dialog?.kind === 'dates' && (() => {
                const form = buildCorrectDatesForm(!!t.finishedAt)
                return (
                    <GeneralDialog
                        open="add"
                        title={`تصحیح تاریخ‌ها - دستورکار #${t.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/WorkTask/CorrectWorkTaskDates"
                        addDefaultValue={{ reportedAt: t.reportedAt, finishedAt: t.finishedAt }}
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { workTaskID: t.id })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}

            {dialog?.kind === 'payment' && (() => {
                const form = buildPaymentForm()
                return (
                    <GeneralDialog
                        open="edit"
                        title={`ثبت پرداخت - دستورکار #${t.id}`}
                        close={close}
                        array={form}
                        editEndpoint="api/WorkTask/RecordWorkTaskPayment"
                        defaultValue={t.isPaid ? { paidAmount: t.paidAmount, paymentRef: t.paymentRef, paidAt: t.paidAt } : {}}
                        sendFinalData
                        apiValueGetter={((d: any) => {
                            const body: Record<string, unknown> = buildPayload(form, d, { workTaskID: t.id })
                            if (!body.paidAt) delete body.paidAt          // empty = now (the server's default)
                            return body
                        }) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}

            {dialog?.kind === 'form' && (
                <GeneralConfirmDialog
                    isDialogOpen="add"
                    dialogTitle={`دستورکار #${t.id}`}
                    confirmMessage="دریافت فرم سرویس امضاشده تایید شود؟"
                    snackBarSuccessMessage="دریافت فرم سرویس ثبت شد"
                    noApiRequest
                    noApiRequestFunc={confirmServiceForm}
                    dialogCloseFun={close}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {dialog?.kind === 'part' && !kioskParts.isLoading && !myParts.isLoading && (() => {
                const form = buildReplacePartForm()
                return (
                    <GeneralDialog
                        open="add"
                        title={`تعویض قطعه - دستورکار #${t.id}`}
                        close={close}
                        array={form}
                        createEndpoint="api/WorkTask/ReplaceKioskPart"
                        autoCompleteOption={{
                            removeKioskPartID: (kioskParts.data?.value ?? []).map((p) => ({ id: p.id, name: `${p.deviceModelName ?? ''}${p.serial ? ` (${p.serial})` : ''}` })),
                            fitDeviceModelID: (myParts.data?.value ?? []).map((p) => ({ id: p.deviceModelID, name: `${p.deviceModelName ?? ''} — موجودی ${p.quantity}` })),
                        }}
                        sendFinalData
                        apiValueGetter={((d: any) => buildPayload(form, d, { workTaskID: t.id, technicianID: partTechID })) as any}
                        wrapperFunc={afterAction}
                        snackbarOpen={snackbarOpen}
                    />
                )
            })()}
        </Box>
    )
}
