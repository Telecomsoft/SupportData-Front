/* eslint-disable @typescript-eslint/no-explicit-any */

type SearchKey = string

export type SearchResult = {
    object: any | null
    pathTree: (string | number)[]
}

export default function findInTree(tree: any[], searchKey: SearchKey, searchValue: string | number): SearchResult {
    const result: SearchResult = {
        object: null,
        pathTree: [],
    }

    function searchNode(nodes: any[], path: string[]): boolean {
        for (const node of nodes) {
            const keyValue = node[searchKey];

            if (keyValue != null && keyValue.toString() === searchValue.toString()) {
                result.object = node;
                result.pathTree = [...path, keyValue.toString()];
                return true;
            }

            if (node.children) {
                if (searchNode(node.children, [...path, keyValue ? keyValue.toString() : ''])) {
                    return true;
                }
            }
        }
        return false;
    }

    searchNode(tree, [])
    return result
}
