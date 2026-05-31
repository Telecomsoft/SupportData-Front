/* eslint-disable */

import { FunctionComponent, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid2'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { sizeConverter } from '@src/utility/sizeConverter'
import { Button, Divider, Typography } from '@mui/material'
import StyledTextField from '@components/general/input/StyledTextField'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { usePostData } from '@src/hooks/usePostData'
import Highlighted from '@utility/Highlighted.tsx'
import useKiosItemskStore from '@src/store/kioskItemsStore'
import { KioskData } from '@src/data/type/NetworkTypes'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'

type DataKiosk = { model: string; kioskName: string; branchCode: string; region: string; kioskSerial: string }[]

const AssignKiosk: FunctionComponent<GeneralInfoProps> = ({ data, infoOptions, height }) => {
    const { selectedKiosks, toggleKioskSelection } = useKiosItemskStore()

    const [searchTerm, setSearchTerm] = useState('')

    const handleToggle = (kioskSerial: Record<string, any>) => {
        toggleKioskSelection(kioskSerial)
    }

    const filteredData = data?.filter(
        (kiosk: KioskData) =>
            kiosk.kioskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kiosk.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kiosk.branchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kiosk.model?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const createItem = usePostData(infoOptions?.createEndpoint ? infoOptions?.createEndpoint : '')
    const statusChecked = (data: DataKiosk) => {
        return (
            data?.length > 0 &&
            data?.map((kiosk: KioskData) => (
                <Grid
                    columnGap={sizeConverter(4, 'spaceX')}
                    container
                    alignItems="center"
                    justifyContent={'space-between'}
                    size={12}
                    key={kiosk.kioskSerial}
                    onClick={() => handleToggle(kiosk)}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        },
                        borderColor: selectedKiosks?.map((item: Record<string, any>) => item.kioskSerial)?.includes(kiosk?.kioskSerial)
                            ? 'primary.main'
                            : 'black.5',
                        borderStyle: 'solid',
                        borderWidth: sizeConverter(1, 'width'),
                        px: sizeConverter(3, 'spaceX'),
                        my: sizeConverter(2, 'spaceX'),
                        borderRadius: sizeConverter(6, 'radius'),
                    }}
                >
                    <Grid container size="auto" alignItems={'center'}>
                        <Checkbox
                            icon={
                                <CircleIcon
                                    sx={{
                                        width: sizeConverter(20),
                                        height: sizeConverter(20),
                                        color: 'white.0',
                                        stroke: '#ccc',
                                        strokeWidth: 2,
                                        padding: 0,
                                    }}
                                />
                            }
                            checkedIcon={
                                <CheckCircleIcon
                                    sx={{
                                        padding: 0,
                                        color: 'main.primary',
                                        width: sizeConverter(20),
                                        height: sizeConverter(20),
                                    }}
                                />
                            }
                            checked={selectedKiosks?.map((item: Record<string, any>) => item.kioskSerial)?.includes(kiosk?.kioskSerial)}
                            onChange={() => handleToggle(kiosk)}
                            sx={{ pointerEvents: 'none', p: 0 }}
                        />
                    </Grid>
                    <Grid
                        container
                        size="grow"
                        sx={{
                            '& .MuiTypography-root ': {
                                width: 1,
                                lineHeight: sizeConverter(1.2),
                            },
                        }}
                    >
                        {[
                            { title: 'نام کیوسک', value: 'kioskName', size: 4 },
                            {
                                title: 'مدل',
                                value: 'model',
                                size: 3,
                            },
                            { title: 'استان', value: 'region', size: 3 },
                            {
                                title: 'کد شعبه',
                                value: 'branchCode',
                                size: 2,
                            },
                        ].map((property: { title: string; value: string; size: number }) => {
                            return (
                                <Grid
                                    container
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                    alignContent={'space-between'}
                                    size={property.size}
                                    sx={{
                                        p: sizeConverter(4, 'space'),
                                        my: sizeConverter(3, 'spaceY'),
                                        borderLeft: sizeConverter(1),
                                    }}
                                >
                                    <Grid size={12}>
                                        <Typography variant="normalBold">
                                            <Highlighted highlight={searchTerm} text={property.title} />
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                textAlign: 'left',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '1',
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            <Highlighted
                                                highlight={searchTerm}
                                                text={
                                                    kiosk[property.value as keyof KioskData]
                                                        ? String(kiosk![property.value as keyof KioskData])
                                                        : ' - '
                                                }
                                            />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            ))
        )
    }

    return (
        <Grid size={12} container sx={{ px: sizeConverter(4, 'spaceX'), height: height }}>
            <Grid size={12} sx={{ height: 'auto' }}>
                <Grid container justifyContent={'space-between'} sx={{ my: sizeConverter(3, 'spaceY') }} alignItems={'center'} size="grow">
                    <StyledTextField
                        placeholder={'جستجوی در  نام ، استان ، کد شعبه ، مدل'}
                        onChange={(e : any) => setSearchTerm(e?.target?.value)}
                        sx={{
                            height: sizeConverter(24, 'height'),
                            fontSize: sizeConverter(3),
                            '& .MuiOutlinedInput-input': {
                                fontSize: sizeConverter(12),
                                minHeight: sizeConverter(24, 'height'),
                            },
                            '& label': {
                                fontSize: sizeConverter(12),
                            },
                            '& .MuiOutlinedInput-root': {
                                minHeight: sizeConverter(24, 'height'),
                            },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                alignContent={'space-between'}
                sx={{ position: 'relative', height: sizeConverter(623, 'height'), overflowY: 'auto' }}
            >
                {selectedKiosks?.length > 0 && (
                    <Grid
                        container
                        size={12}
                        sx={{
                            mb: sizeConverter(4, 'spaceY'),
                            position: 'sticky',
                            bgcolor: 'bgColor.0',
                            top: 0,
                            zIndex: 2,
                            maxHeight: sizeConverter(300, 'height'),
                            overflowY: 'auto',
                        }}
                    >
                        <Divider
                            textAlign="center"
                            flexItem
                            style={{
                                width: '100%',
                            }}
                        >
                            <Typography
                                variant="normalBold"
                                sx={{
                                    px: sizeConverter(5, 'spaceX'),
                                }}
                            >
                                انتخاب شده ها
                            </Typography>
                        </Divider>
                        <Grid container size={12}>
                            {statusChecked(
                                filteredData?.filter((kiosk: Record<string, string>) =>
                                    selectedKiosks?.map((item: Record<string, any>) => item?.kioskSerial)?.includes(kiosk.kioskSerial)
                                )
                            )}
                        </Grid>
                    </Grid>
                )}
                <Grid container sx={{ mt: sizeConverter(4, 'spaceY') }}>
                    <Divider
                        textAlign="center"
                        flexItem
                        style={{
                            width: '100%',
                        }}
                    >
                        <Typography
                            variant="normalBold"
                            sx={{
                                px: sizeConverter(5, 'spaceX'),
                            }}
                        >
                            انتخاب نشده ها
                        </Typography>
                    </Divider>
                    <Grid container size={12}>
                        {statusChecked(
                            filteredData?.filter(
                                (kiosk: Record<string, string>) =>
                                    !selectedKiosks?.map((item: Record<string, any>) => item?.kioskSerial)?.includes(kiosk.kioskSerial)
                            )
                        )}
                    </Grid>
                </Grid>
                <Grid
                    container
                    size={12}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    sx={{ position: 'sticky', bottom: 0, bgcolor: 'bgColor.0' }}
                >
                    <Button
                        onClick={infoOptions?.onSubmit ? infoOptions?.onSubmit : undefined}
                        variant="main"
                        disabled={selectedKiosks?.length === 0}
                    >
                        {createItem?.isPending || infoOptions?.isLoading ? (
                            <CustomCircularProgress noPadding color={'white.0'} size={sizeConverter(16)} />
                        ) : (
                            <>{'اعمال'}</>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default AssignKiosk
