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

    const print = async (id: number) => {
        if (printingID !== null) return
        setPrintingID(id)
        const tab = window.open('', '_blank')
        try {
            const res = await axios.get(getEndpoint() + `api/Report/WorkTaskPdf/${id}`, { ...authConfig, responseType: 'blob' })
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
                a.download = `WorkTask-${id}.pdf`
                a.click()
            }
            setTimeout(() => URL.revokeObjectURL(url), 60_000)
        } catch (e) {
            tab?.close()
            snackbarOpen(`چاپ دستورکار #${id} انجام نشد. ${e instanceof Error ? e.message : ''}`.trim(), SNACKBAR_SEVERITIES.ERROR)
        } finally {
            setPrintingID(null)
        }
    }

    return { print, printingID }
}
