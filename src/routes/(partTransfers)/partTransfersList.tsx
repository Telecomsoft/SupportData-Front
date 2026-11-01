import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import PartTransfersPage from '@components/section/partTransfers/PartTransfersPage'

export const Route = createFileRoute('/(partTransfers)/partTransfersList')({
    component: withSnackbar(PartTransfersPage),
    staticData: { breadcrumb: 'انبار قطعات' },
})
