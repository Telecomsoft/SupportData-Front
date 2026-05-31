import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren } from 'react'
// import Loading from "@repo/lib/src/components/common/Loading";
import { sizeConverter } from '@src/utility/sizeConverter'

type NoDataToDisplay = PropsWithChildren<{
   serverApi: Record<any, any>
   height?: number
   loadingSize?: number
   ErrorFontSize?: number
   data?: any
   isShowNoData?: boolean
   serverApiPost?: boolean
}>

const NoDataToDisplayProvider = ({
   children,
   //  loadingSize = 70,
   serverApi,
   isShowNoData = true,
   serverApiPost,
   height,
   ErrorFontSize,
   data,
}: NoDataToDisplay): React.JSX.Element => {
   const serverApiName = {
      serverApiError: !!serverApiPost ? serverApi?.data?.data : serverApi?.data,
      serverApiLoading: !!serverApiPost ? !serverApi?.isPending : !serverApi?.isLoading,
      dataDisplayLogic: !!serverApiPost ? true : !!data ? !!data : !!serverApi ? !!serverApi?.data?.value : true,
      noDataToDisplayLogic: !!serverApiPost
         ? false
         : !!data
           ? data?.length === 0
           : (serverApi?.data?.value === null || serverApi?.data?.value?.length === 0) && !!serverApi && !!isShowNoData,
   }
   return serverApiName.serverApiLoading ? (
      <>
         {(!!serverApi?.isError || serverApiName.serverApiError?.error !== 0) && !!serverApi ? (
            <Grid
               container
               item
               xs={12}
               justifyContent={'center'}
               alignContent={'center'}
               alignItems={'center'}
               sx={{ height: !height ? 'auto' : height, px: sizeConverter(6, 'spaceX') }}
            >
               <Typography
                  sx={{
                     fontSize: !!ErrorFontSize ? ErrorFontSize : sizeConverter(12),
                     whiteSpace: 'break-spaces',
                     textAlign: 'center',
                     textTransform: 'capitalize',
                  }}
               >
                  Server Error
                  <br />
                  {!!serverApiName.serverApiError?.errorMessage
                     ? `(${serverApiName.serverApiError?.error} ${serverApiName.serverApiError?.errorMessage})`
                     : `(${serverApi?.error})`}
               </Typography>
            </Grid>
         ) : serverApiName?.noDataToDisplayLogic ? (
            <Grid
               container
               item
               xs={12}
               justifyContent={'center'}
               alignContent={'center'}
               alignItems={'center'}
               sx={{
                  height: !height ? 'auto' : height,
                  px: sizeConverter(6, 'spaceX'),
                  fontSize: !!ErrorFontSize ? ErrorFontSize : sizeConverter(12),
                  whiteSpace: 'break-spaces',
                  textAlign: 'center',
                  textTransform: 'capitalize',
               }}
            >
               No Data To Display
            </Grid>
         ) : (
            <>{serverApiName.dataDisplayLogic && <>{children}</>}</>
         )}
      </>
   ) : (
      <Grid
         container
         justifyContent={'flex-start'}
         alignItems={'center'}
         item
         sx={{ height: !height ? 'auto' : height, px: sizeConverter(6, 'spaceX') }}
         xs={12}
      >
         {/* <Loading
                    size={sizeConverter(loadingSize)}
                /> */}
      </Grid>
   )
}

export default NoDataToDisplayProvider
