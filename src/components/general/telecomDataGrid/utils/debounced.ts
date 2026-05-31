let searchingDelay: ReturnType<typeof setTimeout> | null = null

export const debounced = (request: () => void, timeout: number = 600): void => {
    if (searchingDelay) {
        clearTimeout(searchingDelay)
    }

    searchingDelay = setTimeout(() => {
        request()
    }, timeout)
}
