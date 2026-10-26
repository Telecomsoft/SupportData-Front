import { useCallback } from 'react'

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