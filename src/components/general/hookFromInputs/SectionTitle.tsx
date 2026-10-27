/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Divider, Typography } from '@mui/material'

/** A heading row inside a long dialog. Declare it with `noValue: true`, so it is never sent to the server. */
const SectionTitle = ({ item }: any) => (
    <Grid size={12} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
        <Divider />
    </Grid>
)

export default SectionTitle