import { useCallback } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import WorkTasksDeskPage from '@components/section/workTasks/WorkTasksDeskPage'
import { parseWorkTaskDeskSearch, WORK_TASK_DESK_TEXT, type WorkTaskDeskSearch } from '@src/data/type/workTaskDesk'
import type { snackbarOpenType } from '@type/snackbarOpen'

export const Route = createFileRoute('/(workTasks)/workTasksDesk')({
    validateSearch: (search: Record<string, unknown>) => parseWorkTaskDeskSearch(search),
    component: withSnackbar(WorkTasksDesk),
    staticData: { breadcrumb: WORK_TASK_DESK_TEXT.title },
})

function WorkTasksDesk({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const search = Route.useSearch()
    const router = useRouter()
    const updateSearch = useCallback((patch: Partial<WorkTaskDeskSearch>, replace = true) => {
        const url = new URL(window.location.href)
        const params = new URLSearchParams(url.search)
        Object.entries({ ...search, ...patch }).forEach(([key, value]) => {
            if (value === undefined || value === '') params.delete(key)
            else params.set(key, String(value))
        })
        const query = params.toString()
        const target = `${url.pathname}${query ? `?${query}` : ''}${url.hash}`
        if (replace) router.history.replace(target)
        else router.history.push(target)
    }, [router, search])

    return <WorkTasksDeskPage snackbarOpen={snackbarOpen} search={search} onSearchChange={updateSearch} />
}
