export function countStringOccurrences(data: string[]): { name: string; count: number }[] {
    const occurrences: { [key: string]: number } = {};

    for (const item of data) {
        occurrences[item] = (occurrences[item] || 0) + 1;
    }

    return Object.entries(occurrences)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}