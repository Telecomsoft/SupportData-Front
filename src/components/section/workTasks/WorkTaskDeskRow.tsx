import { memo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import {
    Box, Button, Checkbox, Chip, IconButton, Menu, MenuItem, Paper, Stack, Tooltip, Typography,
} from '@mui/material'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import WorkTaskStepButton from '@components/section/workTasks/WorkTaskStepButton'
import { num } from '@components/section/statements/statementFormat'
import { dateFn } from '@utility/dateConverter'
import { TASK_STATE_COLOR } from '@src/data/type/lookups'
import { WORK_TASK_DESK_TEXT as text } from '@src/data/type/workTaskDesk'
import type { snackbarOpenType } from '@type/snackbarOpen'

// TODO: add a priority indicator only when WorkTask exposes a persisted priority field.
export type WorkTaskDeskTask = {
    id: number
    state: number
    stateName?: string
    typeName?: string
    kioskSerial?: string
    customerName?: string
    branchName?: string
    reportedIssue?: string
    assignedToName?: string
    contractorName?: string
    reportedAt?: string
    dueAt?: string
    isOverdue?: boolean
    delayDays?: number
    isLocked?: boolean
    serviceFormReceived?: boolean
}

type Props = {
    task: WorkTaskDeskTask
    selected: boolean
    density: 'compact' | 'comfortable'
    snackbarOpen: snackbarOpenType
    printing: boolean
    onToggle: (id: number) => void
    onOpen: (id: number) => void
    onAssign: (id: number) => void
    onPrint?: (id: number) => void
    onStepDone: () => void
}

const DAY_MS = 24 * 60 * 60 * 1000

const cleanLabel = (value?: string | null) => {
    const label = value?.trim()
    return label && label !== '.' && label !== '-' && label !== '—' ? label : ''
}

const deadlineInfo = (value?: string, overdueFromServer = false) => {
    if (!value) return null
    const due = new Date(value)
    if (Number.isNaN(due.getTime())) return null
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const days = Math.round((dueDay.getTime() - today.getTime()) / DAY_MS)
    const overdue = overdueFromServer || days < 0
    return {
        absolute: dateFn(value, false),
        relative: days === 0
            ? overdue ? text.overdueToday : text.today
            : days > 0 ? `${num(days)} ${text.daysLeft}` : `${num(Math.abs(days))} ${text.daysOverdue}`,
        overdue,
    }
}

const StateIcon = ({ state }: { state: number }) => {
    switch (state) {
        case 1: return <FiberNewOutlinedIcon fontSize="small" />
        case 2: return <AssignmentIndOutlinedIcon fontSize="small" />
        case 3: return <BlockOutlinedIcon fontSize="small" />
        case 4: return <AutorenewOutlinedIcon fontSize="small" />
        case 5: return <Inventory2OutlinedIcon fontSize="small" />
        case 7: return <TaskAltOutlinedIcon fontSize="small" />
        case 8: return <CheckCircleOutlineIcon fontSize="small" />
        default: return <AssignmentOutlinedIcon fontSize="small" />
    }
}

const stop = (event: MouseEvent) => event.stopPropagation()

const WorkTaskDeskRow = memo(({
    task, selected, density, snackbarOpen, printing, onToggle, onOpen, onAssign, onPrint, onStepDone,
}: Props) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const assignee = cleanLabel(task.assignedToName)
    const contractor = cleanLabel(task.contractorName)
    const locationParts = [cleanLabel(task.branchName), cleanLabel(task.customerName)].filter(Boolean)
    const deadline = deadlineInfo(task.dueAt, task.isOverdue)
    const overdue = Boolean(task.isOverdue || deadline?.overdue)
    const chipColor = TASK_STATE_COLOR[task.state] ?? 'default'
    const rowLabel = text.taskLabel(num(task.id), task.stateName ?? '', cleanLabel(task.kioskSerial))
    const verticalPadding = density === 'compact' ? 1 : 1.75

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter') {
            event.preventDefault()
            onOpen(task.id)
        } else if (event.key === ' ') {
            event.preventDefault()
            onToggle(task.id)
        }
    }

    return (
        <Paper
            component="article"
            variant="outlined"
            role="group"
            tabIndex={0}
            aria-label={rowLabel}
            onClick={() => onOpen(task.id)}
            onKeyDown={handleKeyDown}
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '40px minmax(0, 1fr) auto', md: '40px minmax(115px, .7fr) minmax(190px, 1.35fr) minmax(100px, .7fr) minmax(125px, .8fr) minmax(145px, .9fr) auto' },
                alignItems: 'center',
                gap: { xs: 1, md: 1.5 },
                p: verticalPadding,
                borderRadius: 1.5,
                borderInlineStart: overdue ? '3px solid' : undefined,
                borderInlineStartColor: overdue ? 'error.main' : undefined,
                cursor: 'pointer',
                transition: 'border-color .15s ease, box-shadow .15s ease, background-color .15s ease',
                '&:hover': { borderColor: overdue ? 'error.light' : 'primary.light', bgcolor: 'action.hover' },
                '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            }}
        >
            <Checkbox
                size="small"
                checked={selected}
                onClick={stop}
                onChange={() => onToggle(task.id)}
                inputProps={{ 'aria-label': `${text.selectTask} ${num(task.id)}` }}
            />
            <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} variant={density === 'compact' ? 'body2' : 'subtitle1'} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    <bdi dir="ltr">#{num(task.id)}</bdi>
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{task.typeName || '—'}</Typography>
            </Box>
            <Box sx={{ minWidth: 0, gridColumn: { xs: '2 / -1', md: 'auto' } }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                    {text.kiosk} <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums' }}>{cleanLabel(task.kioskSerial) || '—'}</bdi>
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {locationParts.length ? locationParts.join(' · ') : '—'}
                </Typography>
            </Box>
            <Stack direction="row" gap={0.75} alignItems="center" flexWrap="wrap" sx={{ gridColumn: { xs: '2 / -1', md: 'auto' } }}>
                <Chip
                    size="small"
                    color={chipColor}
                    icon={<StateIcon state={task.state} />}
                    label={task.stateName || '—'}
                    sx={{ borderRadius: 1.25, '& .MuiChip-icon': { marginInlineStart: 0.75 } }}
                />
                {overdue && (
                    <Chip
                        size="small"
                        color="error"
                        icon={<WarningAmberRoundedIcon fontSize="small" />}
                        label={deadline?.overdue ? deadline.relative : text.overdue}
                        sx={{ borderRadius: 1.25 }}
                    />
                )}
            </Stack>
            <Box sx={{ minWidth: 0, gridColumn: { xs: '2 / -1', md: 'auto' } }}>
                <Typography variant="caption" color="text.secondary" display="block">{text.assignee}</Typography>
                {assignee || contractor ? (
                    <Typography variant="body2" noWrap>{[assignee, contractor].filter(Boolean).join(' · ')}</Typography>
                ) : (
                    <Stack direction="row" alignItems="center" gap={0.75}>
                        <Typography variant="body2" color="text.secondary">{text.noAssignee}</Typography>
                        <Button
                            size="small"
                            color="warning"
                            onClick={(event) => { stop(event); onAssign(task.id) }}
                            sx={{ minWidth: 0, p: 0, justifyContent: 'flex-start', fontWeight: 700 }}
                        >
                            {text.assign}
                        </Button>
                    </Stack>
                )}
            </Box>
            <Box sx={{ minWidth: 0, gridColumn: { xs: '2 / -1', md: 'auto' } }}>
                <Typography variant="caption" color="text.secondary" display="block">
                    {task.reportedAt ? `${text.reported}: ${dateFn(task.reportedAt, false)}` : text.deadline}
                </Typography>
                {deadline ? (
                    <Tooltip title={`${text.deadline}: ${deadline.absolute}`}>
                        <Typography variant="body2" color={overdue ? 'error.main' : 'text.primary'} fontWeight={700} noWrap>
                            {deadline.relative} <Typography component="span" variant="caption" color="text.secondary">/ {deadline.absolute}</Typography>
                        </Typography>
                    </Tooltip>
                ) : <Typography variant="body2" color="text.secondary">—</Typography>}
            </Box>
            <Stack direction="row" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={0.5} sx={{ gridColumn: { xs: '2 / -1', md: 'auto' } }}>
                <WorkTaskStepButton task={task} snackbarOpen={snackbarOpen} onDone={onStepDone} variant="contained" />
                <Tooltip title={text.viewDetails}>
                    <IconButton
                        size="small"
                        color="primary"
                        aria-label={`${text.viewDetails} ${num(task.id)}`}
                        onClick={(event) => { stop(event); onOpen(task.id) }}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={text.moreActions}>
                    <IconButton
                        size="small"
                        aria-label={text.moreActions}
                        onClick={(event) => { stop(event); setMenuAnchor(event.currentTarget) }}
                    >
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    onClick={stop}
                >
                    <MenuItem onClick={() => { setMenuAnchor(null); onOpen(task.id) }}>{text.viewDetails}</MenuItem>
                    {onPrint && <MenuItem disabled={printing} onClick={() => { setMenuAnchor(null); onPrint(task.id) }}>{text.print}</MenuItem>}
                </Menu>
            </Stack>
            <Box sx={{ gridColumn: { xs: '2 / -1', md: '3 / 5' }, minWidth: 0 }}>
                <Tooltip title={cleanLabel(task.reportedIssue) || ''} placement="top">
                    <Typography
                        variant="caption"
                        color={task.reportedIssue ? 'text.secondary' : 'text.disabled'}
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: density === 'compact' ? 1 : 2,
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {cleanLabel(task.reportedIssue) || text.noDescription}
                    </Typography>
                </Tooltip>
            </Box>
        </Paper>
    )
})

WorkTaskDeskRow.displayName = 'WorkTaskDeskRow'

export default WorkTaskDeskRow
