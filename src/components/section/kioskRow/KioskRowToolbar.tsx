import Grid from '@mui/material/Grid2'
import { FC } from 'react'
// import DurationDatePicker from '../../general/DurationDatePicker'
import { sizeConverter } from '@src/utility/sizeConverter'
// import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
// import { useForm } from 'react-hook-form'
import DataGridIconProvider from '../../general/telecomDataGrid/components/DataGridIconProvider'
// import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface KioskRowToolbarProps {
   toolbarProps: {
      actionHandler: (kioskSerial: string) => void
      setOpenDialog: (qry: string) => void
      kiosks: any
      selectedValue: any
   }
}

const KioskRowToolbar: FC<KioskRowToolbarProps> = ({ toolbarProps }) => {
   // const {
   //    getValues,
   //    clearErrors,
   //    setError,
   //    trigger,
   //    register,
   //    unregister,
   //    control,
   //    watch,
   //    reset,
   //    handleSubmit,
   //    formState: { errors },
   // } = useForm({})

   // useEffect(() => {
   //    if (!watch('kioskSerial')) return
   //    if (!toolbarProps.actionHandler) return

   //    toolbarProps.actionHandler(watch('kioskSerial')?.kioskSerial)
   // }, [watch('kioskSerial')])

   return (
      <Grid container size={12} spacing={sizeConverter(4, 'spaceX')}>
         {/* {!!toolbarProps.kiosks && (
            <Grid container>
               <AutoCompleteComp
                  label={'کیوسک'}
                  value="kioskSerial"
                  autocompleteType={'single'}
                  errors={errors}
                  control={control}
                  watch={watch}
                  register={register}
                  autoCompleteOption={toolbarProps.kiosks}
                  sx={{ width: sizeConverter(150, 'width') }}
               />
            </Grid>
         )} */}

         <Grid container alignItems={'center'}>
            <DataGridIconProvider
               toolTipText={'ویرایش'}
               Icon={EditIcon}
               disable={!toolbarProps.selectedValue}
               clickFunc={() => toolbarProps.setOpenDialog('edit')}
               extraStyle={{ height: sizeConverter(20) }}
            />
            <DataGridIconProvider
               toolTipText={'حذف'}
               Icon={DeleteIcon}
               disable={!toolbarProps.selectedValue}
               clickFunc={() => toolbarProps.setOpenDialog('delete')}
               extraStyle={{ height: sizeConverter(20) }}
            />
         </Grid>
      </Grid>
   )
}

export default KioskRowToolbar
