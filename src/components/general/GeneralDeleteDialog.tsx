// import Grid from '@mui/material/Grid2'
// import Dialog from '@mui/material/Dialog'
// import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import { useDeleteData } from '@hooks/useDeleteData'
// import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
// import CustomCircularProgress from '@components/general/CustomCircularProgress'
// import deleteIcon from '@public/icons/Delete.svg'
// import SvgComponent from '@utility/SvgComponent'
// import { useTheme } from '@mui/system'
// import { sizeConverter } from '@utility/sizeConverter'
// import { snackbarOpenType } from '@type/snackbarOpen.ts'
// import { ResType } from '@type/resType.ts'
// import usePaymentListStore from '@src/store/paymentListStore'

// type deleteDialogProps = {
//     deleteID?: number | string
//     withoutDeleteID?: boolean
//     deleteEndPoint: string
//     deleteArray?: any
//     customFunAfterSuccess?: () => void
//     dialogWidth?: number
//     dialogTitle: string
//     deleteDescription: string
//     snackbarOpen: snackbarOpenType
//     isDialogOpen: 'add' | 'edit' | null
//     dialogCloseFun: () => void
//     isNotSendServer?: boolean
// }
// const GeneralDeleteDialog = ({
//     deleteID,
//     withoutDeleteID,
//     deleteEndPoint,
//     deleteArray,
//     customFunAfterSuccess,
//     dialogWidth,
//     dialogTitle,
//     deleteDescription,
//     snackbarOpen,
//     isDialogOpen,
//     dialogCloseFun,
//     isNotSendServer = false
// }: deleteDialogProps) => {

//     const endPoint = withoutDeleteID ? deleteEndPoint : deleteEndPoint + deleteID
//     const deleteItem = useDeleteData(endPoint)
//     const theme = useTheme()
//     const { removeItem } = usePaymentListStore()

//     const submitDeleteButton = () => {
//         deleteItem?.mutate(deleteArray ? deleteArray : undefined, {
//             onSuccess: (data) => {
//                 const res = data as ResType
//                 if (res.error === 0) {
//                     snackbarOpen('حذف با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
//                     customFunAfterSuccess?.()
//                     dialogCloseFun()
//                 } else {
//                     snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
//                 }
//             },
//             onError: (err: Error) => {
//                 snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
//             },
//         })
//     }

//     const handlerSendLocal = () => {
//         removeItem(deleteID)
//         dialogCloseFun()
//         snackbarOpen('حذف با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
//     }

//     return (
//         <Dialog
//             PaperProps={{
//                 style: { minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width') },
//             }}
//             open={!!isDialogOpen}
//             disableRestoreFocus
//         >
//             <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: sizeConverter(10, 'space') }}>
//                 <Grid container size={12} direction="row" justifyContent={'space-between'} alignItems={'center'}>
//                     <Grid size={11} gap={1} container alignItems={'center'} direction="row">
//                         <Grid container alignItems={'center'} size="auto">
//                             <SvgComponent
//                                 height={sizeConverter(26)}
//                                 width={sizeConverter(26)}
//                                 icon={deleteIcon}
//                                 color={theme?.palette?.black['1']}
//                             />
//                         </Grid>
//                         <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
//                             <Typography variant="dialogTitle">حذف</Typography>
//                             <Grid size={12}>
//                                 <Typography noWrap variant="dialogSubTitle">
//                                     {dialogTitle}
//                                 </Typography>
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                     <HighlightOffOutlinedIcon
//                         sx={{
//                             color: '#CCCCCC',
//                             width: sizeConverter(26),
//                             height: sizeConverter(26),
//                             cursor: 'pointer',
//                             transition: '0.2s ease-in-out',
//                             '&:hover': {
//                                 color: '#000',
//                             },
//                         }}
//                         onClick={() => dialogCloseFun()}
//                     />
//                 </Grid>
//                 <Grid
//                     container
//                     size={12}
//                     direction="row"
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                     sx={{ mt: sizeConverter(10, 'spaceY') }}
//                 >
//                     <Grid
//                         container
//                         size={12}
//                         justifyContent={'center'}
//                         alignItems={'center'}
//                         direction="row"
//                         sx={{
//                             p: sizeConverter(12, 'space'),
//                             bgcolor: 'bgColor.1',
//                             borderRadius: sizeConverter(12, 'radius'),
//                         }}
//                     >
//                         {!deleteDescription ? <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
//                             <Typography variant="alertHeader">آیا از حذف این مورد اطمینان دارید ؟</Typography>
//                         </Grid>
//                             :
//                             <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
//                                 <Typography
//                                     variant="alertText"
//                                     sx={{
//                                         overflowWrap: 'break-word',
//                                         wordBreak: 'break-all',
//                                         textAlign: 'justify',
//                                         whiteSpace: 'break-spaces',
//                                         userSelect: 'text',
//                                     }}
//                                 >
//                                     {deleteDescription}
//                                 </Typography>
//                             </Grid>}
//                     </Grid>
//                 </Grid>
//                 <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} sx={{ mt: sizeConverter(10, 'spaceY') }}>
//                     <Button
//                         onClick={() => dialogCloseFun()}
//                         variant="main"
//                         sx={{
//                             bgcolor: '#e1e1e1',
//                             color: '#000',
//                             mr: sizeConverter(3, 'spaceX'),
//                             '&:hover': { bgcolor: '#c4c4c4' },
//                         }}
//                     >
//                         انصراف
//                     </Button>
//                     <Button
//                         onClick={isNotSendServer ? handlerSendLocal : submitDeleteButton}
//                         variant="main"
//                         sx={{
//                             bgcolor: 'red.0',
//                             '&:hover': { bgcolor: '#b60033' },
//                         }}
//                     >
//                         {deleteItem?.isPending ? <CustomCircularProgress size={sizeConverter(16)} /> : 'حذف'}
//                     </Button>
//                 </Grid>
//             </Grid>
//         </Dialog>
//     )
// }

// export default GeneralDeleteDialog
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useDeleteData } from '@hooks/useDeleteData'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import deleteIcon from '@public/icons/Delete.svg'
import SvgComponent from '@utility/SvgComponent'
import { useTheme } from '@mui/system'
import { sizeConverter } from '@utility/sizeConverter'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { ResType } from '@type/resType.ts'
import usePaymentListStore from '@src/store/paymentListStore'
import { useDevice } from '@src/hooks/useDevice'

type deleteDialogProps = {
    deleteID?: number | string
    withoutDeleteID?: boolean
    deleteEndPoint: string
    deleteArray?: any
    customFunAfterSuccess?: () => void
    dialogWidth?: number
    dialogTitle: string
    deleteDescription: string
    snackbarOpen: snackbarOpenType
    isDialogOpen: 'add' | 'edit' | null
    dialogCloseFun: () => void
    isNotSendServer?: boolean
}

const GeneralDeleteDialog = ({
    deleteID,
    withoutDeleteID,
    deleteEndPoint,
    deleteArray,
    customFunAfterSuccess,
    dialogWidth,
    dialogTitle,
    deleteDescription,
    snackbarOpen,
    isDialogOpen,
    dialogCloseFun,
    isNotSendServer = false
}: deleteDialogProps) => {

    const endPoint = withoutDeleteID ? deleteEndPoint : deleteEndPoint + deleteID
    const deleteItem = useDeleteData(endPoint)
    const theme = useTheme()
    const isMobile = useDevice()
    const { removeItem } = usePaymentListStore()

    const dangerColor = 'red.0'

    const submitDeleteButton = () => {
        deleteItem?.mutate(deleteArray ? deleteArray : undefined, {
            onSuccess: (data) => {
                const res = data as ResType
                if (res.error === 0) {
                    snackbarOpen('حذف با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
                    customFunAfterSuccess?.()
                    dialogCloseFun()
                } else {
                    snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                }
            },
            onError: (err: Error) => {
                snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
            },
        })
    }

    const handlerSendLocal = () => {
        removeItem(deleteID)
        dialogCloseFun()
        snackbarOpen('حذف با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
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
                                        bgcolor: dangerColor,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <SvgComponent height={20} width={20} icon={deleteIcon} color={theme.palette.dataGrid.main} />
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
                                        حذف
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
                        sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.02)', p: 2 }}>
                        <Box
                            sx={{
                                width: '100%',
                                p: 2,
                                bgcolor: '#fff',
                                borderRadius: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            }}>

                            {deleteDescription ? (
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-all',
                                    }}>
                                    {deleteDescription}
                                </Typography>
                            ) : <Typography sx={{ fontSize: 13, textAlign: 'center', mb: 1 }}>
                                آیا از حذف این مورد اطمینان دارید؟
                            </Typography>}
                        </Box>
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
                            disabled={deleteItem?.isPending}
                            variant='cancelMobile'>
                            انصراف
                        </Button>

                        <Button
                            onClick={isNotSendServer ? handlerSendLocal : submitDeleteButton}
                            disabled={deleteItem?.isPending}
                            variant='confirmMobile'>
                            {deleteItem?.isPending ? <CustomCircularProgress size={18} /> : 'حذف'}
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
                style: { minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width') },
            }}
            open={!!isDialogOpen}
            disableRestoreFocus
        >
            <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: sizeConverter(10, 'space') }}>
                {/* Header */}
                <Grid container size={12} direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <Grid size={11} gap={1} container alignItems={'center'} direction="row">
                        <Grid container alignItems={'center'} size="auto">
                            <SvgComponent
                                height={sizeConverter(26)}
                                width={sizeConverter(26)}
                                icon={deleteIcon}
                                color={theme?.palette?.black?.['1']}
                            />
                        </Grid>
                        <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
                            <Typography variant="dialogTitle">حذف</Typography>
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
                            '&:hover': { color: '#000' },
                        }}
                        onClick={dialogCloseFun}
                    />
                </Grid>

                {/* Content */}
                <Grid container size={12} sx={{ mt: sizeConverter(10, 'spaceY') }}>
                    <Grid
                        container
                        size={12}
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{
                            p: sizeConverter(12, 'space'),
                            bgcolor: 'bgColor.1',
                            borderRadius: sizeConverter(12, 'radius'),
                        }}
                    >
                        <Typography variant="alertHeader" sx={{ textAlign: 'center' }}>
                            {deleteDescription || 'آیا از حذف این مورد اطمینان دارید ؟'}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Buttons */}
                <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} sx={{ mt: sizeConverter(10, 'spaceY') }}>
                    <Button
                        onClick={dialogCloseFun}
                        variant="main"
                        sx={{
                            bgcolor: '#e1e1e1',
                            color: '#000',
                            mr: sizeConverter(3, 'spaceX'),
                            '&:hover': { bgcolor: '#c4c4c4' },
                        }}
                    >
                        انصراف
                    </Button>
                    <Button
                        onClick={isNotSendServer ? handlerSendLocal : submitDeleteButton}
                        variant="main"
                        sx={{
                            bgcolor: 'red.0',
                            '&:hover': { bgcolor: '#b60033' },
                        }}
                    >
                        {deleteItem?.isPending ? <CustomCircularProgress size={sizeConverter(16)} /> : 'حذف'}
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}

export default GeneralDeleteDialog