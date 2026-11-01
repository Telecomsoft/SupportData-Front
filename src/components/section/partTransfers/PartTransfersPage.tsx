import { useState } from 'react'
import { Box, Paper, Tab, Tabs } from '@mui/material'
import { snackbarOpenType } from '@type/snackbarOpen'
import PartTransferListTab from '@components/section/partTransfers/PartTransferListTab'
import StockReportTab from '@components/section/partTransfers/StockReportTab'
import MyPartsTab from '@components/section/partTransfers/MyPartsTab'
import { useUserScope } from '@hooks/useUserScope'
import { useDevice } from '@hooks/useDevice'

/** The parts warehouse in one page: the movements, the stock report (staff only) and "my parts". */
const PartTransfersPage = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const { isFieldTechnician } = useUserScope()
    const { isMobile } = useDevice()
    const [tab, setTab] = useState<'transfers' | 'stock' | 'mine'>('transfers')

    return (
        <Box sx={{ width: '100%', px: isMobile ? 1 : 0 }}>
            <Paper elevation={0} sx={{ mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        '& .MuiTabs-indicator': { height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: 'primary.main' },
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 46, color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } },
                    }}
                >
                    <Tab value="transfers" label="انتقال‌ها" />
                    {/* the server refuses the stock report to a field technician, so the tab is not offered */}
                    {!isFieldTechnician && <Tab value="stock" label="گزارش موجودی" />}
                    <Tab value="mine" label="قطعات من" />
                </Tabs>
            </Paper>

            {tab === 'transfers' && <PartTransferListTab snackbarOpen={snackbarOpen} />}
            {tab === 'stock' && !isFieldTechnician && <StockReportTab />}
            {tab === 'mine' && <MyPartsTab />}
        </Box>
    )
}

export default PartTransfersPage
