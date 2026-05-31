import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import Grid from '@mui/material/Grid2'
import useCehckedItems from '@src/store/cehckedItems'
import useCopyStore from '@src/store/copyStore'
import { separateCamelCase } from '@src/utility/separateCamelCase'
import { sizeConverter } from '@src/utility/sizeConverter'
import { useEffect } from 'react'
import { serviceItem } from '@src/data/kioskDefine/bankKiosk'

const ServiceKiosk = ({ infoOptions }: any) => {
    const { selectedCheck } = useCehckedItems()
    const { watch, register, errors, control, setValue } = infoOptions
    const { copyData, clearCopyData } = useCopyStore()

    useEffect(() => {
        if (copyData) {
            serviceItem?.forEach((kiosk: any) => {
                setValue(kiosk.key, copyData[kiosk.key])
            })
        }

        return () => {
            clearCopyData()
        }
    }, [copyData])

    return (
        <Grid container size={12} sx={{ mt: sizeConverter(12, 'spaceY') }}>
            {serviceItem
                ?.filter((i) => selectedCheck?.includes(i.key))
                ?.map((i: any) => (
                    <Grid container size={6} sx={{ px: sizeConverter(6, 'spaceX') }}>
                        {i?.kind === 'checkbox' && (
                            <CheckboxComponent item={{ title: separateCamelCase(i?.key), size: 12, value: i?.key }} control={control} />
                        )}
                        {i?.kind === 'textField' && (
                            <TextFieldComp
                                label={separateCamelCase(i?.key)}
                                watch={watch}
                                errors={errors}
                                register={register}
                                type={i?.key === 'mainService' ? 'text' : 'float'}
                                value={i.key}
                            />
                        )}
                    </Grid>
                ))}
        </Grid>
    )
}

export default ServiceKiosk
