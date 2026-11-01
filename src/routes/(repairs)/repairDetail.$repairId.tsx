import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import RepairDetailPage from '@components/section/repairs/RepairDetailPage'

export const Route = createFileRoute('/(repairs)/repairDetail/$repairId')({
    component: withSnackbar(RepairDetail),
    staticData: { breadcrumb: 'مشخصات تعمیر' },
})

function RepairDetail({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { repairId } = Route.useParams()
    return <RepairDetailPage id={Number(repairId)} snackbarOpen={snackbarOpen} />
}
