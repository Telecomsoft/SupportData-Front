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
import { alpha } from '@mui/material/styles'

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
   const { isMobile } = useDevice()

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
            anchor="bottom"
            open={!!isDialogOpen}
            onClose={dialogCloseFun}
            disableRestoreFocus
            transitionDuration={{ enter: 420, exit: 320 }}
            slotProps={{
               backdrop: {
                  sx: {
                     backgroundColor: alpha(theme.palette.black[1], 0.5),
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
                  bgcolor: theme.palette.bgColor[1],
                  background: `linear-gradient(
            180deg,
            ${theme.palette.white[0]} 0%,
            ${theme.palette.bgColor[1]} 100%
          )`,
                  boxShadow: `
            0 -8px 32px ${alpha(theme.palette.black[1], 0.15)},
            0 -2px 8px ${alpha(theme.palette.black[1], 0.08)}
          `,
               },
            }}
         >
            <Grid container direction="column" sx={{ maxHeight: '93vh' }}>

               {/* Header */}
               <Box
                  sx={{
                     position: 'sticky',
                     top: 0,
                     zIndex: 2,
                     background: `linear-gradient(
              180deg,
              ${alpha(theme.palette.white[0], 0.98)} 0%,
              ${alpha(theme.palette.bgColor[1], 0.92)} 100%
            )`,
                     backdropFilter: 'blur(12px)',
                  }}
               >
                  <Box sx={{ px: 2, pt: 0.75, pb: 1.25 }}>

                     <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
                        <Box
                           sx={{
                              width: 32,
                              height: 3.5,
                              bgcolor: alpha(theme.palette.black[1], 0.14),
                              borderRadius: 2,
                           }}
                        />
                     </Box>

                     <Box
                        sx={{
                           display: 'grid',
                           gridTemplateColumns: '44px 1fr 44px',
                           alignItems: 'center',
                           columnGap: 1,
                        }}
                     >
                        <Box
                           sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 3,
                              bgcolor: theme.palette.primary.main,
                              boxShadow: `0 8px 20px ${alpha(theme.palette.black[1], 0.1)}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                           }}
                        >
                           <SvgComponent
                              height={20}
                              width={20}
                              icon={confirmIcon}
                              color={theme.palette.white[0]}
                           />
                        </Box>

                        <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                           <Typography
                              sx={{
                                 fontSize: 10,
                                 fontWeight: 700,
                                 color: theme.palette.black[3],
                                 letterSpacing: '0.12em',
                                 textTransform: 'uppercase',
                                 mb: 0.6,
                              }}
                           >
                              تایید
                           </Typography>

                           <Typography
                              sx={{
                                 fontSize: 18,
                                 fontWeight: 700,
                                 color: theme.palette.black[1],
                                 letterSpacing: '-0.3px',
                                 overflow: 'hidden',
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical',
                              }}
                           >
                              {dialogTitle}
                           </Typography>
                        </Box>

                        <Box
                           onClick={dialogCloseFun}
                           sx={{
                              width: 34,
                              height: 34,
                              justifySelf: 'end',
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.black[1], 0.04),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: '0.2s',
                              '&:hover': {
                                 bgcolor: alpha(theme.palette.black[1], 0.08),
                              },
                              '&:active': {
                                 transform: 'scale(0.92)',
                              },
                           }}
                        >
                           <HighlightOffOutlinedIcon
                              sx={{
                                 color: theme.palette.black[4],
                                 width: 20,
                                 height: 20,
                              }}
                           />
                        </Box>
                     </Box>
                  </Box>

                  <Divider sx={{ borderColor: alpha(theme.palette.black[1], 0.06) }} />
               </Box>

               {/* Content */}
               <Grid
                  container
                  direction="column"
                  sx={{
                     flex: 1,
                     bgcolor: alpha(theme.palette.black[1], 0.02),
                     p: 2,
                     overflowY: 'auto',
                  }}
               >
                  {confirmMessage && (
                     <Box
                        sx={{
                           width: '100%',
                           p: 2,
                           bgcolor: theme.palette.white[0],
                           borderRadius: 3,
                           boxShadow: `0 1px 4px ${alpha(theme.palette.black[1], 0.06)}`,
                        }}
                     >
                        <Typography
                           sx={{
                              fontWeight: 600,
                              textAlign: 'center',
                              overflowWrap: 'break-word',
                              wordBreak: 'break-all',
                              color: theme.palette.black[1],
                           }}
                        >
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

               {/* Actions */}
               <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  columnGap={1.5}
                  sx={{
                     p: 2,
                     pt: 1.5,
                     pb: 'calc(12px + env(safe-area-inset-bottom))',
                     position: 'sticky',
                     bottom: 0,
                     borderTop: `1px solid ${alpha(theme.palette.black[1], 0.06)}`,
                     background: alpha(theme.palette.white[0], 0.95),
                     backdropFilter: 'blur(14px)',
                  }}
               >
                  <Button
                     onClick={dialogCloseFun}
                     disabled={request.isPending && !noApiRequest}
                     variant="cancelMobile"
                  >
                     انصراف
                  </Button>

                  <Button
                     onClick={confirmHandler}
                     disabled={request.isPending && !noApiRequest}
                     variant="confirmMobile"
                  >
                     {request.isPending && !noApiRequest ? (
                        <CustomCircularProgress size={18} />
                     ) : (
                        'تایید'
                     )}
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
            sx: {
               minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width'),
               borderRadius: sizeConverter(12, 'radius'),
               backgroundColor: theme.palette.white[2],
            },
         }}
         open={!!isDialogOpen}
         onClose={dialogCloseFun}
      >
         <Grid
            container
            direction="column"
            sx={{ p: sizeConverter(10, 'space') }}
         >
            <Grid container justifyContent="space-between" alignItems="center">
               <Grid size={11} gap={1} container alignItems="center">
                  <SvgComponent
                     height={sizeConverter(26)}
                     width={sizeConverter(26)}
                     icon={confirmIcon}
                     color={theme.palette.black[1]}
                  />

                  <Box>
                     <Typography variant="dialogTitle">تایید</Typography>
                     <Typography noWrap variant="dialogSubTitle">
                        {dialogTitle}
                     </Typography>
                  </Box>
               </Grid>

               <HighlightOffOutlinedIcon
                  sx={{
                     color: theme.palette.black[3],
                     width: sizeConverter(26),
                     height: sizeConverter(26),
                     cursor: 'pointer',
                     transition: '0.2s',
                     '&:hover': {
                        color: theme.palette.black[1],
                     },
                  }}
                  onClick={dialogCloseFun}
               />
            </Grid>

            {confirmMessage && (
               <Box
                  sx={{
                     mt: sizeConverter(10, 'spaceY'),
                     p: sizeConverter(12, 'space'),
                     bgcolor: theme.palette.bgColor[2],
                     borderRadius: sizeConverter(12, 'radius'),
                  }}
               >
                  <Typography color={theme.palette.black[1]}>
                     {confirmMessage}
                  </Typography>
               </Box>
            )}

            {customComponent && (
               <Box
                  sx={{
                     mt: sizeConverter(10, 'spaceY'),
                     borderRadius: sizeConverter(10, 'radius'),
                     overflowY: 'auto',
                  }}
               >
                  {customComponent}
               </Box>
            )}

            <Grid
               container
               justifyContent="flex-end"
               sx={{ mt: sizeConverter(10, 'spaceY') }}
            >
               <Button
                  onClick={dialogCloseFun}
                  variant="main"
                  sx={{ mr: sizeConverter(3, 'spaceX') }}
               >
                  انصراف
               </Button>

               <Button
                  onClick={confirmHandler}
                  variant="main"
                  sx={{
                     bgcolor: theme.palette.primary.main,
                     '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                     },
                  }}
               >
                  {request.isPending && !noApiRequest ? (
                     <CustomCircularProgress size={sizeConverter(16)} />
                  ) : (
                     'تایید'
                  )}
               </Button>
            </Grid>
         </Grid>
      </Dialog>
   )

}

export default GeneralConfirmDialog
