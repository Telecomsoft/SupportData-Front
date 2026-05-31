//@ts-nocheck

import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import IP_Port from '@components/general/IPPort'
import Button from '@mui/material/Button'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'
import { banksItem, SettingFields } from '@src/data/kioskDefine/bankKiosk'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import useCopyStore from '@src/store/copyStore'
import { readURLQueryParameters } from '@components/section/AssignDevice.tsx'
import { useNavigate } from '@tanstack/react-router'
import useCehckedItems from '@src/store/cehckedItems'

export type DataProps = {
   kioskSerial: string
   backupSwitchIP: number
   bssip: number
   bssPort: number
   backBSSIP: number
   backBSSPort: number
   backupSwitchPort: number
   switchIP: number
   switchPort: number
   merchantID1: number
   merchantID2: number
   terminalID1: number
   terminalID2: number
   isDirectSwitch: boolean
}

export type Fields = {
   label: string
   key: keyof DataProps
   fieldType: 'IP' | 'Port' | 'check'
   size: number
}[]

const BankKiosk: FunctionComponent<GeneralInfoProps> = ({ infoOptions, height }) => {
   const navigate = useNavigate()
   const { watch, register, setValue, unregister, reset } = infoOptions!

   const { copyData, clearCopyData } = useCopyStore()
   const { selectedCheck } = useCehckedItems()

   useEffect(() => {
      if (copyData) {
         reset!({ isDirectSwitch: copyData['isDirectSwitch'] })
      }

      return () => {
         clearCopyData()
      }
   }, [copyData])

   const updateField: SettingFields[] = useMemo(() => {
      return banksItem.filter((i) => selectedCheck?.includes(i.key) && i.key !== 'isDirectSwitch')
   }, [selectedCheck])

   return (
      <Grid
         container
         size={12}
         alignContent={'space-between'}
         spacing={sizeConverter(10, 'space')}
         sx={{ p: sizeConverter(4, 'space'), height: height, pt: sizeConverter(10, 'spaceY') }}
      >
         <Grid container alignContent={'flex-start'} size={12}>
            <IP_Port fields={updateField} watch={watch} register={register} setValue={setValue} unregister={unregister} />
            {selectedCheck?.includes('isDirectSwitch') && (
               <CheckboxComponent item={{ value: 'isDirectSwitch', size: 12, title: 'سوییچ مستقیم' }} control={infoOptions?.control} />
            )}
         </Grid>
         <Grid container justifyContent="end" size={12}>
            {readURLQueryParameters()?.showSettings === 'y' && (
               <Button
                  variant="confirm"
                  sx={{ mr: sizeConverter(8, 'spaceX') }}
                  onClick={() =>
                     navigate({
                        to: '/showSettings',
                        search: { kioskSerial: readURLQueryParameters()?.kioskSerial, settingKind: 'bank' },
                     })
                  }
               >
                  نمایش تنظیمات
               </Button>
            )}
         </Grid>
      </Grid>
   )
}

export default BankKiosk
