import { Chip } from '@mui/material'
import { TASK_STATE_COLOR } from '@src/data/type/lookups'

/** The state of a task as a coloured chip. `task.stateName` comes from the server; the colour from the state number. */
const WorkTaskStateChip = ({ task, size = 'small' }: { task: any; size?: 'small' | 'medium' }) => (
    <Chip size={size} color={TASK_STATE_COLOR[task?.state] ?? 'default'} label={task?.stateName ?? '-'} />
)

export default WorkTaskStateChip
