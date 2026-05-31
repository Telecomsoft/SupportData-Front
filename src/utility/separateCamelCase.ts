export const separateCamelCase = (word: string) => {
    if (!(word)) { return '' }
    return word.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}