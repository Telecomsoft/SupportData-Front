import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
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
    const { removeItem } = usePaymentListStore()

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

    return (
        <Dialog
            PaperProps={{
                style: { minWidth: dialogWidth ? dialogWidth : sizeConverter(600, 'width') },
            }}
            open={!!isDialogOpen}
            disableRestoreFocus
        >
            <Grid container justifyContent={'center'} alignItems={'center'} sx={{ p: sizeConverter(10, 'space') }}>
                <Grid container size={12} direction="row" justifyContent={'space-between'} alignItems={'center'}>
                    <Grid size={11} gap={1} container alignItems={'center'} direction="row">
                        <Grid container alignItems={'center'} size="auto">
                            <SvgComponent
                                height={sizeConverter(26)}
                                width={sizeConverter(26)}
                                icon={deleteIcon}
                                color={theme?.palette?.black['1']}
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
                            transition: '0.2s ease-in-out',
                            '&:hover': {
                                color: '#000',
                            },
                        }}
                        onClick={() => dialogCloseFun()}
                    />
                </Grid>
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
                        {!deleteDescription ? <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
                            <Typography variant="alertHeader">آیا از حذف این مورد اطمینان دارید ؟</Typography>
                        </Grid>
                            :
                            <Grid container justifyContent={'center'} alignItems={'center'} size={12}>
                                <Typography
                                    variant="alertText"
                                    sx={{
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-all',
                                        textAlign: 'justify',
                                        whiteSpace: 'break-spaces',
                                        userSelect: 'text',
                                    }}
                                >
                                    {deleteDescription}
                                </Typography>
                            </Grid>}
                    </Grid>
                </Grid>
                <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} sx={{ mt: sizeConverter(10, 'spaceY') }}>
                    <Button
                        onClick={() => dialogCloseFun()}
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
