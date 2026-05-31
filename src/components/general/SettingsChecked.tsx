import { Button, Checkbox, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import useCehckedItems from '@src/store/cehckedItems'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'
import { StyledAutoComplete } from './input/StyledAutoComplete'
import StyledTextField from './input/StyledTextField'
import useSelectedItem from '@src/store/autoCompleteStore'
import { useGetData } from '@src/hooks/useGetData'
import { SettingFields } from '@src/data/kioskDefine/bankKiosk'
import CustomCircularProgress from '@components/general/CustomCircularProgress.tsx'

export type DetailSetting = {
    settingName: string
    settingValue: string
    itemKind: string
}

export type ServiceType = {
    id: number
    serviceName: string
    detailSettings: DetailSetting[]
}

const SettingsChecked: React.FC<GeneralInfoProps> = ({ height, infoOptions }) => {
    const { selectedCheck, toggleSelectedCheck, clearAllChecked, fillAllChecked } = useCehckedItems()
    const { setSelectedItem, selectedItem } = useSelectedItem()

    const handleToggle = (item: string) => {
        toggleSelectedCheck(item)
    }
    const listService = useGetData<ServiceType[]>('api/Main/KioskService/List', 'list-service')
    const selectArr = infoOptions?.array
    const handleAllChecked = () => {
        if (selectArr?.length === selectedCheck?.length) clearAllChecked()
        else fillAllChecked(selectArr?.map((i: SettingFields) => i.key))
    }

    const showAutoComplete = infoOptions?.type?.value === 'service' ? !!selectedItem : true

    return (
        <Grid
            justifyContent={'center'}
            container
            sx={{
                overflow: 'hidden',
                maxHeight: (height as number) + sizeConverter(45,'height'),
                pt: sizeConverter(infoOptions?.type?.value === 'service' ? 8 : 2, 'spaceY'),
            }}
        >
            {infoOptions?.type?.value === 'service' && (
                <Grid container size={12} justifyContent={'center'} alignItems={'center'} sx={{px:sizeConverter(5,'spaceX')}}>
                    <StyledAutoComplete
                        disablePortal
                        options={listService?.data?.value ?? []}
                        getOptionLabel={(option: any) => option?.serviceName}
                        sx={{ width: sizeConverter(230, 'width') }}
                        onChange={(_, newValue: unknown) => {
                            const serviceValue = newValue as ServiceType
                            setSelectedItem(serviceValue)
                            infoOptions?.setServiceData(serviceValue)
                            clearAllChecked()
                        }}
                        renderInput={(params: any) => <StyledTextField {...params} label="انتخاب سرویس" />}
                    />
                </Grid>
            )}

            {showAutoComplete && (
                <Grid
                    container
                    size={12}
                    justifyContent={'center'}
                    alignItems={'center'}
                    direction="row"
                    sx={{
                        overflow:'hidden',
                        my: sizeConverter(5, 'spaceY'),
                        borderRadius: sizeConverter(12, 'radius'),
                    }}
                >
                    <Grid container size={12} justifyContent={'space-between'}>
                        <Button variant="main" sx={{ width: 1, m: sizeConverter(4, 'space') }} onClick={handleAllChecked}>
                            انتخاب همه / حذف همه
                        </Button>
                        <Grid size={12} container sx={{ overflow: 'auto', height : (height as number) - sizeConverter(infoOptions?.type?.value === 'service' ? 50 : 10,'height') }} alignContent={'flex-start'}>
                            {infoOptions?.loading ? (
                                <Grid container size={12} justifyContent="center" alignItems="center" sx={{ mt: sizeConverter(5, 'space') }}>
                                    <CustomCircularProgress />
                                </Grid>
                            ) : (
                                <>
                                    {infoOptions?.array?.map((check: any) => (
                                        <Grid
                                            container
                                            alignItems="center"
                                            size={12}
                                            key={check.checkSerial}
                                            onClick={() => handleToggle(check.key)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                },
                                                padding: sizeConverter(1, 'space'),
                                            }}
                                        >
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
                                                checked={selectedCheck?.includes(check.key)}
                                                onChange={() => handleToggle(check.key)}
                                                sx={{ pointerEvents: 'none' }}
                                            />
                                            <Typography variant="subItem">{check.label}</Typography>
                                        </Grid>
                                    ))}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default SettingsChecked
