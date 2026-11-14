
type KindAccess = 'readAccess' | 'writeAccess'

export type TAccessCheck = {
   accessInfoId: number
   KindAccessInfo: KindAccess
   exception?: boolean
}

export type PermissionType = {
   id: number
   name: string
   permissionType: string
   readAccess: boolean
   writeAccess: boolean
}

export const useAccessCheck = () => {
   // خواندن و پارس کردن accessInfo از localStorage
   const getAccessInfo = (): Record<string, PermissionType> => {
      try {
         const accessInfoString = localStorage.getItem('accessInfo')
         return accessInfoString ? JSON.parse(accessInfoString) : {}
      } catch (error) {
         console.error('Error parsing accessInfo from localStorage', error)
         return {}
      }
   }

   const accessInfo = getAccessInfo()

   const accessCheck = ({ accessInfoId, KindAccessInfo, exception = false }: TAccessCheck): boolean => {
      if (exception) return true

      const target = accessInfo[accessInfoId.toString()]
      if (!target) return false

      switch (KindAccessInfo) {
         case 'readAccess':
            return target.readAccess
         case 'writeAccess':
            return target.writeAccess
         default:
            return false
      }
   }

   const canPerform = (id: number): boolean => 
      accessCheck({ accessInfoId: id, KindAccessInfo: 'writeAccess' })

   return { accessCheck, canPerform, accessInfo }
}

// Persian names for the permission list: the backend sends English names (SDConstants.PermissionsList).
// 101-115 are modules (open a screen); 201 and up are single operations ("may finish a task").
export const PERMISSION_LABELS: Record<number, string> = {
   101: 'مدیریت کاربران',
   102: 'مدیریت نقش ها',
   103: 'مدیریت بانک ها',
   104: 'مدیریت قطعات',
   105: 'مدیریت خطاها',
   106: 'اطلاعات پایه',
   107: 'مشتریان',
   108: 'پرسنل',
   109: 'قراردادها',
   110: 'کیوسک ها',
   111: 'فعالیت ها',
   112: 'انبار قطعات',
   113: 'تعمیرات',
   114: 'صورتحساب ها',
   115: 'گزارشات',
   201: 'فعالیت - ثبت',
   202: 'فعالیت - ویرایش',
   203: 'فعالیت - ارجاع',
   204: 'فعالیت - انصراف',
   205: 'فعالیت - اتمام',
   206: 'فعالیت - تایید نهایی',
   207: 'فعالیت - ویرایش فعالیت بسته شده',
   208: 'فعالیت - تایید دریافت فرم',
   209: 'فعالیت - مشاهده فعالیت های همه',
   210: 'فعالیت - اصلاح تاریخ ها',
   211: 'فعالیت - پیوست فایل (اسکن فرم)',
   220: 'کیوسک - مشاهده رمزها',
   230: 'انبار - تایید حواله',
   240: 'تعمیرات - مشاهده تعمیرات همه',
   241: 'تعمیرات - بستن تعمیر',
   250: 'صورتحساب - تایید',
   251: 'صورتحساب - ثبت پرداخت',
}

/** The Persian name of a permission; a permission added to the backend and not listed above shows its English name. */
export const permissionLabel = (id: number, fallback?: string | null) => PERMISSION_LABELS[id] ?? fallback ?? String(id)
