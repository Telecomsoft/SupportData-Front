import { Chip } from '@mui/material'
import { REPAIR_STATE_COLOR } from '@src/data/type/lookups'

/** The state of a repair as a coloured chip. `repair.stateName` comes from the server; the colour from the state number. */
const RepairStateChip = ({ repair, size = 'small' }: { repair: any; size?: 'small' | 'medium' }) => (
    <Chip size={size} color={REPAIR_STATE_COLOR[repair?.state] ?? 'default'} label={repair?.stateName ?? '-'} />
)

export default RepairStateChip
