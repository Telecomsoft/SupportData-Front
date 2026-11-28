import { memo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import {
    alpha, Box, Button, Chip, IconButton, Menu, MenuItem, Paper, Stack, Tooltip, Typography,
} from '@mui/material'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import WorkTaskStepButton from '@components/section/workTasks/WorkTaskStepButton'
import { num } from '@components/section/statements/statementFormat'
import { dateFn } from '@utility/dateConverter'
import { TASK_STATE_COLOR } from '@src/data/type/lookups'
import { WORK_TASK_DESK_TEXT as text } from '@src/data/type/workTaskDesk'
import type { snackbarOpenType } from '@type/snackbarOpen'

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
    snackbarOpen: snackbarOpenType
    printing: boolean
    onToggle: (id: number) => void
    onOpen: (id: number) => void
    onAssign: (id: number) => void
    onPrint?: (id: number) => void
    onStepDone: () => void
}

const DAY_MS = 24 * 60 * 60 * 1000
const ICON = 14

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
        days,
        absolute: dateFn(value, false),
        relative: days === 0
            ? overdue ? text.overdueToday : text.today
            : days > 0 ? `${num(days)} ${text.daysLeft}` : `${num(Math.abs(days))} ${text.daysOverdue}`,
        overdue,
    }
}

const typeTone = (name?: string): 'error' | 'info' | 'secondary' | 'default' => {
    const label = cleanLabel(name)
    if (label.includes('خرابی')) return 'error'
    if (label.includes('نصب')) return 'info'
    if (label.includes('بازدید')) return 'secondary'
    return 'default'
}

const StateIcon = ({ state }: { state: number }) => {
    const sx = { fontSize: `${ICON}px !important` }
    switch (state) {
        case 1: return <FiberNewOutlinedIcon sx={sx} />
        case 2: return <AssignmentIndOutlinedIcon sx={sx} />
        case 3: return <BlockOutlinedIcon sx={sx} />
        case 4: return <AutorenewOutlinedIcon sx={sx} />
        case 5: return <Inventory2OutlinedIcon sx={sx} />
        case 7: return <TaskAltOutlinedIcon sx={sx} />
        case 8: return <CheckCircleOutlineIcon sx={sx} />
        default: return <AssignmentOutlinedIcon sx={sx} />
    }
}

const stop = (event: MouseEvent) => event.stopPropagation()

const WorkTaskDeskRow = memo(({
    task, selected, snackbarOpen, printing, onToggle, onOpen, onAssign, onPrint, onStepDone,
}: Props) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const assignee = cleanLabel(task.assignedToName)
    const contractor = cleanLabel(task.contractorName)
    const locationParts = [cleanLabel(task.branchName), cleanLabel(task.customerName)].filter(Boolean)
    const deadline = deadlineInfo(task.dueAt, task.isOverdue)
    const overdue = Boolean(task.isOverdue || deadline?.overdue)
    const chipColor = TASK_STATE_COLOR[task.state] ?? 'default'
    const rowLabel = text.taskLabel(num(task.id), task.stateName ?? '', cleanLabel(task.kioskSerial))
    const kind = cleanLabel(task.typeName)
    const issue = cleanLabel(task.reportedIssue)

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
            elevation={0}
            role="group"
            tabIndex={0}
            aria-label={rowLabel}
            onClick={() => onOpen(task.id)}
            onKeyDown={handleKeyDown}
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                minWidth: 0,
                p: 1.2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: selected
                    ? alpha(theme.palette.primary.main, 0.5)
                    : overdue
                        ? alpha(theme.palette.error.main, 0.25)
                        : alpha(theme.palette.divider, 0.6),
                bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.025)',
                cursor: 'pointer',
                transition: 'all .16s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    borderColor: overdue ? alpha(theme.palette.error.main, 0.45) : alpha(theme.palette.primary.main, 0.4),
                    boxShadow: '0 6px 16px -4px rgba(15, 23, 42, 0.07)',
                },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
            })}
        >
            {/* 1. شماره، نوع کار و وضعیت */}
            <Stack direction="row" alignItems="center" gap={0.6} sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.3, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    <bdi dir="ltr">#{num(task.id)}</bdi>
                </Typography>
                {kind && (
                    <Chip
                        size="small"
                        variant="outlined"
                        color={typeTone(kind)}
                        label={kind}
                        sx={{
                            height: 18,
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 999,
                            '& .MuiChip-label': { px: 0.75 },
                        }}
                    />
                )}
                <Chip
                    size="small"
                    color={chipColor}
                    icon={<StateIcon state={task.state} />}
                    label={task.stateName || '—'}
                    sx={(theme) => ({
                        marginInlineStart: 'auto',
                        height: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 999,
                        flexShrink: 0,
                        ...(chipColor !== 'default' && {
                            bgcolor: alpha(theme.palette[chipColor].main, 0.12),
                            color: theme.palette[chipColor].dark,
                            '& .MuiChip-icon': { color: theme.palette[chipColor].main },
                        }),
                        '& .MuiChip-label': { px: 0.75 },
                    })}
                />
            </Stack>

            {/* 2. ددلاین یا تاخیر (فشرده) */}
            {(overdue || deadline) && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={0.5}
                    sx={(theme) => ({
                        px: overdue ? 0.85 : 0.25,
                        py: overdue ? 0.25 : 0,
                        borderRadius: 1.75,
                        color: overdue ? 'error.main' : deadline!.days <= 1 ? 'warning.main' : 'text.secondary',
                        bgcolor: overdue ? alpha(theme.palette.error.main, 0.08) : 'transparent',
                    })}
                >
                    {overdue ? <WarningAmberRoundedIcon sx={{ fontSize: ICON }} /> : <ScheduleOutlinedIcon sx={{ fontSize: ICON }} />}
                    <Typography noWrap sx={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.3 }}>
                        {overdue ? (deadline?.overdue ? deadline.relative : text.overdue) : deadline!.relative}
                    </Typography>
                    {deadline && (
                        <Typography noWrap sx={{ fontSize: 9.5, marginInlineStart: 'auto', opacity: 0.8 }}>
                            {deadline.absolute}
                        </Typography>
                    )}
                </Stack>
            )}

            {/* 3. کیوسک و موقعیت در یک بلوک جمع‌وجور */}
            <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35 }}>
                    {text.kiosk} <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums' }}>{cleanLabel(task.kioskSerial) || '—'}</bdi>
                </Typography>
                <Typography noWrap color="text.secondary" sx={{ fontSize: 10.5, lineHeight: 1.35 }}>
                    {locationParts.length ? locationParts.join(' · ') : '—'}
                </Typography>
            </Box>

            {/* 4. شرح مشکل (بدون فضای خالی اضافه) */}
            <Tooltip title={issue} placement="top" disableHoverListener={!issue}>
                <Typography
                    color={issue ? 'text.secondary' : 'text.disabled'}
                    sx={{
                        fontSize: 11,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflowWrap: 'anywhere',
                    }}
                >
                    {issue || text.noDescription}
                </Typography>
            </Tooltip>

            {/* 5. مسئول انجام */}
            <Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 0 }}>
                <EngineeringOutlinedIcon sx={{ fontSize: ICON, flexShrink: 0, color: assignee || contractor ? 'text.secondary' : 'warning.main' }} />
                {assignee || contractor ? (
                    <Typography noWrap color="text.secondary" sx={{ fontSize: 10.5, fontWeight: 500, lineHeight: 1.35 }}>
                        {[assignee, contractor].filter(Boolean).join(' · ')}
                    </Typography>
                ) : (
                    <>
                        <Typography noWrap sx={{ fontSize: 10.5, color: 'warning.main', fontWeight: 700 }}>{text.noAssignee}</Typography>
                        <Button
                            size="small"
                            color="warning"
                            onClick={(event) => { stop(event); onAssign(task.id) }}
                            sx={{ minWidth: 0, px: 0.6, py: 0, fontSize: 10.5, fontWeight: 800, borderRadius: 99, lineHeight: 1.3 }}
                        >
                            {text.assign}
                        </Button>
                    </>
                )}
                {task.reportedAt && (
                    <Typography color="text.disabled" sx={{ fontSize: 9.5, marginInlineStart: 'auto', whiteSpace: 'nowrap' }}>
                        {dateFn(task.reportedAt, false)}
                    </Typography>
                )}
            </Stack>

            {/* 6. دکمه‌های اقدام */}
            <Stack
                direction="row"
                alignItems="center"
                gap={0.4}
                sx={(theme) => ({
                    mt: 'auto',
                    pt: 0.75,
                    borderTop: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.45),
                })}
            >
                <Box
                    sx={{
                        '& .MuiButton-root': {
                            fontSize: 11,
                            fontWeight: 700,
                            py: 0.2,
                            px: 1.25,
                            minHeight: 24,
                            minWidth: 0,
                            borderRadius: 999,
                            boxShadow: 'none',
                        },
                    }}
                    onClick={stop}
                >
                    <WorkTaskStepButton task={task} snackbarOpen={snackbarOpen} onDone={onStepDone} variant="contained" />
                </Box>
                <Box sx={{ flex: 1 }} />
                <Tooltip title={text.viewDetails}>
                    <IconButton
                        size="small"
                        color="primary"
                        aria-label={`${text.viewDetails} ${num(task.id)}`}
                        onClick={(event) => { stop(event); onOpen(task.id) }}
                        sx={(theme) => ({
                            p: 0.5,
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.14) },
                        })}
                    >
                        <OpenInNewIcon sx={{ fontSize: ICON }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={text.moreActions}>
                    <IconButton
                        size="small"
                        aria-label={text.moreActions}
                        onClick={(event) => { stop(event); setMenuAnchor(event.currentTarget) }}
                        sx={{ p: 0.5 }}
                    >
                        <MoreVertIcon sx={{ fontSize: ICON }} />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    onClick={stop}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 2.5,
                                mt: 0.5,
                                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                                '& .MuiMenuItem-root': { fontSize: 12, minHeight: 32, borderRadius: 1.5, mx: 0.5 },
                            },
                        },
                    }}
                >
                    <MenuItem onClick={() => { setMenuAnchor(null); onOpen(task.id) }}>{text.viewDetails}</MenuItem>
                    {onPrint && <MenuItem disabled={printing} onClick={() => { setMenuAnchor(null); onPrint(task.id) }}>{text.print}</MenuItem>}
                </Menu>
            </Stack>
        </Paper>
    )
})

WorkTaskDeskRow.displayName = 'WorkTaskDeskRow'

export default WorkTaskDeskRow