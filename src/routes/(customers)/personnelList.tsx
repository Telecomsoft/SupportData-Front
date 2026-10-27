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
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import { sizeConverter } from '@utility/sizeConverter'
import { useDevice } from '@hooks/useDevice'
import { useGetData } from '@hooks/useGetData'
import PersonnelRatesField from '@components/section/personnel/PersonnelRatesField'
import { nameOf, PERSONNEL_TYPES, USER_TYPES } from '@src/data/type/lookups'
import Grid from '@mui/material/Grid2'
import CircleIcon from '@mui/icons-material/Circle'
import { useState } from 'react'
import StyledTextField from '@components/general/input/StyledTextField'
import { Autocomplete, Box, Button, Typography } from '@mui/material'

export const Route = createFileRoute('/(customers)/personnelList')({
    component: withSnackbar(PersonnelList),
    staticData: { breadcrumb: 'پرسنل' },
})

type Person = { id: number; firstName: string; lastName: string; personnelType: number; companyName?: string; isActive: boolean }

// personnel types: 1 staff, 2 field technician, 3 workshop repairman, 4 contractor, 5 customer contact
const isType = (v: any, ...types: number[]) => types.includes(v?.personnelType?.id)

function PersonnelList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { isMobile } = useDevice()
    const half = isMobile ? 12 : 5.9

    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [selectedIsActive, setSelectedIsActive] = useState<string>('all')

    const [filterParams, setFilterParams] = useState({
        category: 0,
        isActive: null as boolean | null,
    })


    const categoryOptions = [
        { id: 0, name: 'همه دسته‌بندی‌ها' },
        ...USER_TYPES
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
    // same endpoint and key as the grid below: react-query loads it once and the contractors combo reuses it
    const personnel = useGetData<Person[]>('api/Personnel/ListPersonnel', 'list-personnel')
    const cities = useGetData<{ id: number; name: string }[]>('api/Location/ListCities', 'list-cities-for-personnel')
    const customers = useGetData<{ id: number; name: string }[]>('api/Customer/ListCustomers', 'list-customers-for-personnel')

    // a technician may work for a contractor company: the contractors are the personnel of type 4
    const contractors = (personnel.data?.value ?? [])
        .filter((p) => p.personnelType === 4 && p.isActive)
        .map((p) => ({ id: p.id, name: p.companyName || `${p.firstName} ${p.lastName}` }))

    const dialogArray: DialogArrayType[] = [
        { label: 'نام', value: 'firstName', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'نام خانوادگی', value: 'lastName', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'نوع', value: 'personnelType', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        {
            label: 'کد ملی', value: 'nationalCode', kind: 'textField', size: half, component: TextFieldComp, ltr: true,
            validators: { pattern: { value: /^\d{10}$/, message: 'کد ملی باید ۱۰ رقم باشد' } },
        },
        { label: 'موبایل', value: 'mobile', kind: 'textField', size: half, component: TextFieldComp, ltr: true },
        { label: 'تلفن', value: 'phone', kind: 'textField', size: half, component: TextFieldComp, ltr: true },
        { label: 'شهر', value: 'cityID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
        { label: 'آدرس', value: 'address', kind: 'textField', size: 12, component: TextFieldComp, multiline: true, maxRows: 2 },

        // fields that depend on the type
        { label: 'نام شرکت', value: 'companyName', kind: 'textField', size: half, component: TextFieldComp, showWhen: (v: any) => isType(v, 4) },
        { label: 'پیمانکار (شرکت متبوع)', value: 'contractorID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, showWhen: (v: any) => isType(v, 2, 3) },
        { label: 'مشتری', value: 'customerID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp, showWhen: (v: any) => isType(v, 5), validators: { ...REQUIRED_VALIDATOR } },
        { title: 'مجاز به ثبت تسک', value: 'canCreateTasks', kind: 'checkbox', size: 12, component: CheckboxComponent, showWhen: (v: any) => isType(v, 5) },

        // what the person is paid (only for those who are paid per task)
        { label: 'هزینه‌ی ایاب و ذهاب (ریال)', value: 'transportationCost', type: 'natural', kind: 'textField', size: half, component: TextFieldComp, showWhen: (v: any) => isType(v, 2, 4) },
        { label: 'نرخ هر نوع تسک', value: 'rates', kind: 'custom', size: 12, component: PersonnelRatesField, showWhen: (v: any) => isType(v, 2, 4) },

        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
        { title: 'فعال', value: 'isActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
    ]

    const columns: TelecomColumnsType[] = [
        { field: 'lastName', headerName: 'نام و نام خانوادگی', width: sizeConverter(170, 'width'), valueGetter: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() },
        {
            field: 'personnelType', headerName: 'نوع', width: sizeConverter(120, 'width'), valueGetter: (r) => nameOf(PERSONNEL_TYPES, r.personnelType), renderCell: (param) => {
                return <Grid justifyContent="center" alignItems="center" container >
                    <Typography variant='caption'>{USER_TYPES?.find(i => i.id == param?.value)?.name}</Typography>
                </Grid >
            }
        },
        { field: 'companyName', headerName: 'شرکت', width: sizeConverter(140, 'width') },
        { field: 'nationalCode', headerName: 'کد ملی', width: sizeConverter(110, 'width') },
        { field: 'mobile', headerName: 'موبایل', width: sizeConverter(110, 'width') },
        { field: 'cityName', headerName: 'شهر', width: sizeConverter(110, 'width') },
        {
            field: 'isActive', headerName: 'وضعیت', width: sizeConverter(80, 'width'), valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'), renderCell: (param) =>
                <Grid justifyContent="center" alignItems="center" container>
                    <CircleIcon sx={{ color: param?.value ? 'primary.main' : 'gray' }} />
                </Grid>
        },
    ]
    const queryKeyString = `list-personnel-${filterParams.category}-${filterParams.isActive ?? 'all'}`
    const listEndpoint = `api/Personnel/ListPersonnel?type=${filterParams.category}${filterParams.isActive !== null ? `&isActive=${filterParams.isActive}` : ''}`

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
                title="پرسنل"
                queryKey={queryKeyString}
                listEndpoint={listEndpoint}
                createEndpoint="api/Personnel/AddPersonnel"
                updateEndpoint="api/Personnel/UpdatePersonnel"
                deleteEndpoint="api/Personnel/DeletePersonnel/"
                accessID={108}
                columns={columns}
                dialogArray={dialogArray}
                dialogWidth={720}
                autoCompleteOption={{
                    personnelType: PERSONNEL_TYPES,
                    cityID: cities.data?.value ?? [],
                    customerID: customers.data?.value ?? [],
                    contractorID: contractors,
                }}
                isLoadingExtra={cities.isLoading || customers.isLoading}
                addDefaultValue={{ isActive: true }}
                cardTitle={(r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim()}
                cardDescription={(r) => [nameOf(PERSONNEL_TYPES, r.personnelType), r.companyName, r.cityName].filter(Boolean).join(' - ')}
                deleteDescription={(r) => `آیا از حذف ${r.firstName} ${r.lastName} اطمینان دارید؟`}
                snackbarOpen={snackbarOpen}
            />
        </Box>
    )
}