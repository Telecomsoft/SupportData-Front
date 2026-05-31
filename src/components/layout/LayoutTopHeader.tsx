import { FC, } from 'react'
import Grid from '@mui/material/Grid2'
import LayoutBreadcrumbs from './LayoutBreadcrumbs '
import { sizeConverter } from '@src/utility/sizeConverter'
import LogoutIcon from '@mui/icons-material/Logout'


// import SuspendDialog from '@components/general/SuspendDialog'
import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
import Cookies from 'js-cookie'
import { Button } from '@mui/material'
// import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
// import CustomPassword from '@components/section/users/CustomPassword'

// const GeneralDialog = lazy(() => import('@components/general/GeneralDialog.tsx'))


// const NEW_PASSWORD = [
//    {
//       label: 'رمز عبور فعلی',
//       value: 'password',
//       kind: 'textField',
//       size: 12,
//       component: TextFieldComp,
//    },
//    {
//       value: 'newPassword',
//       kind: 'textField',
//       type: 'password',
//       size: 12,
//       component: CustomPassword,
//    },
// ]

const LayoutTopHeader: FC = ({ }: any) => {
   // const [openDialog, setOpenDialog] = useState<Record<string, 'add' | 'edit' | null>>({
   //    passwordAdd: null,
   // })

   const handleLogout = () => {
      Cookies.remove('auth_token')
      Cookies.remove('userName')
      Cookies.remove('userImage')
      Cookies.remove('userId')
      window.location.href = '/'
   }

   return (
      <Grid
         container
         size={12}
         alignItems="center"
         justifyContent="space-between"
         sx={{
            height: '8%',
            position: 'sticky',
            top: 0,
            px: sizeConverter(15, 'space'),
         }}
      >
         <LayoutBreadcrumbs />
         {/* <HeaderLogo /> */}
         <Grid
            container
            alignItems="center"
            columnGap={sizeConverter(5, 'space')}
            sx={{
               cursor: 'pointer',
               borderRadius: sizeConverter(4, 'radius'),
               position: 'relative',
            }}
         // onClick={handleMenuClick}
          onClick={handleLogout}
         >
            <Grid
               container
               sx={{
                  zIndex: 2,
                  position: 'absolute',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: sizeConverter(4, 'radius'),
                  background: `linear-gradient(0deg, rgb(49, 111, 109, 1) 0%, rgb(49, 111, 109, 0.4) 0%)`,
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  opacity: 0,
                  // '&:hover': {
                  //    opacity: 1,
                  // },
               }}
            />
            <Button
               // onClick={handleLogout}
               variant="main"
               sx={{ width: '100%', position: 'relative', cursor: 'pointer', mt: sizeConverter(2, 'spaceY') }}
            >
               خروج
               <LogoutIcon
                  sx={{
                     width: sizeConverter(15),
                     height: sizeConverter(15),
                     right: sizeConverter(10),
                     position: 'absolute',
                  }}
               />
            </Button>
         </Grid>


         {/* <Suspense fallback={<SuspendDialog />}>
            {openDialog.passwordAdd && (
               <GeneralDialog
                  width={sizeConverter(350, 'width')}
                  title={'رمز عبور جدید'}
                  array={NEW_PASSWORD}
                  defaultValue={{}}
                  editEndpoint={'api/Main/ChangePass'}
                  createEndpoint={'api/Main/ChangePass'}
                  snackbarOpen={snackbarOpen}
                  staticServerData={{ userName: 'admin' }}
                  open={openDialog.passwordAdd}
                  close={() => setOpenDialog((prev) => ({ ...prev, passwordAdd: null }))}
               />
            )}
         </Suspense> */}
      </Grid>
   )
}

export default withSnackbar(LayoutTopHeader)
