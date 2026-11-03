import axios from 'axios'
import * as XLSX from 'xlsx'
import getEndPoint from '@utility/getEndPoint'
import { useGetAuthorizationConfig } from '@hooks/useGetAuthorizationConfig'

const PAGE = 500                // the server's largest page (it clamps Number to 1..500)
const MAX_PAGES = 40            // a safety stop: 20 000 rows is far more than a report should export

/**
 * Excel export is done here (the API returns data only). `fetchAllPages` reads a paged report page after page,
 * so the file holds every row that matches the filter, not just the page on screen; `exportXlsx` writes the file.
 */
export const useReportExport = () => {
    const config = useGetAuthorizationConfig()

    const fetchAllPages = async <T,>(endpoint: string, body: Record<string, unknown>): Promise<T[]> => {
        const all: T[] = []
        for (let page = 0; page < MAX_PAGES; page++) {
            const res = await axios.post(getEndPoint() + endpoint, { ...body, index: page * PAGE, number: PAGE }, config)
            const data = res.data
            if (data?.error !== 0) throw new Error(`${data?.error ?? ''} ${data?.errorMessage ?? ''}`.trim())
            const items: T[] = data.value?.items ?? []
            all.push(...items)
            if (items.length < PAGE || all.length >= (data.value?.total ?? 0)) break
        }
        return all
    }

    // rows: one plain object per line, the keys are the column headings
    const exportXlsx = (rows: Record<string, unknown>[], sheetName: string, fileName: string) => {
        const sheet = XLSX.utils.json_to_sheet(rows)
        sheet['!views'] = [{ rightToLeft: true }]            // Persian reads right to left
        const book = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(book, sheet, sheetName.slice(0, 31))
        XLSX.writeFile(book, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`)
    }

    return { fetchAllPages, exportXlsx }
}
