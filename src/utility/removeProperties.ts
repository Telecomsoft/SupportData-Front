export const removeProperties = (obj: Record<string, unknown>, properties: string[]) => {
    if (!obj) return {}
    return Object.keys(obj)?.reduce((total, item) => ({...total, ...(properties?.includes(item) ? {} : {[item]: obj[item]})}), {})
}