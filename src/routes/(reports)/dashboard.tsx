import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@components/section/reports/DashboardPage'

export const Route = createFileRoute('/(reports)/dashboard')({
    component: DashboardPage,
    staticData: { breadcrumb: 'داشبورد' },
})
