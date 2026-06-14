// src/utils/sidebarAccess.ts

export const hasNavigationAccess = (
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
export const filterNavigationByAccess = (
    navigation: any[],
    accessCheck: any
) => {
    return navigation
        .map((item) => ({
            ...item,
            children:
                item.children?.filter((child: any) =>
                    hasNavigationAccess(child, accessCheck)
                ) || [],
        }))
        .filter((item) => {
            const hasChildren =
                item.children &&
                item.children.length > 0;

            const hasSelfAccess =
                hasNavigationAccess(item, accessCheck);

            return hasChildren || hasSelfAccess;
        });
};