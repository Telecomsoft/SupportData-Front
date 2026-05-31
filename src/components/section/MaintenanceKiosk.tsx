//@ts-nocheck

import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import TextFieldComponent from '@components/general/hookFromInputs/TextFieldComp'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { FunctionComponent, useEffect, useMemo } from 'react'
import useCopyStore from '@src/store/copyStore'
import { readURLQueryParameters } from '@components/section/AssignDevice.tsx'
import { useNavigate } from '@tanstack/react-router'
import { mainenanceItems } from '@src/data/kioskDefine/bankKiosk'
import useCehckedItems from '@src/store/cehckedItems'
import { GeneralInfoProps } from '@type/infoOptionsType.ts'

export type AssignedKioskFormData = {
   dailyShutdownActive: boolean
   dailyShutdownTime: string
   dailyRestartActive: boolean
   dailyRestartTime: string
   dailyProgramRestartActive: boolean
   dailyProgramRestartTime: string
}

export type Fields = {
   label: string
   key: keyof AssignedKioskFormData
   fieldType: 'IP' | 'Port'
   size?: number
}[]

const MaintenanceKiosk: FunctionComponent<GeneralInfoProps> = ({ infoOptions, height }) => {
   const navigate = useNavigate()
   const { setValue, errors } = infoOptions!

   const { copyData, clearCopyData } = useCopyStore()
   const { selectedCheck } = useCehckedItems()

   useEffect(() => {
      if (copyData) {
         mainenanceItems?.forEach((kiosk: any) => {
            setValue!(kiosk.key, copyData[kiosk.key])
         })
      }

      return () => {
         clearCopyData()
      }
   }, [copyData])

   const updateMiantenance = useMemo(() => {
      return mainenanceItems?.filter((i) => selectedCheck?.includes(i.key))
   }, [selectedCheck])

   return (
      <Grid
         container
         size={12}
         spacing={sizeConverter(10, 'space')}
         sx={{ p: sizeConverter(4, 'space'), height: height, pt: sizeConverter(10, 'spaceY') }}
      >
         <Grid container sx={{ height: '97%' }} alignContent={'flex-start'} size={12}>
            {updateMiantenance?.map((i) => (
               <Grid container sx={{ my: sizeConverter(2, 'spaceY'), px: sizeConverter(2, 'spaceX') }} size={6}>
                  <Grid container alignItems={'center'}>
                     {i.kind === 'checkbox' && (
                        <Grid container size={12}>
                           <CheckboxComponent item={{ value: i.key, size: 12, title: i.label }} control={infoOptions?.control} />
                        </Grid>
                     )}
                  </Grid>
                  {i.kind === 'textField' && (
                     <Grid container alignItems={'center'} size={12} sx={{ my: sizeConverter(4, 'spaceY') }}>
                        <Grid container size={8}>
                           <TextFieldComponent
                              key={i.key}
                              size={12}
                              label={i.label}
                              errors={infoOptions?.errors}
                              register={infoOptions?.register}
                              value={i.key}
                              type="number"
                              error={!!errors![i.key]?.message}
                              InputProps={{ inputProps: { min: 0, max: 23 } }}
                           />
                        </Grid>
                        <Grid container size={3.9}>
                           <Typography variant="body2" sx={{ mx: sizeConverter(4, 'spaceX') }}>
                              ساعت
                           </Typography>
                        </Grid>
                     </Grid>
                  )}
               </Grid>
            ))}
         </Grid>
         <Grid container justifyContent="end" size={12}>
            {readURLQueryParameters()?.showSettings === 'y' && (
               <Button
                  variant="confirm"
                  sx={{ mr: sizeConverter(8, 'spaceX') }}
                  onClick={() =>
                     navigate({
                        to: '/showSettings',
                        search: {
                           kioskSerial: readURLQueryParameters()?.kioskSerial,
                           settingKind: 'maintenance',
                        },
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

export default MaintenanceKiosk
