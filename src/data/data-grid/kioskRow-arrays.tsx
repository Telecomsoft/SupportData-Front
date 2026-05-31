import { sizeConverter } from '@utility/sizeConverter.ts'
import { TelecomColumnsType } from '@type/TelecomDataGridType.ts'
import { DialogArrayType } from '@type/dialogArrayType.ts'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete.tsx'
import ImageComponent from '@components/general/ImageComponent.tsx'
import Grid from '@mui/material/Grid2'
import { Typography } from '@mui/material'
import ArticleInfo from '@components/general/ArticleInfo'

// interface TKioskRow {
//    kioskSerial: string
//    rowID: number
//    floorID: number
//    articleTypeID: null | number
//    articleID: null | number
//    articleName: null | string
//    pictureURL: null | string
//    price: null | number
//    discount: null | number
//    isActive: boolean
//    userID: null | number
//    createdDatetime: null
//    createdShowDatetime: null
// }
export const kioskRowColumns = (): TelecomColumnsType[] => [
   // { field: 'kioskSerial', headerName: 'سریال کیوسک', width: sizeConverter(200, 'width') },
   { field: 'index', headerName: 'ردیف', width: sizeConverter(120, 'width') },
   {
      field: 'articleID',
      headerName: 'کد محصول',
      width: sizeConverter(120, 'width'),
      renderCell: ({ value, row }) => {
         return (
            value && (
               <Grid container size={'auto'} justifyContent={'center'} alignItems={'center'}>
                  <Typography sx={{ fontSize: sizeConverter(11) }}>{value}</Typography>
                  <ArticleInfo articleID={row?.articleID} />
               </Grid>
            )
         )
      },
   },

   {
      field: 'articleName',
      headerName: 'نام محصول',
      width: sizeConverter(120, 'width'),
   },

   {
      field: 'pictureURL',
      headerName: 'تصویر',
      align: 'center',
      width: sizeConverter(120, 'width'),
      renderCell: ({ value }) => {
         return (
            value && (
               <Grid container size={'auto'}>
                  <ImageComponent
                     borderRadius={sizeConverter(16)}
                     src={value}
                     alt={'user-pic'}
                     width={sizeConverter(36)}
                     height={sizeConverter(36)}
                  />
               </Grid>
            )
         )
      },
   },
   {
      field: 'price',
      headerName: 'مبلغ (ریال)',
      width: sizeConverter(120, 'width'),
      align: 'center',
      renderCell: ({ value }) => {
         return (
            value && (
               <Typography variant="normal" sx={{ fontSize: sizeConverter(10) }}>
                  {value?.toLocaleString()}
               </Typography>
            )
         )
      },
   },
   {
      field: 'cost',
      headerName: 'مبلغ تمام شده (ریال)',
      width: sizeConverter(120, 'width'),
      align: 'center',
      renderCell: ({ value }) => {
         return (
            value && (
               <Typography variant="normal" sx={{ fontSize: sizeConverter(10) }}>
                  {value?.toLocaleString()}
               </Typography>
            )
         )
      },
   },

   { field: 'discount', headerName: 'تخفیف', width: sizeConverter(120, 'width') },
]

export const KIOSK_ROW_ARRAY: DialogArrayType[] = [
   {
      label: 'نوع محصول',
      value: 'articleTypeID',
      kind: 'combo',
      size: 5.9,
      component: AutoCompleteComp,
   },

   {
      label: 'محصول',
      value: 'articleID',
      kind: 'combo',
      size: 5.9,
      component: AutoCompleteComp,
   },

   {
      label: 'مبلغ (ریال)',
      kind: 'textField',
      value: 'price',
      type: 'number',
      component: TextFieldComp,
      size: 5.9,
   },
   {
      label: 'مبلغ تمام شده (ریال)',
      kind: 'textField',
      value: 'cost',
      type: 'number',
      component: TextFieldComp,
      size: 5.9,
   },
   {
      label: 'تخفیف',
      kind: 'textField',
      value: 'discount',
      type: 'number',
      component: TextFieldComp,
      size: 5.9,
   },
]
