import ImageComponent from '@components/general/ImageComponent'
import Grid from '@mui/material/Grid2'
import { GeneralInfoProps } from '@src/data/type/infoOptionsType'
import { sizeConverter } from '@src/utility/sizeConverter'

const GeneralInfo = ({ data, infoOptions }: GeneralInfoProps) => {
    const isPictureUrl = Object.keys(data).includes('pictureURL')
    return (
        <Grid container size={12} rowGap={sizeConverter(1)} alignContent={'flex-start'} alignItems={'flex-start'}>
            {isPictureUrl ? (
                <>
                    <Grid container size={12} alignItems={'center'} justifyContent={'center'} rowGap={sizeConverter(1)}>
                        <Grid container size="grow" sx={{ p: sizeConverter(5, 'space') }}>
                            <ImageComponent
                                src={data['pictureURL']}
                                alt={'عکس کیوسک'}
                                height={sizeConverter(125)}
                                width={sizeConverter(94)}
                                imageStyle={infoOptions?.imageStyle}
                            />
                        </Grid>
                        <Grid container size={8.5}>
                            {infoOptions?.config?.slice(1, 4)?.map((item) => {
                                const Component = item.component
                                if (Component)
                                    return (
                                        <Grid
                                            container
                                            size={item.size}
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                            sx={{ m: sizeConverter(4, 'space') }}
                                        >
                                            <Component value={data[item.value]} name={item.name} type={item.type} />
                                        </Grid>
                                    )
                            })}
                        </Grid>
                    </Grid>
                    {infoOptions?.config?.slice(4)?.map((item) => {
                        const Component = item.component
                        if (Component)
                            return (
                                <Grid
                                    container
                                    size={item.size}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    sx={{ m: sizeConverter(4, 'space') }}
                                >
                                    <Component value={data[item.value]} name={item.name} type={item.type} />
                                </Grid>
                            )
                    })}
                </>
            ) : (
                infoOptions?.config?.map((item) => {
                    const Component = item.component
                    if (Component)
                        return (
                            <Grid
                                container
                                size={item.size}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                sx={{ m: sizeConverter(4, 'space') }}
                            >
                                <Component value={data[item.value]} name={item.name} type={item.type} />
                            </Grid>
                        )
                })
            )}
        </Grid>
    )
}

export default GeneralInfo
