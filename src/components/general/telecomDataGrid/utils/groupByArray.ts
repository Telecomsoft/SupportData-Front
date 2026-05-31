/* eslint-disable */
//@ts-nocheck

import {TELECOM_DICTIONARY} from "@components/general/telecomDataGrid/staticData/telecom-dictionary.ts";

export function groupByArray<T>(arr: T[], properties: string[], dataGridKeyID: string = 'id', lang: 'FAR' | 'ENG' = 'FAR'): any[] {
    // Base case: if no more properties to group by, return the original array
    if (properties.length === 0) {
        return arr;
    }

    // Get the current grouping property
    const currentProp = properties[0];

    // Group the array by the current property and convert to array
    const grouped = Object.values(arr.reduce((acc, item) => {
        const key = item[currentProp];

        // Find or create group
        if (!acc[key]) {
            acc[key] = {
                [currentProp]: !!key ? key : TELECOM_DICTIONARY[lang]['Empty'],
                [dataGridKeyID]: key,
                subItem: []
            };
        }

        // If more properties to group by, recurse
        if (properties.length > 1) {
            const remainingProps = properties.slice(1);
            const subGrouped = groupByArray(arr.filter(i => i[currentProp] === key), remainingProps);

            // If subGrouped is an array, add to subItem
            if (Array.isArray(subGrouped)) {
                acc[key].subItem = subGrouped;
            } else {
                // If subGrouped is an object of groups, merge its values
                acc[key].subItem = Object.values(subGrouped);
            }
        } else {
            // If no more properties, add original items
            acc[key].subItem.push(item);
        }

        return acc;
    }, {}));

    return grouped;
}