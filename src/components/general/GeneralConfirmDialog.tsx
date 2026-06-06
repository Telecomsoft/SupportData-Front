// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Dialog from '@mui/material/Dialog'
// import Grid from '@mui/material/Grid2'
// import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
// import { useDeleteData } from '@hooks/useDeleteData'
// import { usePostData } from '@hooks/usePostData'
// import CustomCircularProgress from '@components/general/CustomCircularProgress'
// import SvgComponent from '@utility/SvgComponent'
// import confirmIcon from '@public/icons/Confirm.svg'
// import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
// import { useTheme } from '@mui/system'
// import { sizeConverter } from '@utility/sizeConverter'
// import { usePutData } from '@hooks/usePutData'
// import { snackbarOpenType } from '@type/snackbarOpen.ts'
// import { ReactNode } from 'react'
// import { ResType } from '@type/resType.ts'
// import { UseMutationResult } from '@tanstack/react-query'

// type confirmDialogProps = {
//    apiMethod?: string
//    endPoint?: string
//    noApiRequest?: boolean
//    noApiRequestFunc?: () => void
//    dialogCloseFun: () => void
//    customFunAfterSuccess?: (res: unknown) => void
//    snackBarSuccessMessage: string
//    dialogWidth?: number
//    snackbarOpen?: snackbarOpenType
//    isDialogOpen: 'add' | 'edit' | 'info' | null
//    dialogTitle: string
//    customComponent?: ReactNode
//    confirmMessage?: string
//    data?: unknown
// }
// type RequestType<R = unknown> = UseMutationResult<R, Error, unknown>

// function GeneralConfirmDialog({
//    apiMethod,
//    endPoint,
//    noApiRequest,
//    dialogCloseFun,
//    customFunAfterSuccess,
//    snackBarSuccessMessage,
//    noApiRequestFunc,
//    dialogWidth,
//    snackbarOpen,
//    isDialogOpen,
//    dialogTitle,
//    customComponent,
//    confirmMessage,
//    data,
// }: confirmDialogProps) {
//    const theme = useTheme()

//    const postRequest = usePostData(endPoint ?? '')
//    const putRequest = usePutData(endPoint ?? '')
//    const deleteRequest = useDeleteData(endPoint ?? '')

//    let request: RequestType = postRequest

//    if (apiMethod === 'put') {
//       request = putRequest
//    } else if (apiMethod === 'delete') {
//       request = deleteRequest
//    }

//    const confirmHandler = () => {
//       if (!noApiRequest) {
//          request.mutate(data, {
//             onSuccess: (data) => {
//                const res = data as ResType
//                if (res) {
//                   snackbarOpen && snackbarOpen(snackBarSuccessMessage, SNACKBAR_SEVERITIES.SUCCESS)
//                   customFunAfterSuccess?.(res)
//                   dialogCloseFun()
//                } else {
//                   snackbarOpen && snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
//                }
//             },
//             onError: (res: Error) => {
//                snackbarOpen && snackbarOpen(res.message, SNACKBAR_SEVERITIES.ERROR)
//             },
//          })
//       } else {
//          noApiRequestFunc?.()
//          dialogCloseFun()
//       }
//    }

//    return (
//       <Dialog
//          PaperProps={{
//             style: {
//                minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width'),
//                borderRadius: sizeConverter(12, 'radius'),
//             },
//          }}
//          open={!!isDialogOpen}
//          onClose={() => dialogCloseFun()}
//       >
//          <Grid container direction="column" justifyContent={'start'} alignItems={'start'} sx={{ p: sizeConverter(10, 'space') }}>
//             <Grid container size={12} direction="row" justifyContent={'space-between'} alignItems={'center'}>
//                <Grid size={11} gap={1} container alignItems={'center'} direction="row">
//                   <Grid container alignItems={'center'} size="auto">
//                      <SvgComponent
//                         height={sizeConverter(26)}
//                         width={sizeConverter(26)}
//                         icon={confirmIcon}
//                         color={theme?.palette?.black['1']}
//                      />
//                   </Grid>
//                   <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
//                      <Typography variant="dialogTitle">{'تایید'}</Typography>
//                      <Grid size={12}>
//                         <Typography noWrap variant="dialogSubTitle">
//                            {dialogTitle}
//                         </Typography>
//                      </Grid>
//                   </Grid>
//                </Grid>

//                <HighlightOffOutlinedIcon
//                   sx={{
//                      color: '#CCCCCC',
//                      width: sizeConverter(26),
//                      height: sizeConverter(26),
//                      cursor: 'pointer',
//                      transition: '0.2s ease-in-out',
//                      '&:hover': {
//                         color: '#000',
//                      },
//                   }}
//                   onClick={() => dialogCloseFun()}
//                />
//             </Grid>
//             {confirmMessage && (
//                <Grid
//                   container
//                   size={12}
//                   direction="row"
//                   justifyContent={'center'}
//                   alignItems={'center'}
//                   sx={{ mt: sizeConverter(10, 'spaceY') }}
//                >
//                   <Grid
//                      container
//                      size={12}
//                      justifyContent={'center'}
//                      alignItems={'center'}
//                      direction="row"
//                      sx={{
//                         p: sizeConverter(12, 'space'),
//                         bgcolor: 'bgColor.1',
//                         borderRadius: sizeConverter(12, 'radius'),
//                      }}
//                   >
//                      <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
//                         <Typography variant={'normal'}>{confirmMessage}</Typography>
//                      </Grid>
//                   </Grid>
//                </Grid>
//             )}
//             {customComponent && (
//                <Grid
//                   container
//                   justifyContent={'center'}
//                   alignItems={'center'}
//                   sx={{
//                      mt: sizeConverter(10, 'spaceY'),
//                      borderRadius: sizeConverter(10, 'radius'),
//                      overflowX: 'hidden',
//                      overflowY: 'auto',
//                   }}
//                >
//                   {customComponent}
//                </Grid>
//             )}
//             <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} sx={{ mt: sizeConverter(10, 'spaceY') }}>
//                <Button
//                   onClick={() => dialogCloseFun()}
//                   variant="main"
//                   sx={{
//                      mr: sizeConverter(3, 'spaceX'),
//                   }}
//                >
//                   انصراف
//                </Button>
//                <Button
//                   onClick={confirmHandler}
//                   variant="main"
//                   sx={{
//                      bgcolor: 'primary.main',
//                      '&:hover': {
//                         bgcolor: 'bgColor.hover',
//                      },
//                   }}
//                >
//                   {request.isPending && !noApiRequest ? <CustomCircularProgress size={sizeConverter(16)} /> : 'تایید'}
//                </Button>
//             </Grid>
//          </Grid>
//       </Dialog>
//    )
// }

// export default GeneralConfirmDialog
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid2'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
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
import { useDevice } from '@src/hooks/useDevice'

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
   const isMobile = useDevice()

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

   // ====================== Mobile Version (Drawer) ======================
   if (isMobile) {
      return (
         <Drawer
            anchor='bottom'
            open={!!isDialogOpen}
            onClose={dialogCloseFun}
            disableRestoreFocus
            transitionDuration={{ enter: 420, exit: 320 }}
            slotProps={{
               backdrop: {
                  sx: {
                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
                     backdropFilter: 'blur(8px)',
                  },
               },
            }}
            PaperProps={{
               sx: {
                  marginBottom: 7,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  maxHeight: '93vh',
                  bgcolor: '#fafafa',
                  background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
                  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.15), 0 -2px 8px rgba(0, 0, 0, 0.08)',
               },
            }}>
            <Grid container direction={'column'} sx={{ maxHeight: '93vh' }}>
               {/* Header */}
               <Box
                  sx={{
                     position: 'sticky',
                     top: 0,
                     zIndex: 2,
                     background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.92) 100%)',
                     backdropFilter: 'blur(12px)',
                  }}>
                  <Box sx={{ px: 2, pt: 0.75, pb: 1.25 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
                        <Box sx={{ width: 32, height: 3.5, bgcolor: 'rgba(0,0,0,0.14)', borderRadius: 2 }} />
                     </Box>

                     <Box sx={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', columnGap: 1 }}>
                        <Box
                           sx={{
                              width: 44,
                              height: 44,
                              borderRadius: '14px',
                              bgcolor: 'primary.main',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                           }}>
                           <SvgComponent height={20} width={20} icon={confirmIcon} color="#fff" />
                        </Box>

                        <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                           <Typography
                              sx={{
                                 fontSize: 10,
                                 fontWeight: 700,
                                 color: '#7a7a7a',
                                 letterSpacing: '0.12em',
                                 textTransform: 'uppercase',
                                 mb: 0.6,
                              }}>
                              تایید
                           </Typography>
                           <Typography
                              sx={{
                                 fontSize: 18,
                                 fontWeight: 700,
                                 color: '#111',
                                 letterSpacing: '-0.3px',
                                 overflow: 'hidden',
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical',
                              }}>
                              {dialogTitle}
                           </Typography>
                        </Box>

                        <Box
                           onClick={dialogCloseFun}
                           sx={{
                              width: 34,
                              height: 34,
                              justifySelf: 'end',
                              borderRadius: '12px',
                              bgcolor: 'rgba(0,0,0,0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' },
                              '&:active': { transform: 'scale(0.92)' },
                           }}>
                           <HighlightOffOutlinedIcon sx={{ color: '#444', width: 20, height: 20 }} />
                        </Box>
                     </Box>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />
               </Box>

               {/* Content */}
               <Grid
                  container
                  size={12}
                  justifyContent={'center'}
                  direction="column"
                  sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.02)', p: 2, overflowY: 'auto' }}>
                  
                  {confirmMessage && (
                     <Box
                        sx={{
                           width: '100%',
                           p: 2,
                           bgcolor: '#fff',
                           borderRadius: 3,
                           boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}>
                        <Typography
                           sx={{
                              fontWeight: 600,
                              textAlign: 'center',
                              overflowWrap: 'break-word',
                              wordBreak: 'break-all',
                           }}>
                           {confirmMessage}
                        </Typography>
                     </Box>
                  )}

                  {customComponent && (
                     <Box sx={{ width: '100%', mt: 2 }}>
                        {customComponent}
                     </Box>
                  )}
               </Grid>

               {/* Action Buttons */}
               <Grid
                  container
                  size={12}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{
                     p: 2,
                     pt: 1.5,
                     pb: 'calc(12px + env(safe-area-inset-bottom))',
                     position: 'sticky',
                     bottom: 0,
                     borderTop: '1px solid rgba(0,0,0,0.06)',
                     background: 'rgba(255,255,255,0.95)',
                     backdropFilter: 'blur(14px)',
                  }}
                  columnGap={1.5}>
                  <Button
                     onClick={dialogCloseFun}
                     disabled={request.isPending && !noApiRequest}
                     variant='cancelMobile'>
                     انصراف
                  </Button>

                  <Button
                     onClick={confirmHandler}
                     disabled={request.isPending && !noApiRequest}
                     variant='confirmMobile'>
                     {request.isPending && !noApiRequest ? <CustomCircularProgress size={18} /> : 'تایید'}
                  </Button>
               </Grid>
            </Grid>
         </Drawer>
      )
   }

   // ====================== Desktop Version (Dialog) ======================
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
