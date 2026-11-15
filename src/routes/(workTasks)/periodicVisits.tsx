import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import PeriodicVisitsPage from '@components/section/visits/PeriodicVisitsPage'

export const Route = createFileRoute('/(workTasks)/periodicVisits')({
    component: withSnackbar(PeriodicVisitsPage),
    staticData: { breadcrumb: 'بازدیدهای دوره‌ای' },
})
