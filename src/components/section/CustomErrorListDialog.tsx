// import UploadFile from "@components/general/uploadFile";
import AutoCompleteComp from "@components/general/hookFromInputs/AutoComplete";
import Grid from "@mui/material/Grid2";
import { useDevice } from "@src/hooks/useDevice";

import { sizeConverter } from "@src/utility/sizeConverter";


export const CustomErrorListDialog = ({
    register, errors, control, setValue, watch, unregister, conditionValue
}) => {

    const deviceId = watch('deviceID')
    const { isMobile } = useDevice()
    const Custom = [
        {
            label: 'مدل قطعه',
            value: 'deviceModelID',
            kind: 'combo',
            size: 12,
            type: 'multiple',
            disabled: !deviceId?.id,
            component: AutoCompleteComp,
        },
    ]

    const filterDeviceModel = conditionValue?.deviceModels?.filter(i => i.deviceID == deviceId?.id)

    return (
        <Grid container size={isMobile ? 12 : 5.9} columnSpacing={sizeConverter(8, 'spaceX')}>

            {Custom.map((item) => {

                return <item.component
                    key={item.value}
                    register={register}
                    control={control}
                    watch={watch}
                    errors={errors}
                    unregister={unregister}
                    value={item?.value}
                    autoCompleteOption={filterDeviceModel}
                    label={item?.label}
                    autocompleteType={item.type as 'multiple'}
                    setValue={setValue}
                    disabled={item?.disabled}

                />
            }

            )}
        </Grid>
    );
};