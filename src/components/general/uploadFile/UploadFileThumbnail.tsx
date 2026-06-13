// import Grid from '@mui/material/Grid2'
// import useUploadData from '@src/hooks/useUploadData'
// import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react'
// import { sizeConverter } from '@src/utility/sizeConverter'
// import LinearProgressWithLabel from '../LinearProgressWithLabel'
// import downloadIcon from 'public/icons/Download.svg'
// import deleteIcon from 'public/icons/Delete.svg'
// import reportIcon from 'public/icons/Reports.svg'
// import { useTheme } from '@mui/system'
// import TextWithTooltip from '../TextWithTooltip'
// import SvgComponent from '@src/utility/SvgComponent'
// import { snackbarOpenType } from '@src/data/type/snackbarOpen'
// import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
// import { UploadResponse } from '@src/data/type/uploadTypes'
// import getEndpoint from '@utility/getEndPoint.ts'

// type UploadFileThumbnailProps = {
//     file: { formData?: FormData; name: string; id: number; url?: string }
//     setFiles: Dispatch<SetStateAction<{ formData?: FormData; name: string; id: number; url?: string }[]>>
//     disabled: boolean
//     snackbarOpen?: snackbarOpenType
// }

// const UploadFileThumbnail = ({ file, setFiles, disabled, snackbarOpen }: UploadFileThumbnailProps) => {
//     const theme = useTheme()
//     const { mutation: uploadFile, progress, controller } = useUploadData('api/Base/upload')

//     const abortHandler = () => {
//         controller.abort()
//         setFiles((prev) => prev.slice(0, prev.length - 1))
//     }

//     const deleteHandler = (e: MouseEvent<HTMLElement>) => {
//         e?.stopPropagation()
//         if (!disabled) {
//             setFiles((prev: any[]) => [...prev.filter((item) => item.id !== file.id)])
//         }
//     }

//     const downloadHandler = () => {
//         if (!!file?.url) {
//             const link = document.createElement('a')
//             link.setAttribute('target', '_blank')
//             link.href = `${getEndpoint()}${file?.url}`
//             link.click()
//         }
//     }

//     useEffect(() => {
//         if (!!file.formData) {
//             uploadFile.mutate(file?.formData, {
//                 onSuccess: (data: UploadResponse | any) => {
//                     setFiles((prev) => addUrlById(prev, file?.id, data['data']))
//                 },
//                 onError: () => {
//                     setFiles((prev) => prev?.filter((i) => i?.id !== file?.id))
//                     snackbarOpen && snackbarOpen('Server Error', SNACKBAR_SEVERITIES.ERROR)
//                 },
//             })
//         }
//     }, [])

//     return (
//         <Grid container size={12}>
//             {!!file.formData && uploadFile?.isPending ? (
//                 <Grid
//                     container
//                     size={12}
//                     alignItems={'center'}
//                     columnGap={sizeConverter(8, 'spaceX')}
//                     sx={{ black: 'black.7', p: sizeConverter(5, 'space'), borderRadius: sizeConverter(8, 'radius') }}
//                 >
//                     <Grid
//                         container
//                         size="auto"
//                         sx={{ width: sizeConverter(20), height: sizeConverter(20) }}
//                         alignItems={'center'}
//                         justifyContent={'center'}
//                     >
//                         <SvgComponent
//                             width={sizeConverter(16)}
//                             height={sizeConverter(16)}
//                             icon={reportIcon}
//                             color={theme.palette.black[0]}
//                         />
//                     </Grid>
//                     <Grid container size="grow">
//                         <LinearProgressWithLabel value={progress} abortHandler={abortHandler} bgcolor={'bgColor.2'} color={'black.0'} />
//                     </Grid>
//                 </Grid>
//             ) : (
//                 <Grid
//                     container
//                     size={12}
//                     alignItems={'center'}
//                     justifyContent={'space-between'}
//                     sx={{ p: sizeConverter(5, 'space'), bgcolor: 'bgColor.2', borderRadius: sizeConverter(8, 'radius') }}
//                 >
//                     <Grid container alignItems={'center'} columnGap={sizeConverter(4, 'spaceX')}>
//                         <Grid container alignItems={'center'} justifyContent={'center'}>
//                             <SvgComponent
//                                 width={sizeConverter(16)}
//                                 height={sizeConverter(16)}
//                                 icon={reportIcon}
//                                 color={theme.palette.black[0]}
//                             />
//                         </Grid>
//                         <Grid container size="grow">
//                             <TextWithTooltip value={file?.name} tooltipPlacement={'bottom-start'} />
//                         </Grid>
//                     </Grid>
//                     <Grid container size="auto" alignItems={'center'} justifyContent={'flex-end'} columnGap={sizeConverter(4, 'spaceX')}>
//                         <Grid container onClick={downloadHandler} sx={{ mr: 0 }}>
//                             <SvgComponent
//                                 icon={downloadIcon}
//                                 width={sizeConverter(16)}
//                                 height={sizeConverter(16)}
//                                 color={theme.palette.black[0]}
//                             />
//                         </Grid>
//                         {!disabled && (
//                             <Grid container onClick={deleteHandler} sx={{ mr: 0 }}>
//                                 <SvgComponent
//                                     icon={deleteIcon}
//                                     width={sizeConverter(16)}
//                                     height={sizeConverter(16)}
//                                     color={theme.palette.black[0]}
//                                 />
//                             </Grid>
//                         )}
//                     </Grid>
//                 </Grid>
//             )}
//         </Grid>
//     )
// }

// export default UploadFileThumbnail

// const addUrlById = (array: any[], id: number, url: string) => {
//     const targetObject = array.find((obj) => obj.id === id)
//     if (targetObject) targetObject.url = url
//     return array
// }
import Grid from '@mui/material/Grid2'
import useUploadData from '@src/hooks/useUploadData'
import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react'
import LinearProgressWithLabel from '../LinearProgressWithLabel'
import downloadIcon from 'public/icons/Download.svg'
import deleteIcon from 'public/icons/Delete.svg'
import reportIcon from 'public/icons/Reports.svg'
import { useTheme } from '@mui/system'
import TextWithTooltip from '../TextWithTooltip'
import SvgComponent from '@src/utility/SvgComponent'
import { snackbarOpenType } from '@src/data/type/snackbarOpen'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { UploadResponse } from '@src/data/type/uploadTypes'
import getEndpoint from '@utility/getEndPoint.ts'
import { useDevice } from '@src/hooks/useDevice'
import { sizeConverter } from '@src/utility/sizeConverter'

type UploadFileThumbnailProps = {
    file: { formData?: FormData; name: string; id: number; url?: string }
    setFiles: Dispatch<
        SetStateAction<
            {
                formData?: FormData
                name: string
                id: number
                url?: string
            }[]
        >
    >
    disabled: boolean
    snackbarOpen?: snackbarOpenType
}

const UploadFileThumbnail = ({
    file,
    setFiles,
    disabled,
    snackbarOpen,
}: UploadFileThumbnailProps) => {
    const theme = useTheme()
    const { isMobile } = useDevice()

    const { mutation: uploadFile, progress, controller } =
        useUploadData('api/Base/upload')

    const abortHandler = () => {
        controller.abort()
        setFiles((prev) => prev.slice(0, prev.length - 1))
    }

    const deleteHandler = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()

        if (!disabled) {
            setFiles((prev: any[]) =>
                prev.filter((item) => item.id !== file.id)
            )
        }
    }

    const downloadHandler = () => {
        if (file?.url) {
            const link = document.createElement('a')
            link.setAttribute('target', '_blank')
            link.href = `${getEndpoint()}${file.url}`
            link.click()
        }
    }

    useEffect(() => {
        if (file.formData) {
            uploadFile.mutate(file.formData, {
                onSuccess: (data: UploadResponse | any) => {
                    setFiles((prev) =>
                        addUrlById(prev, file.id, data.data)
                    )
                },
                onError: () => {
                    setFiles((prev) =>
                        prev.filter((i) => i.id !== file.id)
                    )

                    snackbarOpen?.(
                        'Server Error',
                        SNACKBAR_SEVERITIES.ERROR
                    )
                },
            })
        }
    }, [])

    return (
        <Grid container size={12}>
            {!!file.formData && uploadFile.isPending ? (
                <Grid
                    container
                    size={12}
                    alignItems="center"
                    columnGap={isMobile ? 1 : 2}
                    sx={{
                        p: isMobile ? 1 : 1.5,
                        borderRadius: isMobile ? '8px' : '12px',
                        bgcolor: 'background.2',
                    }}
                >
                    <Grid
                        container
                        size="auto"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: isMobile ? 24 : 20,
                            height: isMobile ? 24 : 20,
                        }}
                    >
                        <SvgComponent
                            width={isMobile ? 18 : 16}
                            height={isMobile ? 18 : 16}
                            icon={reportIcon}
                            color={theme.palette.black[0]}
                        />
                    </Grid>

                    <Grid container size="grow">
                        <LinearProgressWithLabel
                            value={progress}
                            abortHandler={abortHandler}
                            bgcolor="bgColor.2"
                            color="black.0"
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid
                    container
                    size={12}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        p: isMobile ? 1.25 : 1.5,
                        bgcolor: 'bgColor.2',
                        borderRadius: isMobile ? '10px' : '8px',
                        minHeight: isMobile ? '48px' : '40px',
                    }}
                >
                    <Grid
                        container
                        alignItems="center"
                        wrap="nowrap"
                        sx={{
                            flex: 1,
                            overflow: 'hidden',
                            gap: isMobile ? 1 : 0.5,
                        }}
                    >
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                        >
                            <SvgComponent
                                width={isMobile ? 18 : 16}
                                height={isMobile ? 18 : 16}
                                icon={reportIcon}
                                color={theme.palette.black[0]}
                            />
                        </Grid>

                        <Grid
                            container
                            size="grow"
                            sx={{
                                overflow: 'hidden',
                            }}
                        >
                            <TextWithTooltip
                                fontSize={isMobile ? 9 : sizeConverter(9)}
                                value={file.name}
                                tooltipPlacement="bottom-start"
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        size="auto"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{
                            gap: isMobile ? 1.5 : 1,
                            ml: 1,
                        }}
                    >
                        <Grid
                            container
                            onClick={downloadHandler}
                            sx={{
                                cursor: 'pointer',
                            }}
                        >
                            <SvgComponent
                                icon={downloadIcon}
                                width={isMobile ? 20 : 16}
                                height={isMobile ? 20 : 16}
                                color={theme.palette.black[0]}
                            />
                        </Grid>

                        {!disabled && (
                            <Grid
                                container
                                onClick={deleteHandler}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                <SvgComponent
                                    icon={deleteIcon}
                                    width={isMobile ? 20 : 16}
                                    height={isMobile ? 20 : 16}
                                    color={theme.palette.red?.[0] || theme.palette.black[0]}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default UploadFileThumbnail

const addUrlById = (array: any[], id: number, url: string) => {
    const targetObject = array.find((obj) => obj.id === id)

    if (targetObject) {
        targetObject.url = url
    }

    return [...array]
}