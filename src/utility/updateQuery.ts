export const addOrUpdateQueryParam = (param: string, value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(param, value)
    window.history.pushState(null, '', url.toString())
}