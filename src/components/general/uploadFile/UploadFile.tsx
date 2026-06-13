import { useDropzone } from 'react-dropzone'
import Grid from '@mui/material/Grid2'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { sizeConverter } from '@src/utility/sizeConverter'
import Typography from '@mui/material/Typography'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import UploadFileThumbnail from './UploadFileThumbnail'
import { LightTooltip } from '../StyledTooltip'
import { formTypes } from '@src/data/type/reactHookFormType'
import { snackbarOpenType } from '@src/data/type/snackbarOpen'
import { styled } from '@mui/system'
import uploadFileStore from '@src/store/uploadFileStore'
import { useDevice } from '@src/hooks/useDevice'

type UploadFileProps = {
    item: {
        label?: string
        multiple?: false
        validators?: Record<string, any>
        value: string
        size?: number
        disabled?: boolean
        uploadType?: 'single' | 'multiple'
    },
    helperText?: string,
    error?: boolean,
    clearErrors: any,
    snackbarOpen?: snackbarOpenType
    urls?: string | string[]
} & formTypes

// const StyledFieldset = styled('fieldset')(({ theme }) => ({
//     borderRadius: sizeConverter(25, 'radius'),
//     border: `${sizeConverter(1)}px solid ${theme.palette.black['7']}`,
//     margin: 0,
//     padding: sizeConverter(4),
//     minHeight: sizeConverter(30, 'height'),
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     transition: 'all 0.2s ease-in-out',
//     '&:hover': {
//         borderColor: theme.palette.black['1'],
//     },
//     // '& legend': {
//     //     padding: `${sizeConverter(50,'spaceX')}px`,
//     //     fontSize: sizeConverter(12),
//     //     lineHeight: 1.2,
//     //     color: theme.palette.black['1'],
//     // },
//     '&.error': {
//         borderColor: theme.palette.error.main,
//     },
// }))
const StyledFieldset = styled('fieldset')(
    ({ theme }) => ({
        borderRadius: '12px',
        border: `1px solid ${theme.palette.dataGrid.main}`,
        margin: 0,
        padding: '8px',
        minHeight: '56px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        transition: 'all 0.2s ease-in-out',

        '&:hover': {
            borderColor: theme.palette.dataGrid.bgHeaderPinColor,
        },

        '&.error': {
            borderColor: theme.palette.error.main,
        },
    })
)

const UploadFile = ({ item, watch, setValue, register, error, helperText, snackbarOpen, urls, clearErrors }: UploadFileProps) => {
    const [files, setFiles] = useState<{ formData?: FormData; id: number; name: string; url?: string }[]>([])
    const { setSelectUpload } = uploadFileStore()
    const { isMobile } = useDevice()

    const onDrop = useCallback(
        (uploadedFiles: any[]) => {
            if (item?.uploadType === 'single') {
                const file = uploadedFiles[0]
                const formData = new FormData()
                formData.append('FileName', file.name)
                formData.append('FileContent', file)

                setFiles([{ formData, id: 1, name: file.name }])
                setSelectUpload({ formData, id: 1, name: file.name })
            } else {
                uploadedFiles.forEach((file) => {
                    const formData = new FormData()
                    formData.append('FileName', file.name)
                    formData.append('FileContent', file)
                    setFiles((prev) => [...(prev || []), { formData, id: (prev?.length || 0) + 1, name: file.name }])
                })
            }
        },
        [item?.uploadType]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: item?.uploadType === 'multiple',
    })

    useEffect(() => {
        if (setValue && files) {
            if (item?.uploadType === 'multiple') {
                setValue(
                    item?.value,
                    files.filter((i) => !!i?.url).map((i) => i?.url),
                    { shouldDirty: true }
                )
            } else {
                setValue(item?.value, files.map((i) => i?.url)[0], { shouldDirty: true })
            }

            if (files.length > 0) {
                clearErrors(item?.value)
            }
        }
    }, [files.filter((i) => !!i.url).length])

    useLayoutEffect(() => {
        if (register) {
            register(item?.value!, { required: item?.validators?.required })
        }
        if (urls) {
            if (item?.uploadType === 'multiple') {
                setFiles(
                    (urls as string[]).map((i, index) => ({
                        id: index + 1,
                        formData: undefined,
                        name: i.split('/').pop() || '',
                        url: i,
                    }))
                )
            } else {
                setFiles([
                    {
                        id: 1,
                        formData: undefined,
                        name: (urls as string).split('/').pop() || '',
                        url: urls as string,
                    },
                ])
            }
        }

        const watchedValue = watch && watch(item?.value!)
        if (watchedValue) {
            if (item?.uploadType === 'multiple') {
                setFiles(
                    watchedValue.map((i: string, index: number) => ({
                        id: index + 1,
                        formData: undefined,
                        name: i.split('/').pop() || '',
                        url: i,
                    }))
                )
            } else {
                setFiles([{ id: 1, formData: undefined, name: watchedValue.split('/').pop() || '', url: watchedValue }])
            }
        }
    }, [register, urls, watch, item?.value])


    // return (
    //     <Grid container size={item?.size || 12} alignContent={'start'} justifyContent={'start'}>
    //         <StyledFieldset className={error ? 'error' : ''}>
    //             <Grid
    //                 container
    //                 alignContent={'center'}
    //                 alignItems={'center'}
    //                 justifyContent={'space-between'}
    //                 size={12}
    //                 columnSpacing={sizeConverter(3, 'spaceX')}
    //                 sx={{
    //                     position: 'relative',
    //                 }}
    //             >
    //                 {files.length === 0 && (
    //                     <Typography variant="caption" sx={{ position: 'absolute', left: 0, color: 'black.4' }}>
    //                         {`بارگزاری ${item?.label}`}
    //                         {item?.validators?.required ? (
    //                             <span
    //                                 style={{
    //                                     color: 'red',
    //                                     marginRight: sizeConverter(20, 'spaceX'),
    //                                 }}
    //                             >
    //                                 *
    //                             </span>
    //                         ) : (
    //                             ''
    //                         )}
    //                     </Typography>
    //                 )}

    //                 <Grid container size="grow" rowGap={sizeConverter(4, 'spaceY')}>
    //                     {files.length > 0 ? (
    //                         files?.map((i) => (
    //                             <UploadFileThumbnail
    //                                 key={i.id}
    //                                 file={i}
    //                                 setFiles={setFiles}
    //                                 disabled={!!item?.disabled}
    //                                 snackbarOpen={snackbarOpen}
    //                             />
    //                         ))
    //                     ) : (
    //                         <Typography sx={{ pl: sizeConverter(6, 'spaceX'), fontSize: sizeConverter(10) }}>
    //                             {item?.disabled && 'No data to display'}
    //                         </Typography>
    //                     )}
    //                 </Grid>
    //                 <Grid
    //                     container
    //                     size={'auto'}
    //                     alignItems={'center'}
    //                     justifyContent={'center'}
    //                     {...getRootProps({ className: 'dropzone' })}
    //                 >
    //                     {!item?.disabled && (
    //                         <>
    //                             <input {...getInputProps()} />
    //                             <LightTooltip title={'افزودن'} enterDelay={500} enterNextDelay={500} placement="bottom">
    //                                 <AddCircleIcon
    //                                     sx={{
    //                                         transition: 'all 0.2s ease-in-out',
    //                                         width: sizeConverter(24),
    //                                         height: sizeConverter(24),
    //                                         color: 'black.0',
    //                                         cursor: 'pointer',
    //                                         '&:hover': { color: 'main.0' },
    //                                         '&:focus': { outline: 'none' },
    //                                     }}
    //                                 />
    //                             </LightTooltip>
    //                         </>
    //                     )}
    //                 </Grid>
    //             </Grid>
    //         </StyledFieldset>
    //         {error &&
    //             <Typography sx={{ pl: sizeConverter(6, 'spaceX'), color: 'error.main', fontSize: sizeConverter(10) }}>
    //                 {helperText}
    //             </Typography>
    //         }

    //     </Grid>
    // )
    return (
        <Grid
            container
            size={item?.size || 12}
            alignContent="start"
            justifyContent="start"
            sx={{ p: isMobile ? 1 : 0 }}
        >
            <StyledFieldset className={error ? 'error' : ''}>
                <Grid
                    container
                    alignContent="center"
                    alignItems="center"
                    justifyContent="space-between"
                    size={12}
                    columnSpacing={isMobile ? 1 : sizeConverter(3, 'spaceX')}
                    sx={{
                        position: 'relative',
                        minHeight: isMobile ? 48 : undefined,
                    }}
                >
                    {files?.length === 0 && (
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                left: 0,
                                color: 'black.4',
                                fontSize: isMobile
                                    ? '12px'
                                    : undefined,
                                px: isMobile ? 1 : 0,
                            }}
                        >
                            {`بارگزاری ${item?.label}`}

                            {item?.validators?.required && (
                                <span
                                    style={{
                                        color: 'red',
                                        marginRight: isMobile
                                            ? 4
                                            : sizeConverter(
                                                20,
                                                'spaceX'
                                            ),
                                    }}
                                >
                                    *
                                </span>
                            )}
                        </Typography>
                    )}

                    <Grid
                        container
                        size="grow"
                        rowGap={
                            isMobile
                                ? 1
                                : sizeConverter(4, 'spaceY')
                        }
                    >
                        {files.length > 0 ? (
                            files.map((i) => (
                                <UploadFileThumbnail
                                    key={i.id}
                                    file={i}
                                    setFiles={setFiles}
                                    disabled={!!item?.disabled}
                                    snackbarOpen={snackbarOpen}
                                />
                            ))
                        ) : (
                            <Typography
                                sx={{
                                    pl: isMobile
                                        ? 1
                                        : sizeConverter(
                                            6,
                                            'spaceX'
                                        ),
                                    fontSize: isMobile
                                        ? '12px'
                                        : sizeConverter(10),
                                }}
                            >
                                {item?.disabled &&
                                    'No data to display'}
                            </Typography>
                        )}
                    </Grid>

                    <Grid
                        container
                        size="auto"
                        alignItems="center"
                        justifyContent="center"
                        {...getRootProps({
                            className: 'dropzone',
                        })}
                    >
                        {!item?.disabled && (
                            <>
                                <input {...getInputProps()} />

                                <LightTooltip
                                    title="افزودن"
                                    enterDelay={500}
                                    enterNextDelay={500}
                                    placement="bottom"
                                >
                                    <AddCircleIcon
                                        sx={{
                                            transition:
                                                'all 0.2s ease-in-out',

                                            width: isMobile
                                                ? 32
                                                : sizeConverter(
                                                    24
                                                ),

                                            height: isMobile
                                                ? 32
                                                : sizeConverter(
                                                    24
                                                ),

                                            color: 'black.0',
                                            cursor: 'pointer',

                                            '&:hover': {
                                                color: 'main.0',
                                            },

                                            '&:focus': {
                                                outline:
                                                    'none',
                                            },
                                        }}
                                    />
                                </LightTooltip>
                            </>
                        )}
                    </Grid>
                </Grid>
            </StyledFieldset>

            {error && (
                <Typography
                    sx={{
                        pl: isMobile
                            ? 1
                            : sizeConverter(
                                6,
                                'spaceX'
                            ),
                        mt: isMobile ? 0.5 : 0,
                        color: 'error.main',
                        fontSize: isMobile
                            ? '12px'
                            : sizeConverter(10),
                    }}
                >
                    {helperText}
                </Typography>
            )}
        </Grid>
    )
}

export default UploadFile
