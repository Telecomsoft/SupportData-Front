/* eslint-disable @typescript-eslint/no-explicit-any */
type ComparableObject = { [key: string]: any } | { left: any[]; right: any[] } | string

export function compareObjects(obj1: ComparableObject, obj2: ComparableObject): boolean {
    // Parse JSON strings if necessary
    const parsed1 = parseIfString(obj1)
    const parsed2 = parseIfString(obj2)

    // If the objects are strictly equal, return true
    if (parsed1 === parsed2) return true

    // If either is not an object or is null, they're not equal
    if (typeof parsed1 !== 'object' || parsed1 === null || typeof parsed2 !== 'object' || parsed2 === null) {
        return false
    }

    // Get keys of both objects
    const keys1 = Object.keys(parsed1)
    const keys2 = Object.keys(parsed2)

    // If number of keys is different, objects are not equal
    if (keys1.length !== keys2.length) return false

    // Check if all keys in obj1 exist in obj2 and have the same value
    for (const key of keys1) {
        if (!parsed2.hasOwnProperty(key)) return false

        // Handle arrays (for 'left' and 'right' properties)
        if (Array.isArray(parsed1[key]) && Array.isArray(parsed2[key])) {
            if (!compareArrays(parsed1[key], parsed2[key])) return false
        }
        // Handle nested objects
        else if (typeof parsed1[key] === 'object' && typeof parsed2[key] === 'object') {
            if (!compareObjects(parsed1[key], parsed2[key])) return false
        }
        // Compare primitive values
        else if (parsed1[key] !== parsed2[key]) {
            return false
        }
    }

    return true
}

function compareArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
        if (!compareObjects(arr1[i], arr2[i])) return false
    }
    return true
}

function parseIfString(obj: ComparableObject): any {
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj)
        } catch (e) {
            return obj
        }
    }
    return obj
}
