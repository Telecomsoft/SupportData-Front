import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid2'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { useDeleteData } from '@hooks/useDeleteData'
import { usePostData } from '@hooks/usePostData'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import SvgComponent from '@utility/SvgComponent'
import confirmIcon from '@public/icons/Confirm.svg'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import { useTheme } from '@mui/system'
import { sizeConverter } from '@utility/sizeConverter'
import { usePutData } from '@hooks/usePutData'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { ReactNode } from 'react'
import { ResType } from '@type/resType.ts'
import { UseMutationResult } from '@tanstack/react-query'

type confirmDialogProps = {
   apiMethod?: string
   endPoint?: string
   noApiRequest?: boolean
   noApiRequestFunc?: () => void
   dialogCloseFun: () => void
   customFunAfterSuccess?: (res: unknown) => void
   snackBarSuccessMessage: string
   dialogWidth?: number
   snackbarOpen?: snackbarOpenType
   isDialogOpen: 'add' | 'edit' | 'info' | null
   dialogTitle: string
   customComponent?: ReactNode
   confirmMessage?: string
   data?: unknown
}
type RequestType<R = unknown> = UseMutationResult<R, Error, unknown>

function GeneralConfirmDialog({
   apiMethod,
   endPoint,
   noApiRequest,
   dialogCloseFun,
   customFunAfterSuccess,
   snackBarSuccessMessage,
   noApiRequestFunc,
   dialogWidth,
   snackbarOpen,
   isDialogOpen,
   dialogTitle,
   customComponent,
   confirmMessage,
   data,
}: confirmDialogProps) {
   const theme = useTheme()

   const postRequest = usePostData(endPoint ?? '')
   const putRequest = usePutData(endPoint ?? '')
   const deleteRequest = useDeleteData(endPoint ?? '')

   let request: RequestType = postRequest

   if (apiMethod === 'put') {
      request = putRequest
   } else if (apiMethod === 'delete') {
      request = deleteRequest
   }

   const confirmHandler = () => {
      if (!noApiRequest) {
         request.mutate(data, {
            onSuccess: (data) => {
               const res = data as ResType
               if (res) {
                  snackbarOpen && snackbarOpen(snackBarSuccessMessage, SNACKBAR_SEVERITIES.SUCCESS)
                  customFunAfterSuccess?.(res)
                  dialogCloseFun()
               } else {
                  snackbarOpen && snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
               }
            },
            onError: (res: Error) => {
               snackbarOpen && snackbarOpen(res.message, SNACKBAR_SEVERITIES.ERROR)
            },
         })
      } else {
         noApiRequestFunc?.()
         dialogCloseFun()
      }
   }

   return (
      <Dialog
         PaperProps={{
            style: {
               minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width'),
               borderRadius: sizeConverter(12, 'radius'),
            },
         }}
         open={!!isDialogOpen}
         onClose={() => dialogCloseFun()}
      >
         <Grid container direction="column" justifyContent={'start'} alignItems={'start'} sx={{ p: sizeConverter(10, 'space') }}>
            <Grid container size={12} direction="row" justifyContent={'space-between'} alignItems={'center'}>
               <Grid size={11} gap={1} container alignItems={'center'} direction="row">
                  <Grid container alignItems={'center'} size="auto">
                     <SvgComponent
                        height={sizeConverter(26)}
                        width={sizeConverter(26)}
                        icon={confirmIcon}
                        color={theme?.palette?.black['1']}
                     />
                  </Grid>
                  <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
                     <Typography variant="dialogTitle">{'تایید'}</Typography>
                     <Grid size={12}>
                        <Typography noWrap variant="dialogSubTitle">
                           {dialogTitle}
                        </Typography>
                     </Grid>
                  </Grid>
               </Grid>

               <HighlightOffOutlinedIcon
                  sx={{
                     color: '#CCCCCC',
                     width: sizeConverter(26),
                     height: sizeConverter(26),
                     cursor: 'pointer',
                     transition: '0.2s ease-in-out',
                     '&:hover': {
                        color: '#000',
                     },
                  }}
                  onClick={() => dialogCloseFun()}
               />
            </Grid>
            {confirmMessage && (
               <Grid
                  container
                  size={12}
                  direction="row"
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{ mt: sizeConverter(10, 'spaceY') }}
               >
                  <Grid
                     container
                     size={12}
                     justifyContent={'center'}
                     alignItems={'center'}
                     direction="row"
                     sx={{
                        p: sizeConverter(12, 'space'),
                        bgcolor: 'bgColor.1',
                        borderRadius: sizeConverter(12, 'radius'),
                     }}
                  >
                     <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
                        <Typography variant={'normal'}>{confirmMessage}</Typography>
                     </Grid>
                  </Grid>
               </Grid>
            )}
            {customComponent && (
               <Grid
                  container
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{
                     mt: sizeConverter(10, 'spaceY'),
                     borderRadius: sizeConverter(10, 'radius'),
                     overflowX: 'hidden',
                     overflowY: 'auto',
                  }}
               >
                  {customComponent}
               </Grid>
            )}
            <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} sx={{ mt: sizeConverter(10, 'spaceY') }}>
               <Button
                  onClick={() => dialogCloseFun()}
                  variant="main"
                  sx={{
                     mr: sizeConverter(3, 'spaceX'),
                  }}
               >
                  انصراف
               </Button>
               <Button
                  onClick={confirmHandler}
                  variant="main"
                  sx={{
                     bgcolor: 'primary.main',
                     '&:hover': {
                        bgcolor: 'bgColor.hover',
                     },
                  }}
               >
                  {request.isPending && !noApiRequest ? <CustomCircularProgress size={sizeConverter(16)} /> : 'تایید'}
               </Button>
            </Grid>
         </Grid>
      </Dialog>
   )
}

export default GeneralConfirmDialog
