import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import PartTransferDetailPage from '@components/section/partTransfers/PartTransferDetailPage'

export const Route = createFileRoute('/(partTransfers)/partTransferDetail/$partTransferId')({
    component: withSnackbar(PartTransferDetail),
    staticData: { breadcrumb: 'مشخصات انتقال قطعه' },
})

function PartTransferDetail({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { partTransferId } = Route.useParams()
    return <PartTransferDetailPage id={Number(partTransferId)} snackbarOpen={snackbarOpen} />
}
