import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from '@tanstack/react-router'
import {
    Alert, alpha, Box, Button, LinearProgress, Paper, Skeleton, Stack, Typography,
} from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import HelpdeskDrafts, { type BankDraft } from '@components/section/workTasks/HelpdeskDrafts'
import { DRAFT_TEXT } from '@src/data/type/helpdeskDraft'
import WorkTaskBulkBar from '@components/section/workTasks/WorkTaskBulkBar'
import WorkTaskDeskRow, { type WorkTaskDeskTask } from '@components/section/workTasks/WorkTaskDeskRow'
import { BranchKiosksContext } from '@components/section/workTasks/KioskSearchField'
import GeneralDialog from '@components/general/GeneralDialog'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useWorkTaskPdf } from '@hooks/useWorkTaskPdf'
import { usePostQuery } from '@hooks/usePostQuery'
import { useDevice } from '@hooks/useDevice'
import { useAccessCheck } from '@utility/accessCheck'
import { useUserScope } from '@hooks/useUserScope'
import { buildWorkTaskCreateForm } from '@src/data/dialogArrays/workTaskForm'
import { isTaskClosed, TASK_STATES, TASK_TYPES } from '@src/data/type/lookups'
import {
    WORK_TASK_DESK_TEXT as text,
    type WorkTaskDeskLane as Lane,
    type WorkTaskDeskSearch,
} from '@src/data/type/workTaskDesk'
import { buildPayload } from '@utility/buildPayload'
import { num } from '@components/section/statements/statementFormat'
import { sizeConverter } from '@utility/sizeConverter'
import type { snackbarOpenType } from '@type/snackbarOpen'

const PAGE_SIZE = 12
const REFRESH_INTERVAL = 60_000
const OPEN_STATES = TASK_STATES.map((state) => state.id).filter((state) => !isTaskClosed(state))
const ACTION_STATES = [...OPEN_STATES, 7]
const LIVE = { refetchInterval: REFRESH_INTERVAL }

const CARD_GRID = 'repeat(auto-fill, minmax(275px, 1fr))'

type WorkTaskPage = { items: WorkTaskDeskTask[]; total: number }
type WorkTaskFilterBody = {
    states: number[]
    overdueOnly?: boolean
    index: number
    number: number
}

const queueBody = (states: number[], number = 1): WorkTaskFilterBody => ({
    states,
    index: 0,
    number,
})

const MetricCard = ({
    label, hint, value, icon, tone, selected, onClick,
}: {
    label: string
    hint: string
    value: number | null
    icon: React.ReactNode
    tone: 'primary' | 'error' | 'warning' | 'success'
    selected: boolean
    onClick: () => void
}) => (
    <Paper
        component="button"
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        elevation={0}
        sx={(theme) => {
            const mainColor = theme.palette[tone].main
            return {
                p: { xs: 0.85, sm: 1 },
                minWidth: 0,
                width: '100%',
                textAlign: 'start',
                color: 'text.primary',
                bgcolor: selected ? alpha(mainColor, 0.06) : 'background.paper',
                border: '1px solid',
                borderColor: selected ? alpha(mainColor, 0.45) : alpha(theme.palette.divider, 0.6),
                borderRadius: 2.75,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.05,
                boxShadow: selected
                    ? `0 6px 14px -4px ${alpha(mainColor, 0.14)}`
                    : '0 2px 6px -2px rgba(15, 23, 42, 0.025)',
                transition: 'all .18s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    borderColor: alpha(mainColor, 0.5),
                    boxShadow: `0 6px 16px -4px ${alpha(mainColor, 0.12)}`,
                },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            }
        }}
    >
        <Box sx={(theme) => {
            const mainColor = theme.palette[tone].main
            return {
                display: 'grid',
                placeItems: 'center',
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: 2,
                color: selected ? '#fff' : mainColor,
                bgcolor: selected ? mainColor : alpha(mainColor, 0.1),
                transition: 'all .18s ease',
                '& .MuiSvgIcon-root': { fontSize: 16.5 },
            }
        }}>
            {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap color="text.secondary" sx={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2, my: 0.05, fontVariantNumeric: 'tabular-nums' }}>
                {value === null ? '—' : num(value)}
            </Typography>
            <Typography noWrap color="text.disabled" sx={{ fontSize: 10, lineHeight: 1.3 }}>
                {hint}
            </Typography>
        </Box>
    </Paper>
)

const PageSkeleton = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: CARD_GRID, gap: 1.15, p: { xs: 1.25, sm: 1.75 } }}>
        {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={124} sx={{ borderRadius: 3 }} />
        ))}
    </Box>
)

export default function WorkTasksDeskPage({
    snackbarOpen, search, onSearchChange,
}: {
    snackbarOpen: snackbarOpenType
    search: WorkTaskDeskSearch
    onSearchChange: (patch: Partial<WorkTaskDeskSearch>, replace?: boolean) => void
}) {
    const { isCustomer, isContractor } = useUserScope()
    const { canPerform } = useAccessCheck()
    const { isMobile } = useDevice()
    const lookups = useWorkTaskLookups()
    const { print: printTask, printingID, printMany, printingMany } = useWorkTaskPdf(snackbarOpen)
    const [selectedIDs, setSelectedIDs] = useState<number[]>([])
    const [showDrafts, setShowDrafts] = useState(false)
    const [draftVersion, setDraftVersion] = useState(0)
    const [draft, setDraft] = useState<BankDraft | null>(null)
    const [adding, setAdding] = useState(false)
    const bulkBarRef = useRef<HTMLDivElement>(null)

    const updateSearch = useCallback((patch: Partial<WorkTaskDeskSearch>, replace = true) => {
        setSelectedIDs([])
        onSearchChange(patch, replace)
    }, [onSearchChange])

    const openCount = usePostQuery<WorkTaskPage>('api/WorkTask/ListWorkTasks', 'desk-action-count', queueBody(ACTION_STATES), LIVE)
    const overdueCount = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks', 'desk-overdue-count', { ...queueBody(OPEN_STATES), overdueOnly: true }, LIVE,
    )
    const unassignedCount = usePostQuery<WorkTaskPage>('api/WorkTask/ListWorkTasks', 'desk-unassigned-count', queueBody([1]), LIVE)
    const approvalCount = usePostQuery<WorkTaskPage>('api/WorkTask/ListWorkTasks', 'desk-approval-count', queueBody([7]), LIVE)

    const body = useMemo<WorkTaskFilterBody>(() => {
        const baseStates: Record<Lane, number[]> = {
            all: ACTION_STATES,
            overdue: OPEN_STATES,
            unassigned: [1],
            approval: [7],
        }
        return {
            states: baseStates[search.lane],
            ...(search.lane === 'overdue' ? { overdueOnly: true } : {}),
            index: (search.page - 1) * PAGE_SIZE,
            number: PAGE_SIZE,
        }
    }, [search.lane, search.page])

    const tasks = usePostQuery<WorkTaskPage>('api/WorkTask/ListWorkTasks', 'desk-worktasks', body, LIVE)
    const canSeeBankDesk = canPerform(201) && canPerform(111) && !isCustomer && !isContractor
    const canPrint = canPerform(115)
    const createForm = useMemo(
        () => buildWorkTaskCreateForm({ isMobile, isCustomer: false, canAssign: canPerform(203) }),
        [isMobile, canPerform],
    )
    const items = useMemo(() => tasks.data?.value?.items ?? [], [tasks.data?.value?.items])
    const total = tasks.data?.value?.total ?? 0
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const page = tasks.data && !tasks.isPlaceholderData ? Math.min(search.page, pageCount) : search.page

    useEffect(() => {
        if (tasks.data && !tasks.isPlaceholderData && page !== search.page) updateSearch({ page })
    }, [page, search.page, tasks.data, tasks.isPlaceholderData, updateSearch])

    const queryError = tasks.isError || Boolean(tasks.data?.error)
    const errorMessage = tasks.data?.errorMessage ?? tasks.error?.message ?? text.listError
    const selectedTasks = items.filter((task) => selectedIDs.includes(task.id))

    const laneTitle: Record<Lane, string> = {
        all: text.allQueue,
        overdue: text.overdueQueue,
        unassigned: text.unassignedQueue,
        approval: text.approvalQueue,
    }

    const refresh = () => {
        void Promise.all([
            openCount.refetch(),
            overdueCount.refetch(),
            unassignedCount.refetch(),
            approvalCount.refetch(),
            tasks.refetch(),
        ])
    }
    const changeLane = (next: Lane) => updateSearch({ lane: next, page: 1 })
    const toggleSelected = (id: number) => {
        setSelectedIDs((selected) => selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id])
    }
    const selectForAssignment = (id: number) => {
        setSelectedIDs([id])
        window.requestAnimationFrame(() => bulkBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
    }
    const openTask = (id: number) => window.open(`/workTaskDetail/${id}`, '_blank', 'noopener')
    const laneMetricCount = (query: typeof openCount) => {
        if (query.isError || query.data?.error) return null
        return query.data?.value?.total ?? null
    }
    const sortedItems = useMemo(() => {
        const sorted = [...items]
        if (search.sort === 'state') sorted.sort((a, b) => a.state - b.state || a.id - b.id)
        if (search.sort === 'deadline') sorted.sort((a, b) => {
            if (!a.dueAt) return 1
            if (!b.dueAt) return -1
            return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
        })
        if (search.sort === 'newest') sorted.sort((a, b) => {
            const reportedDelta = new Date(b.reportedAt ?? 0).getTime() - new Date(a.reportedAt ?? 0).getTime()
            return reportedDelta || b.id - a.id
        })
        return sorted
    }, [items, search.sort])

    const updatedAt = tasks.dataUpdatedAt
        ? new Date(tasks.dataUpdatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        : '—'

    const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape' && selectedIDs.length > 0) {
            setSelectedIDs([])
            event.preventDefault()
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && event.target === event.currentTarget) {
            setSelectedIDs(items.map((item) => item.id))
            event.preventDefault()
        }
    }

    return (
        <Box
            dir="rtl"
            
            sx={(theme) => ({
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: theme.palette.mode === 'dark'
                    ? `radial-gradient(circle at 50% -10%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 55%)`
                    : `radial-gradient(circle at 50% -10%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 55%), radial-gradient(circle at 90% 20%, ${alpha(theme.palette.secondary.main, 0.04)}, transparent 40%)`,
                py: { xs: 1.25, sm: 2 },
                px: { xs: 1.25, sm: 2, lg: 3 },
            })}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1560,
                    mx: 'auto',
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* هدر مینیمال و کرو */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={1}
                    sx={{ mb: 1.5, px: 0.5, flexShrink: 0 }}
                >
                    <Box>
                        <Typography sx={{ fontSize: { xs: 15, sm: 19 }, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                            {text.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.15, lineHeight: 1.45 }}>
                            {text.subtitle}
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/workTasksList"
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: '12px !important' }} />}
                        sx={{
                            borderRadius: 999,
                            px: 1.75,
                            py: 0.5,
                            fontSize: 11.5,
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            borderColor: 'divider',
                            color: 'text.primary',
                            boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
                            '&:hover': { bgcolor: 'action.hover', borderColor: 'text.disabled' },
                        }}
                    >
                        {text.fullManagement}
                    </Button>
                </Stack>

                {canSeeBankDesk && (
                    <Box sx={{ mb: 1.25, flexShrink: 0 }}>
                        <HelpdeskDrafts
                            show={showDrafts}
                            setShow={setShowDrafts}
                            version={draftVersion}
                            loadOnMount
                            compact
                            review={(selectedDraft) => {
                                setDraft(selectedDraft)
                                setAdding(true)
                            }}
                        />
                    </Box>
                )}

                {/* کارت‌های آماری جمع‌وجور */}
                <Box
                    aria-label={text.title}
                    sx={{
                        display: 'grid',
                        gap: 1,
                        mb: 1.5,
                        flexShrink: 0,
                        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
                    }}
                >
                    <MetricCard
                        label={text.totalActionable}
                        hint={text.totalHint}
                        value={laneMetricCount(openCount)}
                        icon={<AssignmentOutlinedIcon />}
                        tone="primary"
                        selected={search.lane === 'all'}
                        onClick={() => changeLane('all')}
                    />
                    <MetricCard
                        label={text.overdue}
                        hint={text.overdueHint}
                        value={laneMetricCount(overdueCount)}
                        icon={<WarningAmberRoundedIcon />}
                        tone="error"
                        selected={search.lane === 'overdue'}
                        onClick={() => changeLane('overdue')}
                    />
                    <MetricCard
                        label={text.unassigned}
                        hint={text.unassignedHint}
                        value={laneMetricCount(unassignedCount)}
                        icon={<PersonOffOutlinedIcon />}
                        tone="warning"
                        selected={search.lane === 'unassigned'}
                        onClick={() => changeLane('unassigned')}
                    />
                    <MetricCard
                        label={text.readyApproval}
                        hint={text.readyApprovalHint}
                        value={laneMetricCount(approvalCount)}
                        icon={<CheckCircleOutlineIcon />}
                        tone="success"
                        selected={search.lane === 'approval'}
                        onClick={() => changeLane('approval')}
                    />
                </Box>

                {/* کانتینر اصلی صف کارها */}
                <Paper
                    component="section"
                    aria-labelledby="work-task-queue-title"
                    elevation={0}
                    sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.55),
                        borderRadius: 3.5,
                        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.75) : alpha('#FFFFFF', 0.85),
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px -4px rgba(15, 23, 42, 0.04)',
                        overflow: 'hidden',
                    })}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                        sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.4, pb: 1, flexShrink: 0 }}
                    >
                        <Box>
                            <Typography id="work-task-queue-title" component="h2" sx={{ fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>
                                {laneTitle[search.lane]}
                            </Typography>
                            <Typography color="text.secondary" sx={{ fontSize: 10.5, mt: 0.15, lineHeight: 1.4 }}>
                                {text.showing} {num(Math.min(total, (search.page - 1) * PAGE_SIZE + 1))}–{num(Math.min(total, search.page * PAGE_SIZE))} {text.of} {num(total)} · {text.refreshedAt}: {updatedAt} · {text.autoRefresh}
                            </Typography>
                        </Box>
                        {tasks.isFetching && <LinearProgress aria-label={text.refresh} sx={{ width: 52, height: 3.5, borderRadius: 99 }} />}
                    </Stack>

                    {selectedTasks.length > 0 && (
                        <Box ref={bulkBarRef} sx={{ px: { xs: 1.5, sm: 2 }, mb: 1, flexShrink: 0 }}>
                            <WorkTaskBulkBar
                                tasks={selectedTasks}
                                technicians={lookups.options.assignedToID}
                                contractors={lookups.options.contractorID}
                                snackbarOpen={snackbarOpen}
                                onDone={() => { setSelectedIDs([]); refresh() }}
                                clearSelection={() => setSelectedIDs([])}
                                onPrint={canPrint ? printMany : undefined}
                                printing={printingMany}
                            />
                        </Box>
                    )}

                    {/* ناحیه اسکرول‌پذیر اختصاصی کارت‌ها */}
                    <Box
                        role="region"
                        tabIndex={0}
                        aria-label={laneTitle[search.lane]}
                        onKeyDown={handleListKeyDown}
                        sx={(theme) => ({
                            flex: 1,
                            minHeight: 0,
                            maxHeight: { xs: '56vh', sm: '60vh', lg: 'calc(100dvh - 320px)' },
                            overflowY: 'auto',
                            px: { xs: 1.25, sm: 2 },
                            py: 0.5,
                            pb: 1.5,
                            outline: 'none',
                            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                            '&::-webkit-scrollbar': { width: 6 },
                            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                            '&::-webkit-scrollbar-thumb': {
                                bgcolor: alpha(theme.palette.text.disabled, 0.35),
                                borderRadius: 999,
                                '&:hover': { bgcolor: alpha(theme.palette.text.disabled, 0.55) },
                            },
                        })}
                    >
                        {queryError ? (
                            <Alert
                                severity="error"
                                icon={<ErrorOutlineIcon fontSize="small" />}
                                action={<Button color="inherit" size="small" onClick={refresh} sx={{ borderRadius: 99 }}>{text.retry}</Button>}
                                sx={{ my: 1.5, borderRadius: 2.5, fontSize: 12 }}
                            >
                                {errorMessage}
                            </Alert>
                        ) : tasks.isLoading ? (
                            <PageSkeleton />
                        ) : items.length === 0 ? (
                            <Stack alignItems="center" gap={0.75} sx={{ py: 5, px: 2 }}>
                                <Box sx={(theme) => ({
                                    width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center',
                                    bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main',
                                })}>
                                    <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{text.emptyTitle}</Typography>
                                <Typography color="text.secondary" sx={{ fontSize: 11.5 }}>{text.emptyDescription}</Typography>
                            </Stack>
                        ) : (
                            <Box sx={{ display: 'grid', gridTemplateColumns: CARD_GRID, gap: 1.15 }}>
                                {sortedItems.map((task) => (
                                    <WorkTaskDeskRow
                                        key={task.id}
                                        task={task}
                                        selected={selectedIDs.includes(task.id)}
                                        snackbarOpen={snackbarOpen}
                                        printing={printingID === task.id}
                                        onToggle={toggleSelected}
                                        onOpen={openTask}
                                        onAssign={selectForAssignment}
                                        onPrint={canPrint ? printTask : undefined}
                                        onStepDone={refresh}
                                    />
                                ))}
                               

                            </Box>
                        )}
                    </Box>

                    {/* فوتر صفحه‌بندی ثابت در پایین باکس */}
                    {/* <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                        sx={(theme) => ({
                            flexShrink: 0,
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            borderTop: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.5),
                            bgcolor: alpha(theme.palette.background.paper, 0.6),
                        })}
                    >
                        <Typography color="text.secondary" sx={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
                            {text.showing} {num(Math.min(total, (search.page - 1) * PAGE_SIZE + 1))}–{num(Math.min(total, search.page * PAGE_SIZE))} {text.of} {num(total)}
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={0.75}>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={page <= 1 || tasks.isFetching}
                                onClick={() => updateSearch({ page: page - 1 }, false)}
                                sx={{ fontSize: 11, py: 0.25, px: 1.25, minHeight: 26, borderRadius: 999, borderColor: 'divider' }}
                            >
                                {text.previousPage}
                            </Button>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, px: 0.5 }}>
                                {text.page} {num(page)} {text.of} {num(pageCount)}
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={page >= pageCount || tasks.isFetching}
                                onClick={() => updateSearch({ page: page + 1 }, false)}
                                sx={{ fontSize: 11, py: 0.25, px: 1.25, minHeight: 26, borderRadius: 999, borderColor: 'divider' }}
                            >
                                {text.nextPage}
                            </Button>
                        </Stack>
                    </Stack> */}
                </Paper>

                {adding && draft && (
                    <BranchKiosksContext.Provider value={draft.kiosks}>
                        <GeneralDialog
                            open="add"
                            title={DRAFT_TEXT.reviewRequest(draft.ticketCode)}
                            width={sizeConverter(680, 'width')}
                            close={() => {
                                setAdding(false)
                                setShowDrafts(true)
                                setDraft(null)
                            }}
                            array={createForm}
                            createEndpoint={`api/WorkTask/AddWorkTask?helpdeskDraftId=${draft.id}`}
                            autoCompleteOption={{
                                workTaskType: TASK_TYPES,
                                customerID: lookups.options.customerID,
                                assignedToID: lookups.options.assignedToID,
                            }}
                            addDefaultValue={{
                                ...(draft.kiosks?.length === 1 ? { kiosk: draft.kiosks[0] } : {}),
                                reportedIssue: draft.reportedIssue,
                                description: draft.description,
                                reportedAt: draft.reportedAt,
                                workTaskType: TASK_TYPES.find((option) => option.id === 1002),
                            }}
                            sendFinalData
                            apiValueGetter={(data: Record<string, unknown>) => {
                                const payload: Record<string, unknown> = buildPayload(createForm, data, {})
                                delete payload.kiosk
                                const kiosk = data.kiosk
                                if (typeof kiosk === 'object' && kiosk !== null && 'id' in kiosk && kiosk.id) {
                                    payload.kioskID = kiosk.id
                                }
                                if (!payload.reportedAt) delete payload.reportedAt
                                return payload
                            }}
                            wrapperFunc={(created) => {
                                setAdding(false)
                                setDraft(null)
                                setDraftVersion((version) => version + 1)
                                refresh()
                                if (created?.id) openTask(created.id)
                            }}
                            snackbarOpen={snackbarOpen}
                        />
                    </BranchKiosksContext.Provider>
                )}
            </Box>
        </Box>
    )
}