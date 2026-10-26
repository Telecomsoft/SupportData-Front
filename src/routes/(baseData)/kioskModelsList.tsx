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
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import StyledTextField from '@components/general/input/StyledTextField'
import { useState } from 'react'

export const Route = createFileRoute('/(baseData)/kioskModelsList')({
  component: withSnackbar(KioskModelsList),
  staticData: { breadcrumb: 'مدل‌های کیوسک' },
})

function KioskModelsList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { isMobile } = useDevice()

  // استیت‌های فیلتر وضعیت
  const [selectedIsActive, setSelectedIsActive] = useState<string>('all')
  const [filterIsActive, setFilterIsActive] = useState<boolean | null>(null)

  const activeOptions = [
    { id: 'all', name: 'همه وضعیت‌ها' },
    { id: 'true', name: 'فعال' },
    { id: 'false', name: 'غیرفعال' },
  ]

  const handleApplyFilter = () => {
    let activeVal: boolean | null = null
    if (selectedIsActive === 'true') activeVal = true
    else if (selectedIsActive === 'false') activeVal = false
    setFilterIsActive(activeVal)
  }

  // the part models a new kiosk of this model is fitted with at the factory
  const deviceModels = useGetData<{ id: number; name: string }[]>('api/Device/ListDeviceModels', 'list-device-models-for-kiosk-models')

  const dialogArray: DialogArrayType[] = [
    { label: 'نام مدل', value: 'name', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'سری', value: 'series', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp },
    { label: 'قطعات پیش‌فرض', value: 'defaultDeviceModelIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: 12, component: AutoCompleteComp },
    { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
    { title: 'فعال', value: 'isActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
  ]

  const columns: TelecomColumnsType[] = [
    { field: 'name', headerName: 'نام مدل', width: sizeConverter(160, 'width') },
    { field: 'series', headerName: 'سری', width: sizeConverter(120, 'width') },
    { field: 'description', headerName: 'توضیحات', width: sizeConverter(220, 'width') },
    {
      field: 'defaultDeviceModelIDs', 
      headerName: 'قطعات پیش فرض', 
      width: sizeConverter(220, 'width'),
      renderCell: (params) => {
        return (
          <Grid justifyContent="center" alignItems="center" container>
            {deviceModels.data?.value?.filter(i => params?.value?.includes(i.id))?.map(i => i.name)?.join(',')}
          </Grid>
        )
      }
    },
    {
      field: 'isActive', 
      headerName: 'وضعیت', 
      width: sizeConverter(80, 'width'), 
      valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'),
      renderCell: (params) => (
        <Grid justifyContent="center" alignItems="center" container>
          <CheckCircleIcon sx={{
            alignSelf: 'center',
            color: params.value === 'فعال' || params.value === true ? 'dataGrid.main' : 'black.6',
            width: sizeConverter(20),
            height: sizeConverter(20),
          }}
          />
        </Grid>
      )
    },
  ]

  const queryKeyString = `list-kiosk-models-${filterIsActive ?? 'all'}`
  const listEndpoint = `api/BaseData/ListKioskModels${filterIsActive !== null ? `?isActive=${filterIsActive}` : ''}`

  return (
    <Box sx={{ width: '100%' }}>
      {/* فیلتر وضعیت مینیمال و Curve */}
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          p: 2.5, 
          alignItems: 'center', 
          bgcolor: 'background.paper', 
          mb: 2, 
          borderRadius: sizeConverter(16, 'radius'),
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <Autocomplete
            options={activeOptions}
            getOptionLabel={(option) => option.name || ''}
            value={activeOptions.find((opt) => opt.id === selectedIsActive) || activeOptions[0]}
            onChange={(_, newValue) => setSelectedIsActive(newValue ? newValue.id : 'all')}
            renderInput={(params) => (
              <StyledTextField 
                {...params} 
                label="وضعیت مدل" 
                fullWidth 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizeConverter(12, 'radius') } }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Button 
            variant="contained" 
            onClick={handleApplyFilter} 
            fullWidth 
            sx={{ 
              height: '56px', 
              borderRadius: sizeConverter(12, 'radius'),
              fontWeight: 'bold',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
            }}
          >
            اعمال فیلتر
          </Button>
        </Grid>
      </Grid>

      {/* جدول مدیریت مدل‌های کیوسک */}
      <GeneralCrudPage
        title="مدل کیوسک"
        queryKey={queryKeyString}
        listEndpoint={listEndpoint}
        createEndpoint="api/BaseData/AddKioskModel"
        updateEndpoint="api/BaseData/UpdateKioskModel"
        deleteEndpoint="api/BaseData/DeleteKioskModel/"
        accessID={106}
        columns={columns}
        dialogArray={dialogArray}
        autoCompleteOption={{ defaultDeviceModelIDs: deviceModels.data?.value ?? [] }}
        isLoadingExtra={deviceModels.isLoading}
        addDefaultValue={{ isActive: true }}
        cardTitle={(r) => r.name}
        cardDescription={(r) => `${r.series ?? ''} ${r.isActive ? '' : '(غیرفعال)'}`}
        deleteDescription={(r) => `آیا از حذف مدل ${r.name} اطمینان دارید؟`}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  )
}

export default withSnackbar(KioskModelsList)