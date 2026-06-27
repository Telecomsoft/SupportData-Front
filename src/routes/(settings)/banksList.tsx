

import Grid from '@mui/material/Grid2'
import { createFileRoute } from '@tanstack/react-router'
import { useGetData } from '@hooks/useGetData.ts'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { User } from '@type/userType.ts'
import { useState } from 'react'
import GeneralDialog from '@components/general/GeneralDialog.tsx'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog.tsx'
import { Box, Fab, useMediaQuery, useTheme } from '@mui/material'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { useAccessCheck } from '@src/utility/accessCheck'

import SettingsCard from '@components/mobile/SettingsCard'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { DialogArrayType } from '@src/data/type/dialogArrayType'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'

export const Route = createFileRoute('/(settings)/banksList')({
    component: withSnackbar(devicesList),
    staticData: {
        breadcrumb: 'لیست بانک ها',
    },
})

function devicesList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const listBanks = useGetData<User[]>('api/Error/ListBanks', 'list-bank')
    const { accessCheck } = useAccessCheck()
    const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined)
    const [openDialog, setOpenDialog] = useState<'add' | 'delete' | 'edit' | null>(null)

    // تشخیص حالت موبایل
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const KIOSKS_ARRAY: DialogArrayType[] = [
        {
            label: 'نام بانک',
            value: 'name',
            kind: 'textField',
            size: isMobile ? 12 : 2.9,
            component: TextFieldComp,
            validators: { ...REQUIRED_VALIDATOR },
        },
        {
            label: 'توضیحات',
            value: 'description',
            kind: 'textField',
            maxRows: 2,
            multiline: true,
            size: isMobile ? 12 : 8.9,
            component: TextFieldComp,
            validators: { ...REQUIRED_VALIDATOR },
        },
    ]

    const KIOSKS_COLUMNS: TelecomColumnsType[] = [
        {
            field: 'name',
            headerName: 'نام بانک',
            width: sizeConverter(120, 'width')
        },
        {
            field: 'description',
            headerName: 'توضیحات ',
            width: sizeConverter(150, 'width')
        },
    ];

    const hasWriteAccess = accessCheck({
        accessInfoId: 103,
        KindAccessInfo: 'writeAccess',
    })

    return (
        <Grid
            container
            size={12}
            sx={{
                position: 'relative',
                height: isMobile ? '100dvh' : 'auto',
                overflow: isMobile ? 'hidden' : 'visible'
            }}
        >
            {listBanks?.isLoading ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}>
                    <CustomCircularProgress thickness={2} size={60} />
                </Grid>
            ) : isMobile ? (
                // ---------------- حالت موبایل ----------------
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pb: 26,
                        gap: 2,
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {listBanks?.data?.value?.map((bank: any) => (
                        <Grid size={12} key={bank.id}>

                            <SettingsCard
                                key={bank.id}
                                name={bank.name}
                                description={bank.description}
                                onEdit={() => {
                                    setSelectedValue(bank.id);
                                    setOpenDialog('edit');
                                }}
                                onDelete={() => {
                                    setSelectedValue(bank.id);
                                    setOpenDialog('delete');
                                }}
                                hasAccess={hasWriteAccess}
                            />
                        </Grid>
                    ))}

                    {hasWriteAccess && (
                        <Fab
                            color="primary"
                            sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }}
                            onClick={() => {
                                setSelectedValue(undefined);
                                setOpenDialog('add');
                            }}
                        >
                            <AddIcon />
                        </Fab>
                    )}
                </Box>
            ) : (
                // ---------------- حالت دسکتاپ ----------------
                <TelecomDataGrid
                    data={listBanks?.data?.value}
                    loading={listBanks?.isLoading}
                    doubleClickFunc={() => setOpenDialog('edit')}
                    CustomToolBar={() => {
                        return hasWriteAccess && (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'اضافه'} Icon={AddIcon} disable={false} clickFunc={() => setOpenDialog('add')} />
                                <DataGridIconProvider
                                    toolTipText={'ویرایش'}
                                    Icon={EditIcon}
                                    disable={!selectedValue}
                                    clickFunc={() => setOpenDialog('edit')}
                                />
                                <DataGridIconProvider
                                    toolTipText={'حذف'}
                                    Icon={DeleteIcon}
                                    disable={!selectedValue}
                                    clickFunc={() => setOpenDialog('delete')}
                                />
                            </Grid>
                        )
                    }}
                    setRows={(data) => data && setSelectedValue(data?.[0])}
                    multiSelect={false}
                    disableRowSelection={false}
                    columns={KIOSKS_COLUMNS}
                />
            )}

            {(openDialog === 'add' || openDialog === 'edit') && (
                <GeneralDialog
                    open={openDialog}
                    title={'بانک'}
                    close={() => setOpenDialog(null)}
                    array={KIOSKS_ARRAY}
                    editEndpoint={'api/Error/UpdateBank'}
                    createEndpoint={'api/Error/AddBank'}
                    staticServerData={openDialog === 'edit' ? { id: selectedValue } : {}}
                    defaultValue={{ ...listBanks?.data?.value?.find((i) => i?.id === selectedValue) }}
                    wrapperFunc={() => listBanks.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {openDialog === 'delete' && (
                <GeneralDeleteDialog
                    dialogTitle={'بانک'}
                    deleteID={selectedValue}
                    deleteDescription={`آیا از حذف  ${listBanks?.data?.value?.find((item: any) => item?.id === selectedValue)?.name} اطمینان دارید؟`}
                    snackbarOpen={snackbarOpen}
                    deleteEndPoint={'api/Error/DeleteBank/'}
                    isDialogOpen={openDialog}
                    customFunAfterSuccess={() => {
                        listBanks?.refetch()
                        setSelectedValue(null)
                    }}
                    dialogCloseFun={() => setOpenDialog(null)}
                />
            )}
        </Grid>
    )
}

