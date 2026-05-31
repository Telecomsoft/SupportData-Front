import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete'
import StyledTextField from '@components/general/input/StyledTextField'
import { ServiceType } from '@components/general/SettingsChecked'
import Grid from '@mui/material/Grid2'
import { useGetData } from '@src/hooks/useGetData'
import useSelectedItem from '@src/store/autoCompleteStore'
import { sizeConverter } from '@src/utility/sizeConverter'

function ServiceToolbar() {
    const listService = useGetData<ServiceType[]>('api/Main/KioskService/List', 'list-service')
    const { setSelectedItem, selectedItem } = useSelectedItem()

    return (
        <Grid container size={12} justifyContent={'flex-end'} alignItems={'flex-start'}>
                {listService?.data?.value &&
                    <StyledAutoComplete
                        options={listService?.data?.value ?? []}
                        getOptionLabel={(option: any) => option?.serviceName}
                        defaultValue={selectedItem}
                        onChange={(_: any, newValue: any) => setSelectedItem(newValue)}
                        renderInput={(params : any) => (
                            <StyledTextField
                                {...params}
                                placeholder="انتخاب سرویس"
                                sx={{
                                    height: sizeConverter(24, 'height'),
                                    fontSize: sizeConverter(3),
                                    width: sizeConverter(250,'width'),
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
                        )}
                    />
                }
        </Grid>
    )
}

export default ServiceToolbar
