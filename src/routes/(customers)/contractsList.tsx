import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import GeneralCrudPage from '@components/general/GeneralCrudPage'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import ConditionalField from '@components/general/hookFromInputs/ConditionalField'
import SectionTitle from '@components/general/hookFromInputs/SectionTitle'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import { sizeConverter } from '@utility/sizeConverter'
import { useDevice } from '@hooks/useDevice'
import { useGetData } from '@hooks/useGetData'
import JalaliDatePicker from '@components/JalaliDatePicker'
import { convertToShamsi } from '@utility/dateConverter'
import { VISIT_START_MODES, WARRANTY_START_MODES } from '@src/data/type/lookups'
import Grid from '@mui/material/Grid2'
import CircleIcon from '@mui/icons-material/Circle'
import { useState } from 'react'
import { Autocomplete, Box, Button } from '@mui/material'
import StyledTextField from '@components/general/input/StyledTextField'

export const Route = createFileRoute('/(customers)/contractsList')({
  component: withSnackbar(ContractsList),
  staticData: { breadcrumb: 'قراردادها' },
})

const visitOn = (v: any) => !!v.periodicVisitActive

function ContractsList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { isMobile } = useDevice()
  const half = isMobile ? 12 : 5.9
  const customers = useGetData<{ id: number; name: string }[]>('api/Customer/ListCustomers', 'list-customers-for-contracts')

  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [selectedIsActive, setSelectedIsActive] = useState<string>('all')

  const [filterParams, setFilterParams] = useState({
    category: 0,
    isActive: null as boolean | null,
  })


  const categoryOptions = [
    { id: 0, name: 'همه دسته‌بندی‌ها' },
    ...customers.data?.value ?? [],
  ]
  console.log('categoryOptions', categoryOptions)
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

  const dialogArray: DialogArrayType[] = [
    { label: 'مشخصات', value: '_general', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'شماره قرارداد', value: 'contractNo', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'عنوان قرارداد', value: 'name', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'مشتری', value: 'customerID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
    { label: 'تاریخ قرارداد', value: 'contractDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker },

    { label: 'گارانتی', value: '_warranty', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'مدت گارانتی (ماه)', value: 'warrantyMonths', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'شروع گارانتی از', value: 'warrantyStartMode', kind: 'combo', type: 'choice', emptyValue: 1, size: half, component: AutoCompleteComp },
    { title: 'گارانتی تماس تلفنی', value: 'warrantyByCall', kind: 'checkbox', size: 4, component: CheckboxComponent },
    { title: 'گارانتی بازدید', value: 'warrantyByVisit', kind: 'checkbox', size: 4, component: CheckboxComponent },
    { title: 'گارانتی قطعه', value: 'warrantyByPart', kind: 'checkbox', size: 4, component: CheckboxComponent },

    { label: 'بازدید دوره‌ای', value: '_visits', kind: 'custom', noValue: true, component: SectionTitle },
    { title: 'بازدید دوره‌ای فعال است', value: 'periodicVisitActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
    { label: 'فاصله‌ی بازدیدها (روز)', value: 'periodicVisitDays', type: 'natural', kind: 'textField', size: half, component: TextFieldComp, showWhen: visitOn },
    { label: 'شروع بازدیدها', value: 'periodicVisitStartMode', kind: 'combo', type: 'choice', emptyValue: 1, size: half, component: AutoCompleteComp, showWhen: visitOn },
    { label: 'تاریخ شروع', value: 'periodicVisitStartDate', type: 'date', kind: 'textField', size: half, component: JalaliDatePicker, showWhen: (v: any) => visitOn(v) && v.periodicVisitStartMode?.id === 2 },
    { label: 'توضیحات بازدید', value: 'periodicVisitDescription', kind: 'textField', size: 12, component: TextFieldComp, showWhen: visitOn },

    { label: 'زمان پاسخگویی (محاسبه‌ی مهلت تسک)', value: '_sla', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'ساعت پاسخگویی - مرکز استان', value: 'responseHoursProvinceCenter', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'ساعت پاسخگویی - سایر شهرها', value: 'responseHoursOtherCities', type: 'natural', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'شروع ساعت کاری', value: 'workDayStart', type: 'time', kind: 'textField', size: half, component: TextFieldComp },
    { label: 'پایان ساعت کاری', value: 'workDayEnd', type: 'time', kind: 'textField', size: half, component: TextFieldComp },
    { title: 'پشتیبانی در جمعه و تعطیلات', value: 'supportOnHolidays', kind: 'checkbox', size: 12, component: CheckboxComponent },

    { label: 'هزینه‌ها', value: '_costs', kind: 'custom', noValue: true, component: SectionTitle },
    { label: 'هزینه‌ی کارشناسی (ریال)', value: 'inspectionCost', type: 'natural', kind: 'textField', size: 4, component: TextFieldComp },
    { label: 'کیلومتر رایگان', value: 'freeKilometers', type: 'natural', kind: 'textField', size: 4, component: TextFieldComp },
    { label: 'هزینه‌ی هر کیلومتر (ریال)', value: 'costPerKilometer', type: 'natural', kind: 'textField', size: 4, component: TextFieldComp },

    { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
    { title: 'فعال', value: 'isActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
  ]

  const columns: TelecomColumnsType[] = [
    { field: 'contractNo', headerName: 'شماره', width: sizeConverter(110, 'width') },
    { field: 'name', headerName: 'عنوان', width: sizeConverter(180, 'width') },
    { field: 'customerName', headerName: 'مشتری', width: sizeConverter(150, 'width') },
    { field: 'contractDate', headerName: 'تاریخ قرارداد', width: sizeConverter(110, 'width'), valueGetter: (r) => (r.contractDate ? convertToShamsi(r.contractDate) : '') },
    { field: 'warrantyMonths', headerName: 'گارانتی (ماه)', width: sizeConverter(100, 'width') },
    { field: 'responseHoursProvinceCenter', headerName: 'پاسخ مرکز (ساعت)', width: sizeConverter(120, 'width') },
    { field: 'responseHoursOtherCities', headerName: 'پاسخ شهرها (ساعت)', width: sizeConverter(120, 'width') },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      width: sizeConverter(80, 'width'),
      valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'),
      renderCell: (param) => (
        <Grid justifyContent="center" alignItems="center" container>
          <CircleIcon sx={{ color: param?.value ? 'primary.main' : 'gray' }} />
        </Grid>
      )
    },
    { field: 'description', headerName: 'توضیحات', width: sizeConverter(150, 'width') },

    // Warranty
    { field: 'customerID', headerName: 'شناسه مشتری', width: sizeConverter(110, 'width') },
    { field: 'warrantyStartMode', headerName: 'شروع گارانتی از', width: sizeConverter(130, 'width') },
    { field: 'warrantyByCall', headerName: 'گارانتی تماس تلفنی', width: sizeConverter(130, 'width'), valueGetter: (r) => r.warrantyByCall ? 'بله' : 'خیر' },
    { field: 'warrantyByVisit', headerName: 'گارانتی بازدید', width: sizeConverter(120, 'width'), valueGetter: (r) => r.warrantyByVisit ? 'بله' : 'خیر' },
    { field: 'warrantyByPart', headerName: 'گارانتی قطعه', width: sizeConverter(120, 'width'), valueGetter: (r) => r.warrantyByPart ? 'بله' : 'خیر' },

    // Periodic Visits
    { field: 'periodicVisitActive', headerName: 'بازدید دوره‌ای فعال', width: sizeConverter(140, 'width'), valueGetter: (r) => r.periodicVisitActive ? 'بله' : 'خیر' },
    { field: 'periodicVisitDays', headerName: 'فاصله بازدیدها (روز)', width: sizeConverter(140, 'width') },
    { field: 'periodicVisitStartMode', headerName: 'شروع بازدیدها', width: sizeConverter(130, 'width') },
    { field: 'periodicVisitStartDate', headerName: 'تاریخ شروع بازدید', width: sizeConverter(130, 'width'), valueGetter: (r) => (r.periodicVisitStartDate ? convertToShamsi(r.periodicVisitStartDate) : '') },
    { field: 'periodicVisitDescription', headerName: 'توضیحات بازدید', width: sizeConverter(150, 'width') },

    // SLA
    { field: 'workDayStart', headerName: 'شروع ساعت کاری', width: sizeConverter(120, 'width') },
    { field: 'workDayEnd', headerName: 'پایان ساعت کاری', width: sizeConverter(120, 'width') },
    { field: 'supportOnHolidays', headerName: 'پشتیبانی در تعطیلات', width: sizeConverter(140, 'width'), valueGetter: (r) => r.supportOnHolidays ? 'بله' : 'خیر' },

    // Costs
    { field: 'inspectionCost', headerName: 'هزینه کارشناسی (ریال)', width: sizeConverter(150, 'width') },
    { field: 'freeKilometers', headerName: 'کیلومتر رایگان', width: sizeConverter(120, 'width') },
    { field: 'costPerKilometer', headerName: 'هزینه هر کیلومتر (ریال)', width: sizeConverter(160, 'width') },
  ]


  const queryKeyString = `list-contracts-${filterParams.category}-${filterParams.isActive ?? 'all'}`
  const listEndpoint = `api/Contract/ListContracts?customerID=${filterParams.category}${filterParams.isActive !== null ? `&isActive=${filterParams.isActive}` : ''}`
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
      <GeneralCrudPage
        title="قرارداد"
        queryKey={queryKeyString}
        listEndpoint={listEndpoint}
        createEndpoint="api/Contract/AddContract"
        updateEndpoint="api/Contract/UpdateContract"
        deleteEndpoint="api/Contract/DeleteContract/"
        accessID={109}
        columns={columns}
        dialogArray={dialogArray}
        dialogWidth={760}
        autoCompleteOption={{
          customerID: customers.data?.value ?? [],
          warrantyStartMode: WARRANTY_START_MODES,
          periodicVisitStartMode: VISIT_START_MODES,
        }}
        isLoadingExtra={customers.isLoading}
        addDefaultValue={{
          isActive: true, warrantyStartMode: 1, periodicVisitStartMode: 1, workDayStart: '08:00', workDayEnd: '16:00',
        }}
        cardTitle={(r) => `${r.contractNo} - ${r.name}`}
        cardDescription={(r) => [r.customerName, r.warrantyMonths ? `گارانتی ${r.warrantyMonths} ماه` : ''].filter(Boolean).join(' - ')}
        deleteDescription={(r) => `آیا از حذف قرارداد ${r.contractNo} اطمینان دارید؟`}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  )
}