// import { useGetData } from '@src/hooks/useGetData'

// type KindAccess = 'readAccess' | 'editAccess' | 'deleteAccess' | 'createAccess'

// export type TAccessCheck = {
//    accessInfoId: number
//    KindAccessInfo: KindAccess
//    exception?: boolean
// }

// export type PermissionType = {
//    id: number
//    name: string
//    readAccess: boolean
//    writeAccess: boolean
//    // editAccess: boolean
//    // deleteAccess?: boolean
//    // createAccess?: boolean
// }

// export const useAccessCheck = () => {
//    const { data } = useGetData<{ value: PermissionType[] }>('api/Base/Permissions', 'permission-list')

//    const accessData = (data?.value || []) as PermissionType[]

//    const accessCheck = ({ accessInfoId, KindAccessInfo, exception = false }: TAccessCheck): boolean => {
//       if (exception) return true

//       const target = accessData?.find((item: Record<string, any>) => item.id === accessInfoId)
//       return !!target?.[KindAccessInfo]
//    }

//    return { accessCheck }
// }


import Cookies from 'js-cookie'

type KindAccess = 'readAccess' | 'writeAccess'

export type TAccessCheck = {
   accessInfoId: number
   KindAccessInfo: KindAccess
   exception?: boolean
}

export type PermissionType = {
   id: number
   name: string
   readAccess: boolean
   writeAccess: boolean
}

export const useAccessCheck = () => {
   // دریافت و پارس کردن کوکی
   const accessInfoString = Cookies.get('accessInfo');
   const accessInfo: Record<string, PermissionType> = accessInfoString
      ? JSON.parse(accessInfoString)
      : {};

   const accessCheck = ({ accessInfoId, KindAccessInfo, exception = false }: TAccessCheck): boolean => {
      if (exception) return true

      const target = accessInfo[accessInfoId.toString()];

      if (!target) return false;

      switch (KindAccessInfo) {
         case 'readAccess':
            return target.readAccess;
         case 'writeAccess':
            return target.writeAccess;

         default:
            return false;
      }
   }

   return { accessCheck }
}
