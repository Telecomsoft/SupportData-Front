import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import ImageComponent from '@components/general/ImageComponent.tsx'
import { User } from '@type/userType.ts'
import { sizeConverter } from '@utility/sizeConverter.ts'

const UserInfo = ({ data, height }: { data: User; height: number | string }) => {
    return (
        <Grid
            container
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            alignContent={'flex-start'}
            size={12}
            sx={{ height: height, overflow: 'hidden', p: sizeConverter(6, 'space') }}
        >
            <Grid container columnGap={sizeConverter(10, 'space')}>
                <Grid container alignItems={'center'} justifyContent={'center'} size="auto">
                    <ImageComponent
                        src={data.pictureURL}
                        alt={'عکس پروفایل'}
                        height={sizeConverter(140)}
                        width={sizeConverter(105)}
                        imageStyle={{ objectFit: 'cover' }}
                    />
                </Grid>
                <Grid size="grow" sx={{ userSelect: 'text' }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} size={12}>
                        <Typography noWrap variant="normalHeader" sx={{ width: '100%' }}>
                            اسم کاربر
                        </Typography>
                        <Typography noWrap variant="normal" sx={{ width: '100%' }}>
                            {data.name ?? '-'}
                        </Typography>
                    </Grid>
                    <Grid container alignItems={'center'} justifyContent={'center'} size={12}>
                        <Typography noWrap variant="normalHeader" sx={{ width: '100%' }}>
                            نام کاربری
                        </Typography>
                        <Typography noWrap variant="normal" sx={{ width: '100%' }}>
                            {data.loginName ?? '-'}
                        </Typography>
                    </Grid>
                    <Grid container alignItems={'flex-end'} justifyContent={'center'} size={12}>
                        <Typography noWrap variant="normalHeader" sx={{ width: '100%' }}>
                            رمز عبور
                        </Typography>
                        <Typography noWrap variant="normal" sx={{ width: '100%' }}>
                            {data.password ?? '-'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                size={12}
                alignItems={'center'}
                justifyContent={'center'}
                alignContent={'flex-start'}
                sx={{ mt: sizeConverter(12, 'spaceY') }}
            >
                <Typography variant="normalHeader" sx={{ width: '100%' }}></Typography>
            </Grid>
        </Grid>
    )
}

export default UserInfo
