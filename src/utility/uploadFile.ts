import axios from 'axios'
import Cookies from 'js-cookie'
import getEndpoint from '@utility/getEndPoint'

/**
 * Upload one file (POST api/Base/upload) and return the path the server stored it under,
 * for example "/SupportFiles/Upload/2026_0123456789.pdf". Link that path to a record afterwards
 * (for a work task: POST api/WorkTask/AddAttachment).
 *
 * The server answers HTTP 400 with a plain text reason ("File type is not allowed", "File is too large"),
 * which is what the thrown Error carries. It is not retried: the same file would be refused again.
 */
export const uploadFile = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
    const form = new FormData()
    form.append('FileName', file.name)
    form.append('Filecontent', file)
    try {
        const res = await axios.post(getEndpoint() + 'api/Base/upload', form, {
            headers: { Authorization: 'Bearer ' + Cookies.get('auth_token') },
            onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded * 100) / e.total)),
        })
        return String(res.data)
    } catch (e: any) {
        const reason = e?.response?.data
        throw new Error(typeof reason === 'string' && reason ? reason : e?.message ?? 'Upload failed')
    }
}

/** The address a stored path (/SupportFiles/...) is served from. */
export const fileUrl = (path: string) => getEndpoint().replace(/\/$/, '') + path
