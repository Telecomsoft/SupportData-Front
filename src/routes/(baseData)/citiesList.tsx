import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import GeneralCrudPage from '@components/general/GeneralCrudPage'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import { sizeConverter } from '@utility/sizeConverter'
import { useDevice } from '@hooks/useDevice'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import { useGetData } from '@hooks/useGetData'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Grid from '@mui/material/Grid2'

export const Route = createFileRoute('/(baseData)/citiesList')({
  component: withSnackbar(CitiesList),
  staticData: { breadcrumb: 'شهرها' },
})

function CitiesList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { isMobile } = useDevice()
  // the provinces fill the "province" combo of the dialog
  const provinces = useGetData<{ id: number; name: string }[]>('api/Location/ListProvinces', 'list-provinces-for-cities')

  const dialogArray: DialogArrayType[] = [
    { label: 'نام شهر', value: 'name', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'استان', value: 'provinceID', kind: 'combo', type: 'choice', size: isMobile ? 12 : 5.9, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
    // a province centre gets the contract's "province centre" response time (SLA)
    { title: 'مرکز استان', value: 'isProvinceCenter', kind: 'checkbox', size: 12, component: CheckboxComponent },
  ]

  const columns: TelecomColumnsType[] = [
    { field: 'name', headerName: 'نام شهر', width: sizeConverter(160, 'width') },
    { field: 'provinceName', headerName: 'استان', width: sizeConverter(160, 'width') },
    {
      field: 'isProvinceCenter', headerName: 'مرکز استان', width: sizeConverter(100, 'width'), valueGetter: (r) => (r.isProvinceCenter ? 'بله' : 'خیر'),
      renderCell: (params) => <Grid justifyContent="center" alignItems="center" container>

        <CheckCircleIcon sx={{
          alignSelf: 'center',
          color: params.value ? 'dataGrid.main' : 'black.6',
          width: sizeConverter(20),
          height: sizeConverter(20),
        }}
        />
      </Grid>
    },
  ]

  return (
    <GeneralCrudPage
      title="شهر"
      queryKey="list-cities"
      listEndpoint="api/Location/ListCities"
      createEndpoint="api/Location/AddCity"
      updateEndpoint="api/Location/UpdateCity"
      deleteEndpoint="api/Location/DeleteCity/"
      accessID={106}
      columns={columns}
      dialogArray={dialogArray}
      autoCompleteOption={{ provinceID: provinces.data?.value ?? [] }}
      isLoadingExtra={provinces.isLoading}
      cardTitle={(r) => r.name}
      cardDescription={(r) => `${r.provinceName ?? ''}${r.isProvinceCenter ? ' - مرکز استان' : ''}`}
      deleteDescription={(r) => `آیا از حذف شهر ${r.name} اطمینان دارید؟`}
      snackbarOpen={snackbarOpen}
    />
  )
}