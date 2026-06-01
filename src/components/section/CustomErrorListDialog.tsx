// import UploadFile from "@components/general/uploadFile";
import AutoCompleteComp from "@components/general/hookFromInputs/AutoComplete";
import Grid from "@mui/material/Grid2";

import { sizeConverter } from "@src/utility/sizeConverter";


export const CustomErrorListDialog = ({
    register, errors, control, setValue, watch, unregister, actionKind, conditionValue
}) => {

    const deviceId = watch('deviceID')

    const Custom = [
        {
            label: 'مدل قطعه',
            value: 'deviceModelID',
            kind: 'combo',
            size: 5.9,
            type: 'multiple',
            disabled: !deviceId?.id,
            component: AutoCompleteComp,
        },
    ]

    const filterDeviceModel = conditionValue?.deviceModels?.filter(i => i.deviceID == deviceId?.id)

    return (
        <Grid container size={5.9} columnSpacing={sizeConverter(8, 'spaceX')}>

            {Custom.map((item) => {

                return <item.component
                    key={item.value}
                    item={item}
                    register={register}
                    control={control}
                    watch={watch}
                    errors={errors}
                    unregister={unregister}
                    value={item?.value}
                    // ۴. حالا فقط آرایه‌ی مربوط به این فیلد را مستقیم استخراج کنید
                    autoCompleteOption={filterDeviceModel}
                    label={item?.label}
                    actionKind={actionKind}
                    setValue={setValue}
                    disabled={item?.disabled}

                />
            }

            )}
        </Grid>
    );
};