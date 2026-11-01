import { Chip } from '@mui/material'
import { PART_STATE_COLOR } from '@src/data/type/lookups'

/** The state of a movement as a coloured chip. `transfer.stateName` comes from the server; the colour from the state number. */
const PartTransferStateChip = ({ transfer, size = 'small' }: { transfer: any; size?: 'small' | 'medium' }) => (
    <Chip size={size} color={PART_STATE_COLOR[transfer?.state] ?? 'default'} label={transfer?.stateName ?? '-'} />
)

export default PartTransferStateChip
