import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import ReportsPage from '@components/section/reports/ReportsPage'

export const Route = createFileRoute('/(reports)/reportsList')({
    component: withSnackbar(ReportsPage),
    staticData: { breadcrumb: 'گزارش‌ها' },
})
