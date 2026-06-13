// src/utils/sidebarAccess.ts

export const hasAccessToItem = (
    item: any,
    accessCheck: any
): boolean => {
    const accessId = item?.accessID;

    if (accessId === undefined || accessId === null) {
        return true;
    }

    if (Array.isArray(accessId)) {
        return accessId.some((id) =>
            accessCheck({
                accessInfoId: id,
                KindAccessInfo: 'readAccess',
            })
        );
    }

    return accessCheck({
        accessInfoId: accessId,
        KindAccessInfo: 'readAccess',
    });
};

export const filterSidebarByAccess = (
    data: any[],
    accessCheck: any
) => {
    return data
        .map((item) => ({
            ...item,
            children:
                item.children?.filter((child: any) =>
                    hasAccessToItem(child, accessCheck)
                ) || [],
        }))
        .filter((item) => {
            const hasSelfAccess = hasAccessToItem(
                item,
                accessCheck
            );

            const hasChildren =
                item.children &&
                item.children.length > 0;

            return hasSelfAccess || hasChildren;
        });
};