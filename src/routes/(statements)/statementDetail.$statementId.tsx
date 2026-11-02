import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import StatementDetailPage from '@components/section/statements/StatementDetailPage'

export const Route = createFileRoute('/(statements)/statementDetail/$statementId')({
    component: withSnackbar(StatementDetail),
    staticData: { breadcrumb: 'مشخصات صورت‌حساب' },
})

function StatementDetail({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { statementId } = Route.useParams()
    return <StatementDetailPage id={Number(statementId)} snackbarOpen={snackbarOpen} />
}
