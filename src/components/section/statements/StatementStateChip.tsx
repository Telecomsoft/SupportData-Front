import { Chip } from '@mui/material'
import { STATEMENT_STATE_COLOR } from '@src/data/type/lookups'

/** The state of a statement as a coloured chip. `statement.stateName` comes from the server; the colour from the state number. */
const StatementStateChip = ({ statement, size = 'small' }: { statement: any; size?: 'small' | 'medium' }) => (
    <Chip size={size} color={STATEMENT_STATE_COLOR[statement?.state] ?? 'default'} label={statement?.stateName ?? '-'} />
)

export default StatementStateChip
