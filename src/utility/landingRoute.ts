import { LAYOUT_SIDEBAR_DATA } from '@src/data/layout-sidebar-data'

type Access = Record<string, { readAccess?: boolean }> | null | undefined

/**
 * Where to send a user right after login: the first screen in the menu they may open.
 * That is the dashboard for anyone with the reports permission; a user who only has, say, the
 * parts warehouse lands there instead of on a page that would answer "access denied".
 * Returns null when the role has no screen at all.
 */
export const getLandingRoute = (access: Access): string | null => {
    const can = (id: number) => !!access?.[String(id)]?.readAccess
    const allowed = (accessID?: number | number[]) =>
        accessID === undefined || (Array.isArray(accessID) ? accessID.some(can) : can(accessID))

    for (const item of LAYOUT_SIDEBAR_DATA) {
        if (item.link && allowed(item.accessID)) return item.link
        for (const child of item.children ?? []) {
            if (child.link && allowed(child.accessID)) return child.link
        }
    }
    return null
}
