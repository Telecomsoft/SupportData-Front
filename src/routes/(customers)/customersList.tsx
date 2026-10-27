import { createFileRoute } from '@tanstack/react-router'
import { withSnackbar } from '@components/hoc/withSnackbar'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import GeneralCrudPage from '@components/general/GeneralCrudPage'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import CheckboxComponent from '@components/general/hookFromInputs/CheckboxComp'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import { sizeConverter } from '@utility/sizeConverter'
import { useDevice } from '@hooks/useDevice'
import { useGetData } from '@hooks/useGetData'
import PhonesField from '@components/section/customers/PhonesField'
import { Autocomplete, Box, Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import CircleIcon from '@mui/icons-material/Circle'
import { useState } from 'react'
import StyledTextField from '@components/general/input/StyledTextField'

export const Route = createFileRoute('/(customers)/customersList')({
    component: withSnackbar(CustomersList),
    staticData: { breadcrumb: 'مشتریان' },
})

function CustomersList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { isMobile } = useDevice()
    const half = isMobile ? 12 : 5.9

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

    // a customer that is a bank is linked to the bank (the error knowledge base is filtered by bank)
    const banks = useGetData<{ id: number; name: string }[]>('api/Bank/ListBanks', 'list-banks-for-customers')

    const dialogArray: DialogArrayType[] = [
        { label: 'نام مشتری', value: 'name', kind: 'textField', size: half, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'نام سازمان', value: 'organizationName', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'بانک (اگر مشتری بانک است)', value: 'bankID', kind: 'combo', type: 'choice', size: half, component: AutoCompleteComp },
        { label: 'نام رابط', value: 'contactName', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'تلفن‌ها', value: 'phones', kind: 'custom', size: 12, component: PhonesField },
        { label: 'فکس', value: 'fax', kind: 'textField', size: half, component: TextFieldComp },
        { label: 'توضیحات', value: 'description', kind: 'textField', multiline: true, maxRows: 2, size: 12, component: TextFieldComp },
        { title: 'فعال', value: 'isActive', kind: 'checkbox', size: 12, component: CheckboxComponent },
    ]

    const columns: TelecomColumnsType[] = [
        { field: 'name', headerName: 'نام مشتری', width: sizeConverter(160, 'width') },
        { field: 'organizationName', headerName: 'سازمان', width: sizeConverter(160, 'width') },
        { field: 'bankName', headerName: 'بانک', width: sizeConverter(130, 'width') },
        { field: 'contactName', headerName: 'رابط', width: sizeConverter(130, 'width') },
        { field: 'fax', headerName: 'فکس', width: sizeConverter(130, 'width') },
        {
            field: 'phones', headerName: 'تلفن‌ها', width: sizeConverter(180, 'width'), valueGetter: (r) => (r.phones ?? []).join(' - '), renderCell: (param) =>
                <Grid justifyContent="center" alignItems="center" container>
                    <Typography variant='caption'>{param?.value?.join(',')}</Typography>
                </Grid>
        },
        {
            field: 'isActive', headerName: 'وضعیت', width: sizeConverter(80, 'width'), valueGetter: (r) => (r.isActive ? 'فعال' : 'غیرفعال'), renderCell: (param) => <Grid justifyContent="center" alignItems="center" container>
                <CircleIcon sx={{ color: param?.value ? 'primary.main' : 'gray' }} />
            </Grid>
        },
        { field: 'description', headerName: 'توضیحات', width: sizeConverter(150, 'width') },

    ]
    const queryKeyString = `list-customers-${filterIsActive ?? 'all'}`
    const listEndpoint = `api/Customer/ListCustomers${filterIsActive !== null ? `?isActive=${filterIsActive}` : ''}`

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
            <GeneralCrudPage
                title="مشتری"
                queryKey={queryKeyString}
                listEndpoint={listEndpoint}
                createEndpoint="api/Customer/AddCustomer"
                updateEndpoint="api/Customer/UpdateCustomer"
                deleteEndpoint="api/Customer/DeleteCustomer/"
                accessID={107}
                columns={columns}
                dialogArray={dialogArray}
                dialogWidth={680}
                autoCompleteOption={{ bankID: banks.data?.value ?? [] }}
                isLoadingExtra={banks.isLoading}
                addDefaultValue={{ isActive: true }}
                cardTitle={(r) => r.name}
                cardDescription={(r) => [r.bankName, r.contactName, (r.phones ?? [])[0]].filter(Boolean).join(' - ')}
                deleteDescription={(r) => `آیا از حذف مشتری ${r.name} اطمینان دارید؟`}
                snackbarOpen={snackbarOpen}
            />
        </Box>
    )
}