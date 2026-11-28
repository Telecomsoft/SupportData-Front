import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from '@tanstack/react-router'
import {
    Alert, Box, Button, Checkbox, Chip, FormControlLabel, IconButton, InputAdornment, LinearProgress, MenuItem,
    Paper, Skeleton, Stack, Switch, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import SearchIcon from '@mui/icons-material/Search'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import HelpdeskDrafts, { type BankDraft } from '@components/section/workTasks/HelpdeskDrafts'
import { DRAFT_TEXT } from '@src/data/type/helpdeskDraft'
import WorkTaskBulkBar from '@components/section/workTasks/WorkTaskBulkBar'
import WorkTaskDeskRow, { type WorkTaskDeskTask } from '@components/section/workTasks/WorkTaskDeskRow'
import { BranchKiosksContext } from '@components/section/workTasks/KioskSearchField'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import GeneralDialog from '@components/general/GeneralDialog'
import JalaliFilterDate from '@components/general/JalaliFilterDate'
import StyledTextField from '@components/general/input/StyledTextField'
import { useWorkTaskLookups } from '@hooks/useWorkTaskLookups'
import { useWorkTaskPdf } from '@hooks/useWorkTaskPdf'
import { usePostQuery } from '@hooks/usePostQuery'
import { useDevice } from '@hooks/useDevice'
import { useAccessCheck } from '@utility/accessCheck'
import { useUserScope } from '@hooks/useUserScope'
import { buildWorkTaskCreateForm } from '@src/data/dialogArrays/workTaskForm'
import { isTaskClosed, TASK_STATES, TASK_TYPES } from '@src/data/type/lookups'
import {
    WORK_TASK_DESK_SORT_OPTIONS,
    WORK_TASK_DESK_TEXT as text,
    type WorkTaskDeskDensity as Density,
    type WorkTaskDeskLane as Lane,
    type WorkTaskDeskSearch,
    type WorkTaskDeskSortMode as SortMode,
} from '@src/data/type/workTaskDesk'
import { buildPayload } from '@utility/buildPayload'
import { num } from '@components/section/statements/statementFormat'
import { sizeConverter } from '@utility/sizeConverter'
import type { snackbarOpenType } from '@type/snackbarOpen'

const PAGE_SIZE = 12
const REFRESH_INTERVAL = 60_000
const OPEN_STATES = TASK_STATES.map((state) => state.id).filter((state) => !isTaskClosed(state))
const ACTION_STATES = [...OPEN_STATES, 7]

type WorkTaskPage = { items: WorkTaskDeskTask[]; total: number }
type WorkTaskFilterBody = {
    id?: number
    states: number[]
    types?: number[]
    customerID?: number
    assignedToID?: number
    kioskSerial?: string
    branchCode?: string
    branchName?: string
    reportedFrom?: string
    reportedTo?: string
    text?: string
    overdueOnly?: boolean
    index: number
    number: number
}

const asNumber = (value: unknown) => {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

const queueBody = (states: number[], number = 1): WorkTaskFilterBody => ({
    states,
    index: 0,
    number,
})

const toLatinDigits = (value: string) =>
    value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))

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
        sx={(theme) => ({
            p: { xs: 1.25, sm: 1.75 },
            minWidth: 0,
            width: '100%',
            textAlign: 'start',
            color: 'text.primary',
            bgcolor: selected ? `${theme.palette[tone].main}0D` : 'background.paper',
            border: '1px solid',
            borderColor: selected ? `${theme.palette[tone].main}80` : 'divider',
            borderRadius: 1.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            transition: 'border-color .16s ease, box-shadow .16s ease',
            '&:hover': { borderColor: `${theme.palette[tone].main}90`, boxShadow: `0 4px 16px ${theme.palette[tone].main}12` },
            '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        })}
    >
        <Box sx={(theme) => ({
            display: 'grid', placeItems: 'center', width: 40, height: 40, flexShrink: 0, borderRadius: 1.25,
            color: `${tone}.main`, bgcolor: `${theme.palette[tone].main}18`,
        })}>
            {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap>{label}</Typography>
            <Typography variant="h5" fontWeight={800} lineHeight={1.35} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {value === null ? '—' : num(value)}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{hint}</Typography>
        </Box>
        {selected && <Box sx={{ width: 6, height: 30, borderRadius: 5, bgcolor: `${tone}.main` }} />}
    </Paper>
)

const PageSkeleton = () => (
    <Stack gap={1.25} sx={{ p: 2 }}>
        {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} variant="rounded" height={72} />)}
    </Stack>
)

const SortField = ({ value, onChange }: { value: SortMode; onChange: (value: SortMode) => void }) => (
    <StyledTextField select size="small" fullWidth label={text.sort} value={value}
        onChange={(event) => onChange(event.target.value as SortMode)}>
        {WORK_TASK_DESK_SORT_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
    </StyledTextField>
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
    const [searchText, setSearchText] = useState('')
    const [selectedIDs, setSelectedIDs] = useState<number[]>([])
    const [showDrafts, setShowDrafts] = useState(false)
    const [draftVersion, setDraftVersion] = useState(0)
    const [draft, setDraft] = useState<BankDraft | null>(null)
    const [adding, setAdding] = useState(false)
    const [autoRefresh, setAutoRefresh] = useState(true)
    const bulkBarRef = useRef<HTMLDivElement>(null)

    const updateSearch = useCallback((patch: Partial<WorkTaskDeskSearch>, replace = true) => {
        setSelectedIDs([])
        onSearchChange(patch, replace)
    }, [onSearchChange])
    useEffect(() => setSearchText(search.q), [search.q])
    useEffect(() => {
        if (searchText === search.q) return
        const timer = window.setTimeout(() => updateSearch({ q: searchText, page: 1 }), 350)
        return () => window.clearTimeout(timer)
    }, [search.q, searchText, updateSearch])

    const openCount = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks', 'desk-action-count', queueBody(ACTION_STATES), { refetchInterval: autoRefresh ? REFRESH_INTERVAL : false },
    )
    const overdueCount = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks', 'desk-overdue-count', { ...queueBody(OPEN_STATES), overdueOnly: true },
        { refetchInterval: autoRefresh ? REFRESH_INTERVAL : false },
    )
    const unassignedCount = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks', 'desk-unassigned-count', queueBody([1]),
        { refetchInterval: autoRefresh ? REFRESH_INTERVAL : false },
    )
    const approvalCount = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks', 'desk-approval-count', queueBody([7]),
        { refetchInterval: autoRefresh ? REFRESH_INTERVAL : false },
    )

    const body = useMemo<WorkTaskFilterBody>(() => {
        const baseStates: Record<Lane, number[]> = {
            all: ACTION_STATES,
            overdue: OPEN_STATES,
            unassigned: [1],
            approval: [7],
        }
        const rawQuery = search.q.trim().replace(/^#/, '')
        const normalizedQuery = toLatinDigits(rawQuery)
        const numericID = /^\d+$/.test(normalizedQuery) ? Number(normalizedQuery) : undefined
        const serialQuery = !numericID && /^[a-z0-9-]+$/i.test(normalizedQuery) && /[a-z]/i.test(normalizedQuery) ? normalizedQuery : undefined
        const branch = search.branch.trim()
        const branchCode = /^\d+$/.test(toLatinDigits(branch)) ? toLatinDigits(branch) : undefined
        const branchName = branch && !branchCode ? branch : undefined
        const states = search.status ? [search.status] : baseStates[search.lane]

        return {
            states,
            ...(numericID ? { id: numericID } : {}),
            ...(search.type ? { types: [search.type] } : {}),
            ...(search.customer ? { customerID: search.customer } : {}),
            ...(search.assignee ? { assignedToID: search.assignee } : {}),
            ...(serialQuery ? { kioskSerial: serialQuery } : {}),
            ...(branchCode ? { branchCode } : {}),
            ...(branchName ? { branchName } : {}),
            ...(search.from ? { reportedFrom: search.from } : {}),
            ...(search.to ? { reportedTo: search.to } : {}),
            ...(rawQuery && !numericID && !serialQuery ? { text: rawQuery } : {}),
            ...(search.lane === 'overdue' ? { overdueOnly: true } : {}),
            index: (search.page - 1) * PAGE_SIZE,
            number: PAGE_SIZE,
        }
    }, [search])

    const tasks = usePostQuery<WorkTaskPage>(
        'api/WorkTask/ListWorkTasks',
        'desk-worktasks',
        body,
        { refetchInterval: autoRefresh ? REFRESH_INTERVAL : false },
    )
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
    const allOnPageSelected = items.length > 0 && selectedTasks.length === items.length

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
        // TODO: move sorting to the server once ListWorkTasks accepts a sort field; this only sorts the loaded page.
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
        <Box dir="rtl" sx={{ width: '100%', maxWidth: 1600, mx: 'auto', p: { xs: 1.25, sm: 2, lg: 2.5 }, pb: 5 }}>
            <Paper
                component="header"
                elevation={0}
                sx={(theme) => ({
                    p: { xs: 1.5, sm: 2 },
                    mb: 1.5,
                    overflow: 'hidden',
                    position: 'relative',
                    color: 'common.white',
                    borderRadius: 1.5,
                    background: `linear-gradient(112deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 72%, ${theme.palette.secondary.dark} 130%)`,
                    '&:after': {
                        content: '""', position: 'absolute', width: 180, height: 180, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,.14)', insetBlockStart: -120, insetInlineStart: -35,
                        boxShadow: '0 0 0 24px rgba(255,255,255,.035), 0 0 0 52px rgba(255,255,255,.025)',
                    },
                })}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" gap={1.25} sx={{ position: 'relative', zIndex: 1 }}>
                    <Box>
                        <Typography component="h1" variant="h5" fontWeight={800}>{text.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.82)' }}>{text.subtitle}</Typography>
                    </Box>
                    <Stack direction="row" gap={1} alignItems="center">
                        <Tooltip title={text.refresh}>
                            <span>
                                <IconButton
                                    onClick={refresh}
                                    disabled={tasks.isFetching}
                                    aria-label={text.refresh}
                                    sx={{
                                        color: 'common.white',
                                        border: '1px solid rgba(255,255,255,.72)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,.12)' },
                                        '&:focus-visible': { outline: '3px solid #fff', outlineOffset: 2 },
                                    }}
                                >
                                    {tasks.isFetching ? <CustomCircularProgress size={20} thickness={3} /> : <AutorenewIcon />}
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Button
                            component={Link}
                            to="/workTasksList"
                            variant="outlined"
                            sx={{
                                color: '#fff',
                                borderColor: 'rgba(255,255,255,.75)',
                                fontWeight: 700,
                                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' },
                                '&:focus-visible': { outline: '3px solid #fff', outlineOffset: 2 },
                            }}
                        >
                            {text.advancedList}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {canSeeBankDesk && (
                <Box sx={{ mb: 1.5 }}>
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

            <Box
                aria-label={text.title}
                sx={{
                    display: 'grid',
                    gap: 1,
                    mb: 1.5,
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

            <Paper component="section" aria-labelledby="work-task-queue-title" elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'visible' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={0.75} sx={{ px: { xs: 1.25, sm: 2 }, pt: 1.5 }}>
                    <Box>
                        <Typography id="work-task-queue-title" component="h2" variant="h6" fontWeight={750}>{laneTitle[search.lane]}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {text.showing} {num(Math.min(total, (search.page - 1) * PAGE_SIZE + 1))}–{num(Math.min(total, search.page * PAGE_SIZE))} {text.of} {num(total)} · {text.refreshedAt}: {updatedAt}
                        </Typography>
                    </Box>
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        <FormControlLabel
                            control={<Switch size="small" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} inputProps={{ 'aria-label': text.autoRefresh }} />}
                            label={<Typography variant="caption">{text.autoRefresh}</Typography>}
                            sx={{ m: 0 }}
                        />
                        {tasks.isFetching && <LinearProgress aria-label={text.refresh} sx={{ width: 46, borderRadius: 5 }} />}
                    </Stack>
                </Stack>

                <Box
                    component="form"
                    aria-label={text.filterForm}
                    onSubmit={(event) => event.preventDefault()}
                    sx={{
                        display: 'grid',
                        gap: 1,
                        p: { xs: 1.25, sm: 2 },
                        gridTemplateColumns: {
                            xs: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(4, minmax(0, 1fr))',
                            xl: 'repeat(6, minmax(0, 1fr))',
                        },
                    }}
                >
                    <StyledTextField
                        size="small"
                        label={text.search}
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                    />
                    <StyledTextField
                        size="small"
                        label={text.location}
                        value={search.branch}
                        onChange={(event) => updateSearch({ branch: event.target.value, page: 1 })}
                    />
                    <StyledTextField
                        select
                        size="small"
                        label={text.status}
                        value={search.status ?? ''}
                        onChange={(event) => updateSearch({ status: asNumber(event.target.value), page: 1 })}
                    >
                        <MenuItem value="">{text.allStatuses}</MenuItem>
                        {TASK_STATES.map((status) => <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>)}
                    </StyledTextField>
                    <StyledTextField
                        select
                        size="small"
                        label={text.type}
                        value={search.type ?? ''}
                        onChange={(event) => updateSearch({ type: asNumber(event.target.value), page: 1 })}
                    >
                        <MenuItem value="">{text.allTypes}</MenuItem>
                        {TASK_TYPES.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                    </StyledTextField>
                    {!isCustomer && (
                        <StyledTextField
                            select
                            size="small"
                            label={text.customer}
                            value={search.customer ?? ''}
                            onChange={(event) => updateSearch({ customer: asNumber(event.target.value), page: 1 })}
                        >
                            <MenuItem value="">{text.allCustomers}</MenuItem>
                            {lookups.options.customerID.map((customer) => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
                        </StyledTextField>
                    )}
                    {!isCustomer && (
                        <StyledTextField
                            select
                            size="small"
                            label={text.assignee}
                            value={search.assignee ?? ''}
                            onChange={(event) => updateSearch({ assignee: asNumber(event.target.value), page: 1 })}
                        >
                            <MenuItem value="">{text.allAssignees}</MenuItem>
                            {lookups.options.assignedToID.map((person) => <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>)}
                        </StyledTextField>
                    )}
                    <JalaliFilterDate
                        label={text.reportedFrom}
                        value={search.from || null}
                        onChange={(value) => updateSearch({ from: value ?? '', page: 1 })}
                        width="100%"
                    />
                    <JalaliFilterDate
                        label={text.reportedTo}
                        value={search.to || null}
                        onChange={(value) => updateSearch({ to: value ?? '', page: 1 })}
                        endOfDay
                        width="100%"
                    />
                    <SortField value={search.sort} onChange={(sort) => updateSearch({ sort })} />
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={search.density}
                        onChange={(_, density: Density | null) => density && updateSearch({ density })}
                        aria-label={text.density}
                        sx={{ height: 40, gridColumn: { xs: '1 / -1', sm: 'auto' } }}
                    >
                        <ToggleButton value="compact">{text.compact}</ToggleButton>
                        <ToggleButton value="comfortable">{text.comfortable}</ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FilterAltOffIcon />}
                        onClick={() => {
                            setSearchText('')
                            updateSearch({ q: '', status: undefined, type: undefined, customer: undefined, assignee: undefined, branch: '', from: '', to: '', sort: 'deadline', density: 'compact', page: 1 })
                        }}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {text.clearFilters}
                    </Button>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="body2" fontWeight={700}>{text.results}: {num(total)}</Typography>
                        <Typography variant="caption" color="text.secondary">{text.sort}: {text.showing} {num(items.length)}</Typography>
                    </Stack>
                </Box>

                {selectedTasks.length > 0 && (
                    <Box ref={bulkBarRef} sx={{ position: 'sticky', insetBlockStart: 0, zIndex: 4, px: { xs: 1.25, sm: 2 } }}>
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

                <Box
                    role="region"
                    tabIndex={0}
                    aria-label={laneTitle[search.lane]}
                    onKeyDown={handleListKeyDown}
                    sx={{ outline: 'none', '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                >
                    {items.length > 0 && (
                        <Stack direction="row" alignItems="center" gap={0.5} sx={{ px: { xs: 1.25, sm: 2 }, pb: 0.75 }}>
                            <Checkbox
                                size="small"
                                checked={allOnPageSelected}
                                indeterminate={selectedTasks.length > 0 && !allOnPageSelected}
                                onChange={() => setSelectedIDs(allOnPageSelected ? [] : items.map((item) => item.id))}
                                inputProps={{ 'aria-label': text.selectPage }}
                            />
                            <Typography variant="caption" color="text.secondary">{text.selectPage}</Typography>
                            {selectedIDs.length > 0 &&                             <Chip size="small" label={`${num(selectedTasks.length)} ${text.selected}`} />}
                        </Stack>
                    )}
                    {queryError ? (
                        <Alert severity="error" icon={<ErrorOutlineIcon />} action={<Button color="inherit" size="small" onClick={refresh}>{text.retry}</Button>} sx={{ m: 2 }}>
                            {errorMessage}
                        </Alert>
                    ) : tasks.isLoading ? (
                        <PageSkeleton />
                    ) : items.length === 0 ? (
                        <Stack alignItems="center" gap={1} sx={{ py: 6, px: 2 }}>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
                            <Typography fontWeight={700}>{text.emptyTitle}</Typography>
                            <Typography variant="body2" color="text.secondary">{text.emptyDescription}</Typography>
                        </Stack>
                    ) : (
                        <Stack gap={0.75} sx={{ px: { xs: 1.25, sm: 2 }, pb: 1.5 }}>
                            {sortedItems.map((task) => (
                                <WorkTaskDeskRow
                                    key={task.id}
                                    task={task}
                                    selected={selectedIDs.includes(task.id)}
                                    density={search.density}
                                    snackbarOpen={snackbarOpen}
                                    printing={printingID === task.id}
                                    onToggle={toggleSelected}
                                    onOpen={openTask}
                                    onAssign={selectForAssignment}
                                    onPrint={canPrint ? printTask : undefined}
                                    onStepDone={refresh}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} sx={{ p: { xs: 1.25, sm: 2 }, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {text.showing} {num(Math.min(total, (search.page - 1) * PAGE_SIZE + 1))}–{num(Math.min(total, search.page * PAGE_SIZE))} {text.of} {num(total)}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Button
                            size="small"
                            disabled={page <= 1 || tasks.isFetching}
                            onClick={() => updateSearch({ page: page - 1 }, false)}
                        >
                            {text.previousPage}
                        </Button>
                        <Typography variant="caption">{text.page} {num(page)} {text.of} {num(pageCount)}</Typography>
                        <Button
                            size="small"
                            disabled={page >= pageCount || tasks.isFetching}
                            onClick={() => updateSearch({ page: page + 1 }, false)}
                        >
                            {text.nextPage}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button component={Link} to="/workTasksList" size="small">{text.fullManagement}</Button>
            </Stack>

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
    )
}
