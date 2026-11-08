import { useState } from 'react'
import { Box, Paper, Tab, Tabs } from '@mui/material'
import { snackbarOpenType } from '@type/snackbarOpen'
import WorkTaskReportTab from '@components/section/reports/WorkTaskReportTab'
import WarrantyReportTab from '@components/section/reports/WarrantyReportTab'
import CustomerBillingTab from '@components/section/reports/CustomerBillingTab'
import { useDevice } from '@hooks/useDevice'

/** The three reports in one page. Every one respects the user's scope on the server (a customer user sees only their own data). */
const ReportsPage = ({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) => {
    const { isMobile } = useDevice()
    const [tab, setTab] = useState<'tasks' | 'warranty' | 'billing'>('tasks')

    return (
        <Box sx={{ width: '100%', px: isMobile ? 1 : 0, pb: 10 }}>
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
                    <Tab value="tasks" label="گزارش فعالیت" />
                    <Tab value="warranty" label="گزارش گارانتی" />
                    <Tab value="billing" label="صورت‌حساب مشتری" />
                </Tabs>
            </Paper>

            {tab === 'tasks' && <WorkTaskReportTab snackbarOpen={snackbarOpen} />}
            {tab === 'warranty' && <WarrantyReportTab />}
            {tab === 'billing' && <CustomerBillingTab snackbarOpen={snackbarOpen} />}
        </Box>
    )
}

export default ReportsPage
