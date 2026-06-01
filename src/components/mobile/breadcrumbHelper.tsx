import { LAYOUT_SIDEBAR_DATA } from "@src/data/layout-sidebar-data"

export const getBreadcrumbs = (
   pathname: string,
   items: typeof LAYOUT_SIDEBAR_DATA
) => {
   for (const item of items) {
      if (item.link === pathname) {
         return [
            {
               label: item.name,
               path: item.link,
            },
         ]
      }

      if (item.children?.length) {
         const child = item.children.find(
            c => c.link === pathname
         )

         if (child) {
            return [
               {
                  label: item.name,
                  path: item.link,
               },
               {
                  label: child.name,
                  path: child.link,
               },
            ]
         }
      }
   }

   return []
}