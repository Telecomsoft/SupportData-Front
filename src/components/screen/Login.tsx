import { SubmitHandler, useForm } from 'react-hook-form'
import useSignIn from '@src/hooks/useSignIn'
import { useNavigate } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { SNACKBAR_SEVERITIES, SnackbarSeverity, withSnackbar } from '@components/hoc/withSnackbar'
import Cookies from 'js-cookie'
import StyledTextField from '@components/general/input/StyledTextField'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { sizeConverter } from '@utility/sizeConverter'
import { convertToPersianNumber } from '@utility/convertToPersianNumber'
import { useDevice } from '@src/hooks/useDevice'
import { useTheme } from '@mui/system'

export type LoginFormData = {
   userName: string
   password: string
}

interface LoginProps {
   snackbarOpen: (message: string, severity: SnackbarSeverity) => void
}

const Login = (props: Partial<LoginProps>) => {
   const theme = useTheme()
   const { snackbarOpen } = props
   const { isMobile } = useDevice()

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

               Cookies.set('accessInfo', JSON.stringify(res.data.value.accessInfo), { expires: 15 })
               Cookies.set('auth_token', res.data.value.token, { expires: 15, path: '/' })
               Cookies.set('userName', res.data.value.userName, { expires: 15, path: '/' })
               Cookies.set('userId', res.data.value.userID, { expires: 15, path: '/' })

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
   const versionInfo = (
      <Typography
         variant="normalBold"
         sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: sizeConverter(12, 'font'),
         }}
      >
         نسخه نرم افزار{' '}
         {process.env.PACKAGE_VERSION
            ? convertToPersianNumber(process.env.PACKAGE_VERSION)
            : ''}
      </Typography>
   )

   const loginForm = (
      <Grid container >

         {
            [
               { label: 'نام کاربری', value: 'userName' },
               { label: 'رمز عبور', value: 'password' },
            ]?.map((item) => (
               <Grid
                  container
                  size={12}
                  key={item.value}
                  sx={{ mb: sizeConverter(20, 'spaceY'), }}
               >
                  <StyledTextField
                     sx={{ borderRadius: 50 }}
                     label={item.label}
                     fullWidth
                     focused
                     type={item.value}
                     {...register(item.value as keyof LoginFormData, {
                        required: 'فیلد نباید خالی باشد.',
                     })}
                     error={!!errors[item.value as keyof LoginFormData]}
                     helperText={errors[item.value as keyof LoginFormData]?.message}
                  />
               </Grid>
            ))
         }

         < Button
            fullWidth
            type="submit"
            variant={isMobile ? "confirmMobile" : 'main'}
            disabled={signIn.isPending}
            sx={{

               height: sizeConverter(44, 'height'),
            }}
         >
            {
               signIn.isPending
                  ? <CustomCircularProgress size={isMobile ? 20 : sizeConverter(20)} color="white.0" />
                  : 'ورود'
            }
         </Button >
      </Grid >
   )

   // ==================== Mobile Version ====================

   if (isMobile) {
      return (
         <Drawer
            anchor="bottom"
            open
            variant="permanent"
            PaperProps={{
               sx: {
                  height: '100dvh',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTopLeftRadius: sizeConverter(28, 'radius'),
                  borderTopRightRadius: sizeConverter(28, 'radius'),
                  bgcolor: theme.palette.bgColor[1],
                  px: sizeConverter(24, 'space'),
                  pt: '40%',
               },
            }}
         >
            <Box
               sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: sizeConverter(8, 'spaceY'),
               }}
            >
               <Box
                  sx={{
                     width: 40,
                     height: 4,
                     bgcolor: 'bgColor.1',
                     borderRadius: sizeConverter(4, 'radius'),
                  }}
               />
            </Box>

            <Typography
               sx={{
                  textAlign: 'center',
                  fontFamily: 'yekanBold',
                  fontSize: 22,
                  color: 'primary.main',
                  mb: sizeConverter(28, 'spaceY'),
               }}
            >
               KIOSK SUPPORT INFO
            </Typography>

            <form onSubmit={handleSubmit(submitButton)}>
               {loginForm}
            </form>
            <Box
               sx={{
                  position: 'fixed',
                  bottom: sizeConverter(20, 'space'),
                  left: '50%',
                  transform: 'translateX(-50%)',
               }}
            >
               <Typography
                  variant="normalBold"
                  sx={{
                     color: 'primary.main',
                     fontSize: 12,
                     whiteSpace: 'nowrap',
                  }}
               >
                  نسخه نرم افزار{' '}
                  {process.env.PACKAGE_VERSION
                     ? convertToPersianNumber(process.env.PACKAGE_VERSION)
                     : ''}
               </Typography>
            </Box>
         </Drawer>
      )
   }

   // ==================== Desktop Version ====================

   return (
      <Grid
         container
         justifyContent="center"
         alignItems="center"
         sx={{
            height: '100vh',
            bgcolor: 'primary.main',
            px: sizeConverter(16, 'space'),
            position: 'relative',
         }}
      >
         <Grid
            container
            sx={{
               width: sizeConverter(400, 'width'),
               p: sizeConverter(32, 'space'),
               borderRadius: sizeConverter(16, 'radius'),
               bgcolor: 'white.0',
               boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
         >
            <Typography
               sx={{
                  mb: sizeConverter(24, 'spaceY'),
                  fontFamily: 'yekanBold',
                  color: 'primary.main',
                  fontSize: sizeConverter(24, 'font'),
                  width: '100%',
                  textAlign: 'center',
               }}
            >
               KIOSK SUPPORT INFO
            </Typography>

            <form
               onSubmit={handleSubmit(submitButton)}
               style={{ width: '100%' }}
            >
               {loginForm}
            </form>
         </Grid>

         <Box
            sx={{
               position: 'fixed',
               bottom: sizeConverter(20, 'space'),
               left: '50%',
               transform: 'translateX(-50%)',
            }}
         >
            <Typography
               variant="normalBold"
               sx={{
                  color: 'white.0',
                  fontSize: sizeConverter(12, 'font'),
                  whiteSpace: 'nowrap',
               }}
            >
               نسخه نرم افزار{' '}
               {process.env.PACKAGE_VERSION
                  ? convertToPersianNumber(process.env.PACKAGE_VERSION)
                  : ''}
            </Typography>
         </Box>
      </Grid>
   )
}

export default withSnackbar(Login)
