import CustomCircularProgress from './CustomCircularProgress'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import CheckboxComponent from './hookFromInputs/CheckboxComp'
import { useForm } from 'react-hook-form'
import { usePostData } from '@src/hooks/usePostData'
import { ResType } from '@src/data/type/resType'
import confirmIcon from '@public/icons/Confirm.svg'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import SvgComponent from '@src/utility/SvgComponent'
import { Typography, useTheme } from '@mui/material'
import { snackbarOpenType } from '@src/data/type/snackbarOpen'
import { updateQueryParam } from '@components/section/AssignDevice.tsx'
import useKioskStore from '@src/store/kioskStore.ts'

type ItemType = {
    label: string
    key: string
    size?: number
    fieldType?: string
}

type DialogProps = {
    width: number
    createEndpoint: string
    dataSubmit: any
    snackbarOpen?: snackbarOpenType
    close: () => void
    bgOff?: string
    array: ItemType[]
}

const SettingDialog = ({ array, dataSubmit, width, createEndpoint, bgOff, snackbarOpen, close }: DialogProps) => {
    const { selectedKiosks } = useKioskStore()
    const { control, handleSubmit, setValue, getValues } = useForm({})
    const theme = useTheme()

    const createItem = usePostData(createEndpoint ? createEndpoint : '')

    const submitButton = (data: any) => {
        let listChangeItems: string[] = []

        array.forEach((element: ItemType) => {
            if (data[element.key]) {
                listChangeItems.push(element?.['key'])
            }
        })

        const updateData = dataSubmit?.map((i: Record<string, number | string | null>) => ({
            ...i,
            changedProperties: [...listChangeItems],
        }))
        createItem?.mutate(updateData, {
            onSuccess: (data) => {
                const res = data as ResType
                if (res.error === 0) {
                    !!snackbarOpen && snackbarOpen('مورد شما با موفقیت انجام شد', SNACKBAR_SEVERITIES.SUCCESS)
                    updateQueryParam(`showSettings`, 'y')
                    updateQueryParam(`kioskSerial`, JSON.stringify(selectedKiosks))
                    close()
                } else {
                    !!snackbarOpen && snackbarOpen(res.error + ' ' + res.errorMessage, SNACKBAR_SEVERITIES.ERROR)
                }
            },
            onError: (err: Error) => {
                !!snackbarOpen && snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
            },
        })
    }

    const handelToggleSelectedAll = () => {
        if (Object.values(getValues()).every((value: boolean) => value)) {
            array?.forEach((objectItem: ItemType) => {
                setValue(objectItem.key, false)
            })
        } else {
            array?.forEach((objectItem: ItemType) => {
                setValue(objectItem.key, true)
            })
        }
    }

    return (
        <Dialog
            PaperProps={{
                style: {
                    minWidth: width ? width : sizeConverter(600, 'width'),
                    borderRadius: sizeConverter(12, 'radius'),
                },
            }}
            disableRestoreFocus
            open={!!open}
        >
            <form onSubmit={handleSubmit(submitButton)}>
                <Grid
                    container
                    size={12}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        maxWidth: width ? width : sizeConverter(600, 'width'),
                        p: sizeConverter(10, 'space'),
                    }}
                >
                    <Grid
                        container
                        size={12}
                        direction="row"
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        sx={{ pb: sizeConverter(5, 'spaceY') }}
                    >
                        <Grid size={10} gap={1} container alignItems={'center'} direction="row">
                            <Grid container alignItems={'center'} size="auto">
                                <SvgComponent
                                    height={sizeConverter(26)}
                                    width={sizeConverter(26)}
                                    icon={confirmIcon}
                                    color={theme?.palette?.black['1']}
                                />
                            </Grid>
                            <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
                                <Grid size={12}>
                                    <Typography noWrap variant="dialogSubTitle">
                                        انتخاب تغییرات
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container size={1}>
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
                                onClick={() => close()}
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        size={12}
                        justifyContent={'center'}
                        alignItems={'center'}
                        direction="row"
                        sx={{
                            my: sizeConverter(5, 'spaceY'),
                            bgcolor: !bgOff ? 'background.2' : 'transparent',
                            borderRadius: sizeConverter(12, 'radius'),
                        }}
                    >
                        <Grid
                            container
                            size={12}
                            justifyContent={'space-between'}
                            alignItems={'end'}
                            // rowGap={sizeConverter(10, 'space')}
                            // columnGap={sizeConverter(10, 'space')}
                            sx={{
                                maxHeight: window.innerHeight - sizeConverter(360, 'height'),
                                overflow: 'auto',
                            }}
                        >
                            <Button variant="main" onClick={handelToggleSelectedAll} sx={{ width: 1 }}>
                                انتخاب همه / حذف همه
                            </Button>
                            {array?.map((i: Record<string, any>) => {
                                return (
                                    <Grid
                                        container
                                        justifyContent={'flex-start'}
                                        alignContent={'center'}
                                        size={12}
                                        sx={{
                                            borderRadius: sizeConverter(12, 'radius'),
                                            borderColor: theme.palette.black[6],
                                            borderWidth: sizeConverter(1),
                                            borderStyle: 'solid',
                                            bgcolor: theme.palette.bgColor[2],
                                            my: sizeConverter(2, 'spaceY'),
                                            pl: sizeConverter(4, 'spaceX'),
                                            height: sizeConverter(30, 'height'),
                                        }}
                                    >
                                        <CheckboxComponent item={{ value: i.key, size: 12, title: i.label }} control={control} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        size={12}
                        justifyContent={'flex-end'}
                        alignItems={'center'}
                        sx={{ mt: sizeConverter(5, 'spaceY') }}
                        columnGap={sizeConverter(5, 'spaceX')}
                    >
                        <Button
                            onClick={() => close()}
                            variant="main"
                            sx={{
                                bgcolor: '#e1e1e1',
                                color: '#000',
                                '&:hover': { bgcolor: '#c4c4c4' },
                            }}
                        >
                            انصراف
                        </Button>
                        <Button type={'submit'} variant="main">
                            {createItem?.isPending ? (
                                <CustomCircularProgress noPadding color={'white.0'} size={sizeConverter(16)} />
                            ) : (
                                <>{'اعمال'}</>
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    )
}

export default SettingDialog
