import { useState } from 'react'
import axios from 'axios'
import getEndpoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'

/**
 * The printed work task form: GET api/Report/WorkTaskPdf/{id} returns a PDF file, or (on failure) the usual
 * AppResult JSON, so the content type decides. The tab is opened first, inside the click, so the browser
 * does not block it; the PDF is put into it when it arrives. Used by the task list and the task page.
 */
export const useWorkTaskPdf = (snackbarOpen: snackbarOpenType) => {
    const authConfig = useGetAuthorizationConfig()
    const [printingID, setPrintingID] = useState<number | null>(null)

    // one PDF in a new tab. The tab is opened inside the click so the browser does not block it.
    const show = async (request: () => Promise<{ data: Blob; headers: Record<string, any> }>, fileName: string, failure: string, onSkipped?: (ids: string) => void) => {
        const tab = window.open('', '_blank')
        try {
            const res = await request()
            const blob: Blob = res.data
            if (!blob.type.includes('application/pdf')) {
                const result = JSON.parse(await blob.text())
                throw new Error(`${result?.error ?? ''} ${result?.errorMessage ?? ''}`.trim())
            }
            const url = URL.createObjectURL(blob)
            if (tab) tab.location.href = url
            else {                                  // the browser blocked the new tab: download the file instead
                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                a.click()
            }
            setTimeout(() => URL.revokeObjectURL(url), 60_000)
            const skipped = res.headers?.['x-skipped-ids']
            if (skipped && onSkipped) onSkipped(String(skipped))
        } catch (e) {
            tab?.close()
            snackbarOpen(`${failure}. ${e instanceof Error ? e.message : ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
        }
    }

    const print = async (id: number) => {
        if (printingID !== null) return
        setPrintingID(id)
        await show(() => axios.get(getEndpoint() + `api/Report/WorkTaskPdf/${id}`, { ...authConfig, responseType: 'blob' }), `WorkTask-${id}.pdf`, `چاپ دستورکار #${id} انجام نشد`)
        setPrintingID(null)
    }

    // many forms in ONE pdf (POST api/Report/WorkTasksPdf): one tab, one print dialog
    const [printingMany, setPrintingMany] = useState(false)
    const printMany = async (ids: number[]) => {
        if (printingMany || ids.length === 0) return
        setPrintingMany(true)
        await show(
            () => axios.post(getEndpoint() + 'api/Report/WorkTasksPdf', { ids }, { ...authConfig, responseType: 'blob' }),
            `WorkTasks-${ids.length}.pdf`,
            'چاپ دستورکارها انجام نشد',
            (skipped) => snackbarOpen(`این دستورکارها چاپ نشد: ${skipped}`, SNACKBAR_SEVERITIES.WARNING),
        )
        setPrintingMany(false)
    }

    return { print, printingID, printMany, printingMany }
}
