import { useState } from 'react'
import { Box, Button, Paper, Tooltip, Typography, useTheme } from '@mui/material'
import { num } from '@components/section/statements/statementFormat'

export type RankItem = { name: string; count: number; color?: string }

/**
 * A ranked list: the name, a bar as long as its share of the biggest one, and the number. Plain HTML instead of a chart library,
 * so it reads the same in right-to-left (the chart put the names on top of the bars) and long names get their own line.
 */
const RankBars = ({ title, subtitle, data, limit = 8 }: { title: string; subtitle?: string; data: RankItem[]; limit?: number }) => {
    const theme = useTheme()
    const [all, setAll] = useState(false)
    const rows = all ? data : data.slice(0, limit)
    const max = Math.max(1, ...data.map((d) => d.count))
    return (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            {data.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>داده‌ای برای نمایش نیست</Typography>
            ) : (
                <Box sx={{ mt: 1.5, display: 'grid', gap: 1.25 }}>
                    {rows.map((r) => (
                        <Box key={r.name} sx={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 36%) 1fr 44px', alignItems: 'center', gap: 1.5 }}>
                            <Tooltip title={r.name} placement="top-start">
                                <Typography variant="body2" noWrap>{r.name}</Typography>
                            </Tooltip>
                            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover', overflow: 'hidden' }}>
                                <Box sx={{ height: '100%', width: `${Math.max(3, (r.count / max) * 100)}%`, borderRadius: 5, bgcolor: r.color ?? theme.palette.primary.main }} />
                            </Box>
                            <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'end' }}>{num(r.count)}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
            {data.length > limit && (
                <Button size="small" onClick={() => setAll((v) => !v)} sx={{ mt: 1.5 }}>
                    {all ? 'نمایش کمتر' : `نمایش همه (${num(data.length)})`}
                </Button>
            )}
        </Paper>
    )
}

export default RankBars
