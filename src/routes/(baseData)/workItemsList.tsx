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
import CircleIcon from '@mui/icons-material/Circle'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import StyledTextField from '@components/general/input/StyledTextField'

export const Route = createFileRoute('/(baseData)/workItemsList')({
  component: withSnackbar(WorkItemsList),
  staticData: { breadcrumb: 'کارهای انجام شده' },
})

function WorkItemsList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { isMobile } = useDevice()

  // استیت‌های فیلتر بالا
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [selectedIsActive, setSelectedIsActive] = useState<string>('all')

  const [filterParams, setFilterParams] = useState({
    category: 0,
    isActive: null as boolean | null,
  })

  // دریافت لیست دسته‌بندی‌ها (پشتیبانی از ساختار value یا آرایه مستقیم)
  const categoriesData = useGetData<any>('api/BaseData/ListWorkItems', 'list-work-items')

  // استخراج صحیح لیست دسته‌بندی‌ها

  // گزینه‌های دسته‌بندی فیلتر بالا (همراه با گزینه همه / 0)
  const categoryOptions = [
    { id: 0, name: 'همه دسته‌بندی‌ها' },
    { id: 1, name: 'تعویض' },
    { id: 2, name: 'تعمیرات' },
  ]

  // گزینه‌های وضعیت
  const activeOptions = [
    { id: 'all', name: 'همه وضعیت‌ها' },
    { id: 'true', name: 'فعال' },
    { id: 'false', name: 'غیرفعال' },
  ]

  const handleApplyFilter = () => {
    let activeVal: boolean | null = null
    if (selectedIsActive === 'true') activeVal = true
    else if (selectedIsActive === 'false') activeVal = false

    setFilterParams({
      category: selectedCategory,
      isActive: activeVal,
    })
  }

  // اصلاح دیالوگ افزودن و ویرایش (ارسال صحیح گزینه‌ها و مقادیر)
  const dialogArray: DialogArrayType[] = [
    { label: 'عنوان کار', value: 'name', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    {
      label: 'دسته‌بندی',
      value: 'category',
      kind: 'combo',
      size: isMobile ? 12 : 5.9,
      component: AutoCompleteComp,
      autocompleteType: 'single',
      autoCompleteOption: categoryOptions
    },
    { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
    { title: 'فعال', value: 'isActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
  ]

  const columns: TelecomColumnsType[] = [
    { field: 'name', headerName: 'عنوان کار', width: sizeConverter(160, 'width') },
    {
      field: 'category',
      headerName: 'دسته‌بندی',
      width: sizeConverter(140, 'width'),
      valueGetter: (r) => {
        const found = categoryOptions.find((c: any) => c.id === r.category)
        return found ? found.name : r.category
      }
    },
    { field: 'description', headerName: 'توضیحات', width: sizeConverter(220, 'width') },
    {
      field: 'isActive', headerName: 'وضعیت', width: sizeConverter(80, 'width'), valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'),
      renderCell: (param) => <Grid justifyContent="center" alignItems="center" container>
        <CircleIcon sx={{ color: param?.value ? 'primary.main' : 'gray' }} />
      </Grid>
    },
  ]

  const queryKeyString = `list-work-items-${filterParams.category}-${filterParams.isActive ?? 'all'}`
  const listEndpoint = `api/BaseData/ListWorkItems?category=${filterParams.category}${filterParams.isActive !== null ? `&isActive=${filterParams.isActive}` : ''}`

  return (
    <Box sx={{ width: '100%' }}>
      {/* بخش فیلترهای مینیمال و Curve (گرد) */}
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={categoryOptions}
            getOptionLabel={(option) => option.name || ''}
            value={categoryOptions.find((opt) => opt.id === selectedCategory) || categoryOptions[0]}
            onChange={(_, newValue) => setSelectedCategory(newValue ? newValue.id : 0)}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="دسته‌بندی"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: sizeConverter(12, 'radius') } }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={activeOptions}
            getOptionLabel={(option) => option.name || ''}
            value={activeOptions.find((opt) => opt.id === selectedIsActive) || activeOptions[0]}
            onChange={(_, newValue) => setSelectedIsActive(newValue ? newValue.id : 'all')}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="وضعیت"
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

      {/* جدول مدیریت داده‌ها */}
      <GeneralCrudPage
        title="کار انجام شده"
        queryKey={queryKeyString}
        listEndpoint={listEndpoint}
        createEndpoint="api/BaseData/AddWorkItem"
        updateEndpoint="api/BaseData/UpdateWorkItem"
        deleteEndpoint="api/BaseData/DeleteWorkItem/"
        accessID={107}
        columns={columns}
        dialogArray={dialogArray}
        autoCompleteOption={{ category: categoryOptions }}
        isLoadingExtra={categoriesData.isLoading}
        addDefaultValue={{ isActive: true, category: 0 }}
        cardTitle={(r) => r.name}
        cardDescription={(r) => `${r.description ?? ''}`}
        deleteDescription={(r) => `آیا از حذف کار ${r.name} اطمینان دارید؟`}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  )
}

export default withSnackbar(WorkItemsList)