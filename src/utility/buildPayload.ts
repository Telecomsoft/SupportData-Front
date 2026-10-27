/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogArrayType } from '@type/dialogArrayType'
import { persianToLatinNumber } from '@utility/persianToLatinNumber'

/**
 * Builds the JSON body of an add/edit request from the dialog's form values.
 *
 * Why not GeneralDialog's own builder? It drops every falsy value (false, 0, ''), so a cleared checkbox
 * or a cleared field is never sent. Our update endpoints treat the posted object as the full new state, so we need:
 *   - checkboxes always sent (true OR false)
 *   - numbers sent as numbers, not strings ("12" fails to bind to a C# long)
 *   - on edit, start from the whole current row, so fields that are not in the dialog keep their value
 */
export const buildPayload = (array: DialogArrayType[], data: Record<string, any>, base: Record<string, unknown> = {}) => {
    const body: Record<string, unknown> = { ...base }

    for (const item of array) {
        if (item.noValue) continue                      // section titles and other display-only rows
        const v = data?.[item.value]

        if (item.kind === 'checkbox') {
            body[item.value] = !!v
        } else if (item.kind === 'combo') {
            if (item.type === 'multiple') body[item.value] = Array.isArray(v) ? v.map((i: any) => i?.id) : []
            // empty: null, or item.emptyValue for a server field that can't be null (a C# int that is not int?)
            else body[item.value] = v?.id ?? (item.emptyValue !== undefined ? item.emptyValue : null)
        } else if (item.type === 'natural' || item.type === 'float') {
            const text = persianToLatinNumber(v == null ? '' : String(v)).trim()
            body[item.value] = text === '' ? 0 : Number(text)
        } else if (item.type === 'time') {
            // "08:00" -> "08:00:00": the server's TimeSpan
            const text = typeof v === 'string' ? v.trim() : ''
            body[item.value] = text === '' ? '00:00:00' : text.length === 5 ? text + ':00' : text
        } else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
            body[item.value] = v.map((x: string) => x.trim()).filter((x: string) => x !== '')   // a list of strings, e.g. phones
        } else {
            const text = typeof v === 'string' ? v.trim() : v
            body[item.value] = text === '' || text === undefined ? null : text
        }
    }
    return body
}