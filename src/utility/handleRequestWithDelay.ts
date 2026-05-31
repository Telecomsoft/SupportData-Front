let searchingDelay: ReturnType<typeof setTimeout> | null = null

export const handleRequestWithDelay = (request: () => void, timeout: number = 900): void => {
    if (searchingDelay) {
        clearTimeout(searchingDelay)
    }

    searchingDelay = setTimeout(() => {
        request()
    }, timeout)
}
