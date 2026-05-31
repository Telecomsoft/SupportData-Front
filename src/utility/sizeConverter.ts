export const sizeConverter = (data: number, kind?: string): number => {
    if (typeof window !== 'undefined') {

        const width: number = Math.round(((data * window.innerWidth) / 1366) * 100) / 100
        const height: number = Math.round(((data * window.innerHeight) / 768) * 100) / 100
        const lowerOne: number = Math.min(height, width)

        if (kind === 'height') {
            return height
        } else if (kind === 'width') {
            return width
        } else if (kind === 'spaceX') {
            return (width / 8)
        } else if (kind === 'spaceY') {
            return (height / 8)
        } else if (kind === 'space') {
            return (lowerOne / 8)
        } else if (kind === 'radius') {
            return (lowerOne / 4)
        } else {
            return lowerOne
        }
    }

    return data

}

