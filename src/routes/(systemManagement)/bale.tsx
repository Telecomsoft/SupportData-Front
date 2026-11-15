import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import BalePage from '@components/section/bale/BalePage'

export const Route = createFileRoute('/(systemManagement)/bale')({
    component: withSnackbar(BalePage),
    staticData: { breadcrumb: 'ربات بله' },
})
