// import { FC, useEffect } from 'react'
// import JalaliDatePicker from '@components/JalaliDatePicker'
// import Grid from '@mui/material/Grid2'
// import { useForm } from 'react-hook-form'
// import { sizeConverter } from '@utility/sizeConverter.ts'
// import { convertToShamsi, convertToGregorian, formatDateString } from '@src/utility/dateConverter'
// import { usePostData } from '@src/hooks/usePostData'

// interface DatePickerItem {
//    value: string
//    label: string
//    isRequiered?: boolean
//    defaultValue?: string
// }

// interface DurationDatePickerProps {
//    startDate: DatePickerItem
//    endDate: DatePickerItem
//    actionHandler?: (res: any) => void
// }

// const DurationDatePicker: FC<DurationDatePickerProps> = ({ startDate, endDate, actionHandler }) => {
//    const {
//       handleSubmit,
//       register,
//       watch,
//       reset,
//       formState: { errors },
//       setValue,
//       unregister,
//       getValues,
//       control,
//    } = useForm()
//    // const factorList = usePostData('api/Main/Factor/List', 'factor-list')
//    const today = convertToShamsi(new Date().toISOString())
//    const tomorrow = convertToShamsi(new Date(Date.now() + 86400000).toISOString())

//    const durationDateArray: DatePickerItem[] = [

//       { ...startDate, defaultValue: today },
//       { ...endDate, defaultValue: tomorrow },
//    ]

//    const watchedStartDate = watch(startDate.value)
//    const watchedEndDate = watch(endDate.value)

//    useEffect(() => {
//       if (!watchedStartDate || !watchedEndDate) return
//       if (!actionHandler) return

//       let response = {
//          [startDate.value]: convertToGregorian(formatDateString(watchedStartDate)),
//          [endDate.value]: convertToGregorian(formatDateString(watchedEndDate)),
//       }
//       // let response = {
//       //    [startDate.value]: watchedStartDate,
//       //    [endDate.value]: watchedEndDate,
//       // }

//       actionHandler(response)
//    }, [watch(startDate.value), watch(endDate.value)])

//    return (
//       <Grid container >
//          <Grid container size={12} justifyContent={'start'} alignItems={'center'} spacing={sizeConverter(4, 'spaceX')}>
//             {durationDateArray.map((item) => (
//                <Grid key={`${item.label}`} size={6}>
//                   <JalaliDatePicker
//                      label={item.label}
//                      value={item.value}
//                      control={control}
//                      register={register}
//                      errors={errors}
//                   // defaultValue={item.defaultValue}
//                   />
//                </Grid>
//             ))}
//          </Grid>
//       </Grid>
//    )
// }

// export default DurationDatePicker

import { FC, useEffect } from 'react'
import JalaliDatePicker from '@components/JalaliDatePicker'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { convertToShamsi, formatDateString } from '@src/utility/dateConverter'
import jalaali from 'jalaali-js'
interface DatePickerItem {
   value: string
   label: string
   isRequiered?: boolean
   defaultValue?: string
}

interface DurationDatePickerProps {
   startDate: DatePickerItem
   endDate: DatePickerItem
   actionHandler?: (res: any) => void
}

const DurationDatePicker: FC<DurationDatePickerProps> = ({ startDate, endDate, actionHandler }) => {
   const {
      // register,
      watch,
      formState: { errors },
      control,
   } = useForm()
   // const factorList = usePostData('api/Main/Factor/List', 'factor-list')
   // const today = convertToShamsi(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
   // const tomorrow = convertToShamsi(new Date(Date.now()).toISOString())
   // const today = convertToShamsi(new Date().toISOString())
   // const tomorrow = convertToShamsi(new Date(Date.now() + 86400000).toISOString())

   const getOneMonthBeforeTodayShamsi = (): string => {
      const today = new Date()
      const { jy, jm, jd } = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate())

      let prevMonth = jm - 1
      let prevYear = jy

      if (prevMonth === 0) {
         prevMonth = 12
         prevYear -= 1
      }

      // چک می‌کنیم آیا روز مورد نظر در ماه قبل وجود دارد یا نه
      const daysInPrevMonth = jalaali.jalaaliMonthLength(prevYear, prevMonth)
      const finalDay = Math.min(jd, daysInPrevMonth)

      return `${prevYear}/${prevMonth}/${finalDay}`
   }

   // استفاده:
   const today = convertToShamsi(new Date().toISOString())
   const monthAgo = getOneMonthBeforeTodayShamsi()

   const durationDateArray: DatePickerItem[] = [
      { ...startDate, defaultValue: monthAgo },
      { ...endDate, defaultValue: today },
   ]

   const watchedStartDate = watch(startDate.value)
   const watchedEndDate = watch(endDate.value)

   useEffect(() => {
      if (!watchedStartDate || !watchedEndDate) return
      if (!actionHandler) return

      let response = {
         [startDate.value]: formatDateString(watchedStartDate),
         [endDate.value]: formatDateString(watchedEndDate),
      }

      actionHandler(response)
   }, [watchedStartDate, watchedEndDate])

   return (
      <Grid container>
         <Grid container size={12} justifyContent={'start'} alignItems={'center'} spacing={sizeConverter(4, 'spaceX')}>
            {durationDateArray.map((item) => (
               <Grid key={`${item.label}`} size={6}>
                  <JalaliDatePicker
                     label={item.label}
                     value={item.value}
                     control={control}
                     // register={register}
                     errors={errors}
                     defaultValue={item.defaultValue}
                     // validators={{ required: true }}
                  />
               </Grid>
            ))}
         </Grid>
      </Grid>
   )
}

export default DurationDatePicker
