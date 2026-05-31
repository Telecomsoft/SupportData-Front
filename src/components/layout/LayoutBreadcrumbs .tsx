import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { convertToPersianNumber } from '@utility/convertToPersianNumber.ts'
import Cookies from 'js-cookie'

const LayoutBreadcrumbs = () => {
   // const router = useRouter();
   const userName: string | undefined = Cookies.get('userName')
   return (
      <Grid container size={5}>
         <Typography variant="normal" sx={{ width: 1 }}>
            به میز کار خودت خوش اومدی &nbsp;
            {userName}
            &nbsp; عزیز
         </Typography>
         <Typography variant="caption" sx={{ color: 'black.3', width: 1, textAlign: 'left' }}>
            امروز &nbsp;
            {new Date().toLocaleDateString('fa-IR', {
               year: 'numeric',
               month: 'short',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
               formatMatcher: 'best fit',
            })}{' '}
            &nbsp; / &nbsp;
            <Typography variant="caption" sx={{ color: 'black.3', width: 1, textAlign: 'left', lineHeight: 1.8 }}>
               نسخه نرم افزار &nbsp;
               <Typography variant="caption" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>
                  {process.env.PACKAGE_VERSION ? convertToPersianNumber(process.env.PACKAGE_VERSION) : ''}
               </Typography>
            </Typography>
         </Typography>
      </Grid>
   )
}

export default LayoutBreadcrumbs
