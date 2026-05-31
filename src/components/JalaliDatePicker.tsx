// import React from 'react'
// import StyledTextField from './general/input/StyledTextField'
// import DatePicker, { DateObject } from 'react-multi-date-picker'
// import persian from 'react-date-object/calendars/persian'
// import persian_fa from 'react-date-object/locales/persian_fa'
// import Grid from '@mui/material/Grid2'
// import { TextFieldCompProps } from './general/hookFromInputs/TextFieldComp'
// import { Controller } from 'react-hook-form'
// import { sizeConverter } from '@utility/sizeConverter.ts'
// type JalaliDatePickerProps = {
//     plugins?: any
//     format?: any
// }

// const JalaliDatePicker: React.FC<JalaliDatePickerProps & TextFieldCompProps> = ({
//     control,
//     size = 12,
//     value,
//     label = 'تاریخ',
//     validators,
//     disabled,
//     plugins,
//     format,
//     defaultValue
// }) => {
//     const isValueFilled = value && value !== ''
//     return (
//         <Grid container size={size} justifyContent={'center'} dir="rtl">
//             <Controller
//                 control={control}
//                 name={value || ''}
//                 rules={validators}
//                 defaultValue={defaultValue}
//                 render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
//                     <>
//                         <DatePicker
//                             position="bottom"
//                             {...(!!format && { format: format })}
//                             style={{
//                                 width: sizeConverter(150, 'width'),
//                                 height: sizeConverter(30, 'height'),
//                                 fontSize: sizeConverter(12),
//                                 padding: sizeConverter(8, 'space')
//                             }}
//                             value={value || ''}
//                             // style={{
//                             //     width: '100%',
//                             // }}
//                             // onChange={(date) => {
//                             //     const formattedDate = date instanceof DateObject ? date.format() : date
//                             //     onChange(formattedDate)
//                             // }}
//                             onChange={(date: DateObject | DateObject[] | null) => {
//                                 if (date instanceof DateObject) {
//                                     const isoString = date.toDate().toISOString();
//                                     onChange(isoString);
//                                 } else {
//                                     onChange('');
//                                 }
//                             }}

//                             calendar={persian}
//                             containerStyle={{
//                                 width: '100%',
//                             }}
//                             {...(!!plugins && { plugins: plugins })}
//                             locale={persian_fa}
//                             calendarPosition="top-left"
//                             render={
//                                 <StyledTextField
//                                     disabled={disabled}
//                                     label={
//                                         validators?.required ? (
//                                             <span>
//                                                 {label} <span style={{ color: 'red', marginLeft: sizeConverter(20, 'spaceX') }}>*</span>
//                                             </span>
//                                         ) : (
//                                             label
//                                         )
//                                     }
//                                     inputRef={ref}
//                                     error={!!error}
//                                     helperText={error?.message}
//                                     InputLabelProps={{
//                                         shrink: isValueFilled || undefined,
//                                     }}
//                                     sx={{ width: '100%' }}
//                                 />
//                             }
//                         />
//                     </>
//                 )}
//             />
//         </Grid>
//     )
// }

// export default JalaliDatePicker

import React from 'react'
import StyledTextField from './general/input/StyledTextField'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'
import { sizeConverter } from '@utility/sizeConverter.ts'

import { Control, FieldValues, Path } from 'react-hook-form'

interface JalaliDatePickerProps<T extends FieldValues = any> {
   value: Path<T>
   control: Control<T>
   label?: string
   validators?: any
   disabled?: boolean
   defaultValue?: string | Date | DateObject // ✅ اختیاری
   size?: number
   plugins?: any
   format?: string
   errors?: any
}
declare module 'react-multi-date-picker' {
   interface DatePickerProps<Multiple extends boolean = false, Range extends boolean = false> {
      position?: 'top' | 'bottom' | 'left' | 'right'
   }
}

const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({
   value,
   control,
   size = 12,
   label = 'تاریخ',
   validators,
   disabled,
   plugins,
   format,
   defaultValue,
}) => {
   const normalizeToISO = (val: any) => {
      if (!val) return ''
      if (typeof val === 'string') return val // فرض کن قبلاً ISO بوده
      if (val instanceof DateObject) return val.toDate().toISOString()
      if (val instanceof Date) return val.toISOString()
      if (typeof val === 'number') return new Date(val).toISOString()
      return ''
   }

   return (
      <Grid container size={size} justifyContent={'center'} dir="rtl">
         <Controller
            control={control}
            name={value}
            rules={validators}
            defaultValue={normalizeToISO(defaultValue)}
            render={({ field: { onChange, value, ref } }) => (
               <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  position="bottom"
                  value={value ? new Date(value) : ''}
                  onChange={(date: DateObject | null) => {
                     if (date instanceof DateObject) {
                        // Convert Jalali → Gregorian local time string
                        const localDate = date.toDate() // Tehran local
                        const localISOString =
                           localDate.getFullYear() +
                           '-' +
                           String(localDate.getMonth() + 1).padStart(2, '0') +
                           '-' +
                           String(localDate.getDate()).padStart(2, '0') +
                           'T' +
                           String(localDate.getHours()).padStart(2, '0') +
                           ':' +
                           String(localDate.getMinutes()).padStart(2, '0') +
                           ':' +
                           String(localDate.getSeconds()).padStart(2, '0') // ⚙️ no 'Z'
                        onChange(localISOString) // ✅ treat as local time literal
                     } else {
                        onChange('')
                     }
                  }}
                  style={{
                     width: sizeConverter(150, 'width'),
                     height: sizeConverter(30, 'height'),
                     fontSize: sizeConverter(12),
                     padding: sizeConverter(8, 'space'),
                  }}
                  containerStyle={{ width: '100%' }}
                  {...(!!format && { format })}
                  {...(!!plugins && { plugins })}
                  render={
                     <StyledTextField
                        disabled={disabled}
                        label={
                           validators?.required ? (
                              <span>
                                 {label} <span style={{ color: 'red', marginLeft: sizeConverter(20, 'spaceX') }}>*</span>
                              </span>
                           ) : (
                              label
                           )
                        }
                        inputRef={ref}
                        // error={!!errors}
                        // helperText={errors?.message}
                        InputLabelProps={{
                           shrink: !!value,
                        }}
                        sx={{ width: '100%' }}
                     />
                  }
               />
            )}
         />
      </Grid>
   )
}

export default JalaliDatePicker
