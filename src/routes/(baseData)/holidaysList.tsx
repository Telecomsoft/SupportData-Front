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
import JalaliDatePicker from '@components/JalaliDatePicker'
import { convertToShamsi, dateFn } from '@utility/dateConverter'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import StyledTextField from '@components/general/input/StyledTextField'
import { useState } from 'react'

export const Route = createFileRoute('/(baseData)/holidaysList')({
  component: withSnackbar(HolidaysList),
  staticData: { breadcrumb: 'تعطیلات رسمی' },
})

function HolidaysList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { isMobile } = useDevice()

  // استیت انتخاب سال (پیش‌فرض 0 برای همه سال‌ها)
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [filterYear, setFilterYear] = useState<number>(0)

  // تولید لیست سال‌ها (مثلاً از سال ۱۴۰۳ تا ۱۴۰۸ یا سال جاری شمسی)
  const currentShamsiYear = 1405 // بر اساس تاریخ جاری سیستم
  const yearOptions = [
    { id: 0, name: 'همه سال‌ها' },
    { id: 1403, name: '1403' },
    { id: 1404, name: '1404' },
    { id: 1405, name: '1405' },
    { id: 1406, name: '1406' },
    { id: 1407, name: '1407' },
  ]

  const handleApplyFilter = () => {
    setFilterYear(selectedYear)
  }

  // The date picker is Jalali; it gives the server a Gregorian date (JalaliDatePicker.tsx does the conversion).
  const dialogArray: DialogArrayType[] = [
    { label: 'تاریخ', value: 'date', type: 'date', kind: 'textField', size: isMobile ? 12 : 5.9, component: JalaliDatePicker, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'عنوان تعطیلی', value: 'name', kind: 'textField', size: isMobile ? 12 : 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
  ]

  const columns: TelecomColumnsType[] = [
    {
      field: 'date', 
      headerName: 'تاریخ', 
      width: sizeConverter(120, 'width'), 
      valueGetter: (r) => (r.date ? convertToShamsi(r.date) : ''), 
      renderCell: (params) => (
        <Grid justifyContent="center" alignItems="center" container>
          <Typography sx={{ textAlign: 'center' }} variant="caption">
            {dateFn(params?.value)}
          </Typography>
        </Grid>
      )
    },
    { field: 'name', headerName: 'عنوان', width: sizeConverter(240, 'width') },
  ]

  const queryKeyString = `list-holidays-${filterYear}`
  const listEndpoint = `api/BaseData/ListHolidays?year=${filterYear}`

  return (
    <Box sx={{ width: '100%' }}>
      {/* بخش فیلتر سال مینیمال و Curve */}
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
            options={yearOptions}
            getOptionLabel={(option) => option.name || ''}
            value={yearOptions.find((opt) => opt.id === selectedYear) || yearOptions[0]}
            onChange={(_, newValue) => setSelectedYear(newValue ? newValue.id : 0)}
            renderInput={(params) => (
              <StyledTextField 
                {...params} 
                label="انتخاب سال" 
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

      {/* جدول مدیریت تعطیلات */}
      <GeneralCrudPage
        title="تعطیلی"
        queryKey={queryKeyString}
        listEndpoint={listEndpoint}
        createEndpoint="api/BaseData/AddHoliday"
        deleteEndpoint="api/BaseData/DeleteHoliday/"
        accessID={106}
        columns={columns}
        dialogArray={dialogArray}
        cardTitle={(r) => r.name}
        cardDescription={(r) => (r.date ? convertToShamsi(r.date) : undefined)}
        deleteDescription={(r) => `آیا از حذف تعطیلی ${r.name} اطمینان دارید؟`}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  )
}

export default withSnackbar(HolidaysList)