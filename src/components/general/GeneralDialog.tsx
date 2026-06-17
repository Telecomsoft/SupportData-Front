



/* eslint-disable @typescript-eslint/no-explicit-any */

import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid2'
import SvgComponent from '@utility/SvgComponent'
import PlusIcon from '@public/icons/Add.svg'
import EditIcon from '@public/icons/Edit.svg'
import Typography from '@mui/material/Typography'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import { Box, Theme, useTheme } from '@mui/system'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { usePostData } from '@hooks/usePostData'
import { usePutData } from '@hooks/usePutData'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { sizeConverter } from '@utility//sizeConverter'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { ResType } from '@type/resType.ts'
import { formatDateString } from '@src/utility/dateConverter'
import usePaymentListStore from '@src/store/paymentListStore'
import { useDevice } from '@src/hooks/useDevice'
import { Divider } from '@mui/material'
type ConditionItem = {
   value: string
   kind: 'combo' | 'textField' | 'checkbox' | 'uploadFile'
   type?: 'multiple' | 'number' | 'freeSolo' | 'name' | 'string' | 'searchable' | 'date' | 'choice'
   [key: string]: unknown
}

type AutoCompleteResult = {
   id: number | string
   name?: string
   [key: string]: unknown
}

interface IGeneralDialog {
   serverArray?: any[]
   array: any[]
   addDefaultValue?: Record<string, unknown>
   setDefaultValue?: Dispatch<SetStateAction<Record<string, unknown>>>
   staticServerData?: Record<string, unknown>
   conditionValue?: unknown
   createEndpoint?: string
   editEndpoint?: string
   apiValueGetter?: (data: Record<string, unknown>) => void
   wrapperFunc?: (res?: any) => void
   snackbarOpen: snackbarOpenType
   autoCompleteOption?: Record<string, any>
   open: 'add' | 'edit' | null
   width?: number
   title?: string
   close: () => void
   sendFinalData?: boolean
   defaultValue?: any
   paddingOff?: boolean
   bgOff?: boolean
   searchDefaultValue?: Record<string, unknown>
   isNotSendServer?: boolean
   customFunc?: (res?: any) => void
}

const GeneralDialog = ({
   serverArray,
   array,
   addDefaultValue,
   staticServerData = {},
   conditionValue,
   createEndpoint,
   editEndpoint,
   apiValueGetter,
   wrapperFunc,
   snackbarOpen,
   autoCompleteOption,
   open = null,
   width,
   title,
   close,
   defaultValue,
   setDefaultValue,
   sendFinalData,
   // paddingOff,
   bgOff,
   isNotSendServer = false,
}: IGeneralDialog) => {
   const theme: Theme = useTheme()
   const conditionArray: any = useMemo(() => {
      return serverArray ? serverArray : array
   }, [array, serverArray])
   const { isMobile } = useDevice()



   const { addItem, editItem: editPyament } = usePaymentListStore()
   const {
      getValues,
      clearErrors,
      setError,
      trigger,
      register,
      setValue,
      unregister,
      control,
      watch,
      reset,
      handleSubmit,
      formState: { errors },
   } = useForm({})

   const createItem = usePostData(createEndpoint ? createEndpoint : '')
   const editItem = usePutData(editEndpoint ? editEndpoint : '')
   const submitButton = (
      data: Record<string | number, number | string | (number | string)[] | AutoCompleteResult | AutoCompleteResult[]>
   ) => {
      let finalData

      if (apiValueGetter) {
         finalData = apiValueGetter(data)
      } else {
         finalData = conditionArray.reduce(
            (sub: Record<string, unknown>, item: ConditionItem) => ({
               ...sub,
               ...(item.kind !== 'combo' && data[item.value] && { [item.value]: data?.[item.value] }),
               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type !== 'multiple' && {
                  [item.value]: (data?.[item.value] as AutoCompleteResult)?.id,
               }),
               ...(item.type === 'date' && data[item.value] && { [item?.value]: formatDateString(data?.[item.value] as string) }),

               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type === 'multiple' &&
                  !!item.multiple && {
                  [item.value]: (data?.[item.value] as AutoCompleteResult[])?.map((i) => i.id),
               }),
               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type === 'name' && {
                  [item.value]: (data?.[item.value] as AutoCompleteResult)?.name,
               }),
               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type === 'choice' && {
                  [item.value]: (data?.[item.value] as AutoCompleteResult)?.id,
               }),
               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type === 'freeSolo' && {
                  [item.value]: (data?.[item.value] as string[])?.map((i) => ({ name: i })),
               }),
               ...(item.kind === 'uploadFile' &&
                  data[item.value] &&
                  item.uploadType === 'single' && {
                  [item.value]: data?.[item.value],
               }),
               ...(item.kind === 'combo' &&
                  data[item.value] &&
                  item.type === 'string' && {
                  [item.value]: data?.[item.value],
               }),
            }),
            {} as Record<string, unknown>
         )
      }
      const FinalDataWithoutUndefined = Object.fromEntries(
         Object.entries(JSON.parse(JSON.stringify(finalData))).filter(([, v]: [string, unknown]) => v !== '')
      )

      if (!isNotSendServer) {
         if (open === 'add') {
            createItem?.mutate(sendFinalData ? finalData : { ...staticServerData, ...FinalDataWithoutUndefined }, {
               onSuccess: (data) => {
                  const res = data as ResType
                  if (res.error === 0) {
                     snackbarOpen('مورد شما با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
                     close()
                     wrapperFunc?.(res.value as Record<any, any>)
                  } else {
                     snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                  }
               },
               onError: (err: Error) => {
                  snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
               },
            })
         } else {
            editItem?.mutate(sendFinalData ? finalData : { id: defaultValue?.id, ...staticServerData, ...FinalDataWithoutUndefined }, {
               onSuccess: (data) => {
                  const res = data as ResType
                  if (res.error === 0) {
                     snackbarOpen('تغییرات شما اعمال شد', SNACKBAR_SEVERITIES.SUCCESS)
                     close()
                     setDefaultValue?.(res.value)
                     wrapperFunc?.(res.value as Record<any, any>)
                  } else {
                     snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                  }
               },
               onError: (err: Error) => {
                  snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
               },
            })
         }
      } else {
         if (open === 'add') {
            addItem({ ...FinalDataWithoutUndefined })
         }
         if (open === 'edit') {
            editPyament(defaultValue?.id, FinalDataWithoutUndefined)
         }
         snackbarOpen('تغییرات شما اعمال شد', SNACKBAR_SEVERITIES.SUCCESS)
         close()
      }
   }
   useEffect(() => {
      if (open === 'edit' && !!defaultValue) {
         reset(
            {
               ...conditionArray.reduce(
                  (sub: Record<string, unknown>, item: ConditionItem) => ({
                     ...sub,
                     ...(item.kind !== 'combo' && { [item?.value]: defaultValue?.[item.value] }),
                     ...(item.kind !== 'combo' &&
                        item.type === 'date' &&
                        !!defaultValue?.[item.value] && {
                        [item?.value]: defaultValue?.[item.value] as string,
                     }),
                     ...(item.kind === 'combo' && {
                        [item.value]: (autoCompleteOption?.[item?.value] as AutoCompleteResult[])?.find(
                           (i) => i.id === defaultValue?.[item?.value]
                        ),
                     }),
                     ...(item.kind === 'combo' &&
                        item.type === 'freeSolo' &&
                        !!defaultValue?.[item.value] && {
                        [item.value]: (defaultValue?.[item.value] as AutoCompleteResult[])?.map((value) => value.name),
                     }),
                     ...(item.kind === 'combo' &&
                        item.type === 'multiple' && {
                        [item.value]: (defaultValue?.[item?.value] || [])
                           ?.map((i: any) => {

                              if (typeof i === 'number') {
                                 return (autoCompleteOption?.[item?.value] || [])
                                    ?.find((el: any) => Number(el?.id) === Number(i))
                              }


                              if (typeof i === 'object' && i !== null) {
                                 return (autoCompleteOption?.[item?.value] || [])
                                    ?.find((el: any) => Number(el?.id) === Number(i.id))
                              }

                              return null
                           })
                           ?.filter(Boolean),
                     }),
                     ...(item.kind === 'combo' &&
                        item.type === 'name' && {
                        [item.value]: (autoCompleteOption?.[item?.value] as AutoCompleteResult[])?.find(
                           (i) => i.name === defaultValue?.[item?.value]
                        ),
                     }),

                     ...(item.kind === 'combo' &&
                        item.type === 'choice' && {
                        [item.value]: (autoCompleteOption as any)?.[item?.value]?.find((i: any) => i.id === defaultValue?.[item?.value]),
                     }),
                  }),
                  {}
               ),
            },
            { keepValues: true }
         )
      } else if (open === 'add' && !!addDefaultValue) {
         reset(
            {
               ...addDefaultValue,
            },
            { keepValues: true }
         )
      } else {
         reset({}, { keepValues: true })
      }
   }, [open, defaultValue, autoCompleteOption])

   return (
      <Dialog
         fullScreen={isMobile}
         PaperProps={{
            sx: {
               minWidth: width ? width : sizeConverter(600, 'width'),
               borderRadius: isMobile ? 0 : sizeConverter(12, 'radius'),
               maxHeight: isMobile ? '100%' : '90vh',
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
               backgroundColor: theme.palette.white[2],
               ...(isMobile && {
                  paddingBottom: sizeConverter(7, 'spaceY'),
               }),
            },
         }}
         disableRestoreFocus
         open={!!open}
      >
         <form
            onSubmit={handleSubmit(submitButton)}
            style={{
               display: 'flex',
               flexDirection: 'column',
               flex: 1,
               overflow: 'hidden',
               height: '100%',
            }}
         >
            {isMobile && (
               <Box
                  sx={{
                     width: '100%',
                     flexShrink: 0,
                     zIndex: 100,
                     background: `linear-gradient(
            180deg,
            ${theme.palette.white[0]}F8 0%,
            ${theme.palette.bgColor[1]}EB 100%
          )`,
                     backdropFilter: 'blur(12px)',
                  }}
               >
                  <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Box
                           sx={{
                              width: 32,
                              height: 4,
                              borderRadius: 99,
                              bgcolor: theme.palette.black[3] + '26',
                           }}
                        />
                     </Box>

                     <Box
                        sx={{
                           display: 'grid',
                           gridTemplateColumns: '44px 1fr 44px',
                           alignItems: 'center',
                           gap: 1,
                        }}
                     >
                        <Box
                           sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 3,
                              bgcolor: theme.palette.primary.main,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                           }}
                        >
                           <SvgComponent
                              width={20}
                              height={20}
                              icon={open === 'add' ? PlusIcon : EditIcon}
                              color={theme.palette.white[0]}
                           />
                        </Box>

                        <Box textAlign="center">
                           <Typography
                              sx={{
                                 fontSize: 10,
                                 fontWeight: 700,
                                 color: theme.palette.black[3],
                                 textTransform: 'uppercase',
                                 mb: 0.5,
                              }}
                           >
                              {open === 'add' ? 'ADD' : 'EDIT'}
                           </Typography>

                           <Typography
                              sx={{
                                 fontSize: 18,
                                 fontWeight: 700,
                                 color: theme.palette.black[1],
                              }}
                           >
                              {title}
                           </Typography>
                        </Box>

                        <Box
                           onClick={close}
                           sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              bgcolor: theme.palette.black[3] + '10',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                           }}
                        >
                           <HighlightOffOutlinedIcon sx={{ color: theme.palette.black[6] }} />
                        </Box>
                     </Box>
                  </Box>

                  <Divider sx={{ borderColor: theme.palette.black[6] }} />
               </Box>
            )}

            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  overflow: 'hidden',
                  p: sizeConverter(10, 'space'),
               }}
            >
               {!isMobile && (
                  <Grid
                     container
                     size={12}
                     direction="row"
                     justifyContent={'space-between'}
                     alignItems={'center'}
                     sx={{
                        pb: sizeConverter(5, 'spaceY'),
                        flexShrink: 0,
                     }}
                  >
                     <Grid size={11} gap={1} container alignItems={'center'} direction="row">
                        <Grid container alignItems={'center'} size="auto">
                           <SvgComponent
                              height={sizeConverter(26)}
                              width={sizeConverter(26)}
                              icon={open === 'add' ? PlusIcon : EditIcon}
                              color={theme.palette.black[1]}
                           />
                        </Grid>

                        <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
                           <Typography variant="dialogTitle">
                              {open === 'add' ? 'افزودن' : 'ویرایش'}
                           </Typography>

                           <Grid size={12}>
                              <Typography noWrap variant="dialogSubTitle">
                                 {title}
                              </Typography>
                           </Grid>
                        </Grid>
                     </Grid>

                     <HighlightOffOutlinedIcon
                        sx={{
                           color: theme.palette.black[3],
                           width: sizeConverter(26),
                           height: sizeConverter(26),
                           cursor: 'pointer',
                           transition: '0.2s ease-in-out',
                           '&:hover': {
                              color: theme.palette.black[1],
                           },
                        }}
                        onClick={() => close()}
                     />
                  </Grid>
               )}

               <Box
                  sx={{
                     flex: 1,
                     overflowY: 'auto',
                     overflowX: 'hidden',
                     minHeight: 0,
                     pt: 2,
                     pb: 4,
                  }}
               >
                  <Grid
                     container
                     size={12}
                     justifyContent={'center'}
                     alignItems={'center'}
                     direction="row"
                     sx={{
                        my: sizeConverter(15, 'spaceY'),
                        bgcolor: !bgOff ? theme.palette.white[2] : 'transparent',
                        borderRadius: sizeConverter(12, 'radius'),
                     }}
                  >
                     <Grid
                        container
                        size={12}
                        justifyContent={'space-between'}
                        alignItems={'end'}
                        rowGap={sizeConverter(15, 'space')}
                        columnGap={sizeConverter(5, 'space')}
                     >
                        {array.map((item, index) => {
                           const Component = item.component

                           return (
                              <Component
                                 key={index}
                                 item={item}
                                 label={item?.label}
                                 placeholder={item?.placeholder}
                                 type={item?.type}
                                 value={item?.value}
                                 size={item?.size}
                                 multiline={item?.multiline}
                                 rows={item?.rows}
                                 maxRows={item?.maxRows}
                                 ltr={item?.ltr}
                                 searchEndPoint={item?.searchEndPoint}
                                 searchBy={item?.searchBy}
                                 register={register}
                                 validators={item?.validators}
                                 helperText={
                                    errors?.[item?.value]?.message
                                       ? String(errors[item?.value]?.message)
                                       : item?.helperText
                                 }
                                 error={!!errors?.[item?.value]?.message}
                                 getValues={getValues}
                                 control={control}
                                 watch={watch}
                                 unregister={unregister}
                                 autoCompleteOption={autoCompleteOption?.[item?.value]}
                                 autocompleteType={item?.autocompleteType}
                                 conditionValue={conditionValue}
                                 open={open}
                                 disabled={open === 'edit' && item?.editDisabled}
                                 setValue={setValue}
                                 trigger={trigger}
                                 clearErrors={clearErrors}
                                 setError={setError}
                                 snackbarOpen={snackbarOpen}
                                 errors={errors}
                              />
                           )
                        })}
                     </Grid>
                  </Grid>
               </Box>

               <Grid
                  container
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                  columnGap={sizeConverter(5, 'spaceX')}
                  sx={{
                     mt: 2,
                     flexShrink: 0,
                     ...(isMobile && {
                        bgcolor: theme.palette.white[0],
                        borderTop: `1px solid ${theme.palette.black[6]}`,
                        p: 2,
                        pb: 8
                     }),
                  }}
               >
                  <Button onClick={() => close()} variant={isMobile ? 'cancelMobile' : 'cancel'}>
                     انصراف
                  </Button>

                  <Button type="submit" variant={isMobile ? 'confirmMobile' : 'main'}>
                     {createItem?.isPending || editItem?.isPending ? (
                        <CustomCircularProgress
                           noPadding
                           color={'white.0'}
                           size={sizeConverter(16)}
                        />
                     ) : (
                        'ثبت'
                     )}
                  </Button>
               </Grid>
            </Box>
         </form>
      </Dialog >

   )

}

export default GeneralDialog


