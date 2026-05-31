import Grid from '@mui/material/Grid2'
import { useGetData } from '@hooks/useGetData.ts'
import { DeviceDetailSetting } from '@type/deviceType.ts'
import { sizeConverter } from '@utility/sizeConverter.ts'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp.tsx'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp.tsx'
import { separateCamelCase } from '@utility/separateCamelCase.ts'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'
import useCopyStore from '@src/store/copyStore.ts'
import useCehckedItems from '@src/store/cehckedItems'

const CustomSettingKiosks: FunctionComponent<GeneralInfoProps> = ({ infoOptions, height }) => {
    const { copyData, clearCopyData } = useCopyStore()
    const devicesConstants = useGetData<DeviceDetailSetting[]>('api/Setting/Device/settingList', 'devices-constants')
    const { selectedCheck } = useCehckedItems()

    const options = useMemo(
        () => devicesConstants.data?.value?.map((i, index) => ({ ...i, id: index, name: i?.settingName })) || [],
        [devicesConstants.data?.value]
    )

    useEffect(() => {
        if (copyData) {
            const itemsValues = copyData?.detailSettings?.reduce(
                (total: Record<string, string>, i: DeviceDetailSetting) => ({
                    ...total,
                    [i?.settingName]: crackValue(i?.itemKind, i?.settingValue),
                }),
                {}
            )
            infoOptions?.reset!(itemsValues, { keepValues: false })
        }

        return () => {
            clearCopyData()
        }
    }, [copyData])
    const updateDevice = useMemo(() => {
        return options?.filter((i) => selectedCheck?.includes(i.settingName))
    }, [selectedCheck])

    return (
        <Grid
            container
            size={12}
            alignContent={'flex-start'}
            sx={{ pt: sizeConverter(12, 'spaceY'), px: sizeConverter(8, 'spaceX'), height: height }}
        >
            {updateDevice?.map((i: { itemKind: string; settingName: string }) => (
                <Grid
                    container
                    size={6}
                    sx={{ py: i?.itemKind !== 'Bool' ? sizeConverter(6, 'spaceY') : 0, px: sizeConverter(6, 'spaceX') }}
                >
                    {i?.itemKind === 'Bool' && (
                        <CheckboxComponent
                            item={{ title: separateCamelCase(i?.settingName), size: 12, value: i?.settingName }}
                            control={infoOptions?.control}
                            watch={infoOptions?.watch}
                            // errors={errors}
                        />
                    )}
                    {['Int', 'String'].includes(i?.itemKind) && (
                        <TextFieldComp
                            label={separateCamelCase(i?.settingName)}
                            watch={infoOptions?.watch}
                            // errors={errors}
                            register={infoOptions?.register}
                            value={i?.settingName}
                            {...(i?.itemKind === 'Int' && { type: 'float' })}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    )
}

export default CustomSettingKiosks

const crackValue = (kind: string, value: string) => {
    if (kind === 'Bool') return value === 'true'
    if (kind === 'Int') return parseInt(value)
    return value
}

export const updateQueryParam = (param: string, value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(param, value)
    window.history.pushState(null, '', url.toString())
}

export function readURLQueryParameters(): Record<string, string | string[]> {
    const urlParams = new URLSearchParams(window.location.search)
    const queryParams: Record<string, string> = {}
    for (const [key, value] of urlParams.entries()) {
        queryParams[key] = isJSONString(value) ? JSON.parse(value) : value
    }
    return queryParams
}

function isJSONString(str: string): boolean {
    try {
        JSON.parse(str)
        return true
    } catch (error) {
        if (error instanceof SyntaxError) {
            const regex = /^\{.*\}$/
            return regex.test(str)
        } else {
            return false
        }
    }
}
