import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import { Dialog, Divider, Typography } from '@mui/material'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import { useState } from 'react'
import { useGetData } from '@src/hooks/useGetData'
import { Ingredient } from './ArticleCustomDialog'

type Props = {
   data: Record<string, any>
}

const ArticleProductDetails = (props: Props) => {
   const IngredientList = useGetData<Ingredient>('api/Coffee/Ingredient/List', 'Ingredient-article')

   const { formulas, isProduct } = props?.data?.row
   const [open, setOpen] = useState<boolean>(false)

   const handleOpenInfo = (isOpen: boolean) => {
      setOpen(isOpen)
   }

   return (
      <Grid container size={'auto'} justifyContent={'center'} alignItems={'center'}>
         {isProduct && (
            <DataGridIconProvider
               Icon={InsertChartRoundedIcon}
               clickFunc={() => !!formulas?.length && handleOpenInfo(true)}
               disable={!formulas?.length}
               toolTipText={'نمایش فرمول'}
            />
         )}
         <Dialog
            PaperProps={{
               style: {
                  minWidth: sizeConverter(600, 'width'),
                  borderRadius: sizeConverter(12, 'radius'),
               },
            }}
            disableRestoreFocus
            open={open}
         >
            <Grid
               container
               size={12}
               justifyContent={'center'}
               alignItems={'center'}
               sx={{
                  maxWidth: sizeConverter(600, 'width'),
                  p: sizeConverter(10, 'space'),
               }}
            >
               <Grid
                  container
                  size={12}
                  direction="row"
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  sx={{ pb: sizeConverter(5, 'spaceY') }}
               >
                  <Grid size={11} gap={1} container alignItems={'center'} direction="row">
                     <Grid container alignItems={'center'} size="auto">
                        <DataGridIconProvider Icon={InsertChartRoundedIcon} />
                     </Grid>
                     <Grid size={10} justifyContent={'flex-start'} alignItems={'center'} container direction="row">
                        <Typography variant="dialogTitle">{'نمایش'}</Typography>
                        <Grid size={12}>
                           <Typography noWrap variant="dialogSubTitle">
                              {'فرمول ها'}
                           </Typography>
                        </Grid>
                     </Grid>
                  </Grid>

                  <HighlightOffOutlinedIcon
                     sx={{
                        color: '#CCCCCC',
                        width: sizeConverter(26),
                        height: sizeConverter(26),
                        cursor: 'pointer',
                        transition: '0.2s ease-in-out',
                        '&:hover': {
                           color: '#000',
                        },
                     }}
                     onClick={() => handleOpenInfo(false)}
                  />
               </Grid>
               {/* <Typography variant='boxTitle' sx={{ textAlign: 'center', mb: sizeConverter(10, 'spaceY') }}>
                        {'مشخصات محصولات'}
                    </Typography> */}
               <Grid container size={12} sx={{ mt: sizeConverter(20, 'spaceY') }}>
                  <Grid container size={3}>
                     <Typography>{'مواد اولیه'}</Typography>
                  </Grid>
                  <Grid container size={3}>
                     <Typography> {'مقدار ( گرم )'}</Typography>
                  </Grid>
                  <Grid container size={3}>
                     <Typography> {'آب ( میلی لیتر )'}</Typography>
                  </Grid>
                  <Grid container size={3}>
                     <Typography>{'چرخش'}</Typography>
                  </Grid>
               </Grid>
               <Grid size={12} sx={{ my: sizeConverter(10, 'spaceY') }}>
                  <Divider />
               </Grid>

               <Grid container size={12} spacing={2} sx={{ maxHeight: sizeConverter(300, 'height'), overflowY: 'auto' }}>
                  {formulas?.map((item: Record<string, any>) => (
                     <Grid container size={12} key={item?.id}>
                        <Grid container justifyContent={'center'} alignItems={'center'} size={12} gap={sizeConverter(12, 'space')}>
                           <Grid container size={3}>
                              <Typography variant="body2">
                                 {IngredientList?.data?.value?.find((i) => i?.id === item?.ingredientID)?.faName}
                              </Typography>
                           </Grid>
                           <Grid container size={3}>
                              <Typography variant="body2">{item.amount}</Typography>
                           </Grid>
                           <Grid container size={3}>
                              <Typography variant="body2">{item.waterAmount}</Typography>
                           </Grid>
                           <Grid container size={3}>
                              <Typography variant="body2">{item.rotation}</Typography>
                           </Grid>
                        </Grid>
                        <Grid size={12}>
                           <Divider />
                        </Grid>
                     </Grid>
                  ))}
               </Grid>
               <Grid
                  container
                  size={12}
                  justifyContent={'center'}
                  alignItems={'center'}
                  direction="row"
                  sx={{
                     my: sizeConverter(15, 'spaceY'),
                     bgcolor: 'transparen',
                     borderRadius: sizeConverter(12, 'radius'),
                  }}
               >
                  <Grid
                     container
                     size={12}
                     justifyContent={'space-between'}
                     alignItems={'end'}
                     rowGap={sizeConverter(15, 'space')}
                     columnGap={sizeConverter(5, 'space')}
                  ></Grid>
               </Grid>
            </Grid>
            <Grid sx={{ p: sizeConverter(10, 'space') }} container size={12}>
               <Typography variant="body1">تعداد فرمول ها : {formulas?.length}</Typography>
            </Grid>
         </Dialog>
      </Grid>
   )
}

export default ArticleProductDetails
