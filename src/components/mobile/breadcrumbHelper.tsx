// src/components/mobile/breadcrumbHelper.ts
import { LAYOUT_SIDEBAR_DATA } from "@src/data/layout-sidebar-data"

export const getBreadcrumbs = (
   pathname: string,
   items: typeof LAYOUT_SIDEBAR_DATA
) => {
   for (const item of items) {
      // استفاده از لینک موبایل در صورت وجود برای مسیر برگشت والد
      const parentPath = item.mobileLink || item.link;

      if (item.children && item.children.length > 0) {
         const child = item.children.find(c => c.link === pathname)

         if (child) {
            return [
               {
                  label: item.name,
                  path: parentPath,
               },
               {
                  label: child.name,
                  path: child.link,
               },
            ]
         }
      }

      if (item.link === pathname || item.mobileLink === pathname) {
         return [
            {
               label: item.name,
               path: parentPath,
            },
         ]
      }
   }

   return []
}
