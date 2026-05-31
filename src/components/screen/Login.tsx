import { SubmitHandler, useForm } from 'react-hook-form'
import useSignIn from '@src/hooks/useSignIn.ts'
import { useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { SNACKBAR_SEVERITIES, SnackbarSeverity, withSnackbar } from '@components/hoc/withSnackbar'
import Cookies from 'js-cookie'
import StyledTextField from '@components/general/input/StyledTextField.tsx'
import CustomCircularProgress from '@components/general/CustomCircularProgress.tsx'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { convertToPersianNumber } from '@utility/convertToPersianNumber.ts'

export type LoginFormData = {
   userName: string
   password: string
}

interface LoginProps {
   snackbarOpen: (message: string, severity: SnackbarSeverity) => void
}

const Login = (props: Partial<LoginProps>) => {
   const { snackbarOpen } = props

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormData>()
   const signIn = useSignIn()
   const navigate = useNavigate()

   const submitButton: SubmitHandler<LoginFormData> = (data) => {
      signIn.mutate(data, {
         onSuccess: (res) => {
            if (res?.data?.value) {
               //@ts-ignore

               Cookies.set('accessInfo', JSON.stringify(res.data.value.accessInfo), { expires: 15 })

               Cookies.set('auth_token', res.data.value.token, { expires: 15, path: '/' });
               Cookies.set('userName', res.data.value.userName, { expires: 15, path: '/' });
               Cookies.set('userId', res.data.value.userID, { expires: 15, path: '/' });
               navigate({ to: '/errorsList' })
            } else {
               snackbarOpen?.(res.data.error + ' ' + res.data.errorMessage, SNACKBAR_SEVERITIES.ERROR)
            }
         },
         onError: (err) => {
            snackbarOpen?.(err.message, SNACKBAR_SEVERITIES.ERROR)
         },
      })
   }


   return (
      <Grid
         container
         size={12}
         justifyContent="center"
         alignItems="center"
         sx={{ height: '100vh', position: 'relative', bgcolor: 'primary.main', overflow: 'hidden' }}
      >
         <Grid
            container
            size={12}
            justifyContent="center"
            alignItems="center"
            sx={{
               height: '100vh',
               width: '100vw',
               position: 'absolute',
               zIndex: 1,
               top: -250,
               fontSize: sizeConverter(120),
               color: 'white.0',
               opacity: 0.15,
               // letterSpacing: 50,
            }}
         >
            KIOSK SUPPORT INFO
         </Grid>
         <Grid
            container
            size="auto"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 4, borderRadius: 3, bgcolor: 'white.0', zIndex: 2 }}
         >
            <Grid container size={12} justifyContent="center" alignItems="center">
               <Typography sx={{ mb: 2, fontFamily: 'yekanBold', color: 'primary.main', fontSize: 24 }}>POS SECURITY </Typography>
            </Grid>
            <form onSubmit={handleSubmit(submitButton)}>
               <Grid>
                  <Typography sx={{ mb: 2, fontFamily: 'yekanBold', fontSize: 16 }}>ورود</Typography>

                  {[
                     { label: 'نام کاربری', value: 'userName' },
                     {
                        label: 'رمز عبور',
                        value: 'password',
                     },
                  ].map((item) => (
                     <Grid container justifyContent="center" alignItems="center" size={12} sx={{ my: 2, width: 350 }} key={item.value}>
                        <StyledTextField
                           label={item.label}
                           fullWidth
                           type={item.value}
                           {...register(item.value as keyof LoginFormData, { required: 'فیلد نباید خالی باشد.' })}
                           error={!!errors[item.value as keyof LoginFormData]}
                           helperText={errors[item.value as keyof LoginFormData]?.message}
                        />
                     </Grid>
                  ))}

                  <Button type="submit" variant="contained" disabled={signIn.isPending} sx={{ width: 1 }}>
                     {signIn.isPending ? <CustomCircularProgress noPadding size={sizeConverter(20)} color={'white.0'} /> : 'ورود'}
                  </Button>
               </Grid>
            </form>
         </Grid>
         <Grid
            container
            size={12}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ position: 'absolute', bottom: 10, pb: sizeConverter(10, 'spaceY') }}
         >
            <Typography variant="normalBold" sx={{ color: 'white.0' }}>
               نسخه نرم افزار &nbsp;
               <Typography variant="normalBold" sx={{ letterSpacing: 2, lineHeight: 1.8, color: 'white.0' }}>
                  {process.env.PACKAGE_VERSION ? convertToPersianNumber(process.env.PACKAGE_VERSION) : ''}
               </Typography>
            </Typography>
         </Grid>
      </Grid>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export default withSnackbar(Login)
