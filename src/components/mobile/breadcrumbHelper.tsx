import { LAYOUT_SIDEBAR_DATA } from "@src/data/layout-sidebar-data"

export const getBreadcrumbs = (
   pathname: string,
   items: typeof LAYOUT_SIDEBAR_DATA
) => {
   for (const item of items) {
      // ۱. اول بررسی می‌کنیم که آیا این مسیر متعلق به یکی از فرزندان است؟
      if (item.children && item.children.length > 0) {
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

      // ۲. اگر در فرزندان نبود (یا اصلاً فرزندی نداشت)، بررسی می‌کنیم آیا مسیر خود والد است؟
      if (item.link === pathname) {
         return [
            {
               label: item.name,
               path: item.link,
            },
         ]
      }
   }

   return []
}
