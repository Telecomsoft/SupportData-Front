//@ts-nocheck

import { FunctionComponent, useMemo } from 'react'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import Button from '@mui/material/Button'
import IP_Port from '@components/general/IPPort'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'
import { readURLQueryParameters } from '@components/section/AssignDevice.tsx'
import { useNavigate } from '@tanstack/react-router'
import { networkItems } from '@src/data/kioskDefine/bankKiosk'
import useCehckedItems from '@src/store/cehckedItems'

export type AssignedKioskFormData = {
   kioskSerial: string
   serverIP: string
   serverPort: string
   backupServerIP: string
   backupServerPort: string
   fileServerIP: string
   fileServerPort: string
   backupFileServerIP: string
   backupFileServerPort: string
}

export type Fields = {
   label: string
   key: keyof AssignedKioskFormData
   fieldType: 'IP' | 'Port'
   size: number
}[]

const AssignedKiosks: FunctionComponent<GeneralInfoProps> = ({ height, infoOptions }) => {
   const navigate = useNavigate()
   const { selectedCheck } = useCehckedItems()

   const updateNetwork = useMemo(() => {
      return networkItems?.filter((i) => selectedCheck?.includes(i.key))
   }, [selectedCheck])

   return (
      <Grid container height={height} size={12}>
         <Grid
            container
            size={12}
            height="100%"
            spacing={sizeConverter(13, 'space')}
            sx={{ px: sizeConverter(6, 'space'), pt: sizeConverter(10, 'space') }}
            alignContent="space-between"
         >
            <Grid container size={12}>
               <Grid size={12}>
                  <IP_Port
                     fields={updateNetwork}
                     watch={infoOptions?.watch}
                     errors={infoOptions?.errors}
                     register={infoOptions?.register}
                     setValue={infoOptions?.setValue}
                     reset={infoOptions?.reset}
                     getValues={infoOptions?.getValues}
                  />
               </Grid>
            </Grid>

            <Grid container justifyContent="end" size={12}>
               {readURLQueryParameters()?.showSettings === 'y' && (
                  <Button
                     variant="confirm"
                     onClick={() =>
                        navigate({
                           to: '/showSettings',
                           search: {
                              kioskSerial: readURLQueryParameters()?.kioskSerial,
                              settingKind: 'network',
                           },
                        })
                     }
                  >
                     نمایش تنظیمات
                  </Button>
               )}
            </Grid>
         </Grid>
      </Grid>
   )
}

export default AssignedKiosks
