

// //@ts-nocheck
// import Grid from '@mui/material/Grid2'

// import { createFileRoute } from '@tanstack/react-router'
// import { useGetData } from '@hooks/useGetData.ts'
// import TelecomDataGrid from '@components/general/telecomDataGrid'
// import { sizeConverter } from '@utility/sizeConverter.ts'
// import { Access, KioskType, User } from '@type/userType.ts'
// import { Suspense, useEffect, useState } from 'react'
// import GeneralDialog from '@components/general/GeneralDialog.tsx'
// import { snackbarOpenType } from '@type/snackbarOpen.ts'
// import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
// import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
// import AddIcon from '@mui/icons-material/Add'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteIcon from '@mui/icons-material/Delete'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'

// import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog.tsx'
// import { Grid2, Typography } from '@mui/material'
// import SuspendDialog from '@components/general/SuspendDialog'
// import ArticleDataGridToolbar from '@components/section/main/ArticleDataGridToolbar'
// import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
// import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
// import { useForm } from 'react-hook-form'
// import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
// import { useAccessCheck } from '@src/utility/accessCheck'

// export const Route = createFileRoute('/(settings)/banksList')({
//     component: withSnackbar(devicesList),
//     staticData: {
//         breadcrumb: 'لیست بانک ها',
//     },
// })

// function devicesList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
//     const listBanks = useGetData<User[]>('api/Error/ListBanks', 'list-bank')
//     const { accessCheck } = useAccessCheck()
//     const [selectedValue, setSelectedValue] = useState<number | undefined>(
//         undefined,
//     )
//     const [openDialog, setOpenDialog] = useState<'add' | 'delete' | 'edit' | null>(null)

//     const KIOSKS_ARRAY: DialogArrayType[] = [
//         {
//             label: 'نام بانک',
//             value: 'name',
//             kind: 'textField',
//             size: 2.9,
//             component: TextFieldComp,
//             validators: { ...REQUIRED_VALIDATOR },
//         },
//         {
//             label: 'توضیحات',
//             value: 'description',
//             kind: 'textField',
//             size: 8.9,
//             component: TextFieldComp,
//             validators: { ...REQUIRED_VALIDATOR },
//         },
//     ]

//     const KIOSKS_COLUMNS: TelecomColumnsType[] = [
//         {
//             field: 'name',
//             headerName: 'نام بانک',
//             width: sizeConverter(120, 'width')
//         },
//         {
//             field: 'description',
//             headerName: 'توضیحات ',
//             width: sizeConverter(150, 'width')
//         },
//     ];

//     return (
//         <Grid container size={12}>
//             <TelecomDataGrid
//                 data={listBanks?.data?.value}
//                 loading={listBanks?.isLoading}
//                 CustomToolBar={() => {
//                     return accessCheck({
//                         accessInfoId: 103,
//                         KindAccessInfo: 'writeAccess',
//                     }) && <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
//                             <DataGridIconProvider toolTipText={'اضافه'} Icon={AddIcon} disable={false} clickFunc={() => setOpenDialog('add')} />
//                             <DataGridIconProvider
//                                 toolTipText={'ویرایش'}
//                                 Icon={EditIcon}
//                                 disable={!selectedValue}
//                                 clickFunc={() => setOpenDialog('edit')}
//                             />
//                             <DataGridIconProvider
//                                 toolTipText={'حذف'}
//                                 Icon={DeleteIcon}
//                                 disable={!selectedValue}
//                                 clickFunc={() => setOpenDialog('delete')}
//                             />
//                         </Grid>
//                 }
//                 }
//                 //@ts-ignore
//                 setRows={(data) => data && setSelectedValue(data?.[0])}
//                 multiSelect={false}
//                 disableRowSelection={false}
//                 columns={KIOSKS_COLUMNS}
//             />

//             {(openDialog === 'add' || openDialog === 'edit') && (
//                 <GeneralDialog
//                     open={openDialog}
//                     title={'بانک'}
//                     close={() => setOpenDialog(null)}
//                     array={KIOSKS_ARRAY}
//                     editEndpoint={'api/Error/UpdateBank'}
//                     createEndpoint={'api/Error/AddBank'}
//                     staticServerData={openDialog === 'edit' ? { id: selectedValue } : {}}
//                     defaultValue={{ ...listBanks?.data?.value?.find((i) => i?.id === selectedValue) }}
//                     wrapperFunc={() => listBanks.refetch()}
//                     snackbarOpen={snackbarOpen}
//                 // apiValueGetter={(data: any) => {
//                 //   return ({ ...data, deviceIDs: data?.deviceIDs?.map(x => x.id), bankIDs: data?.bankIDs?.map(x => x.id), keyWords: ['اینترنت'], id: selectedValue || 0 })
//                 // }}
//                 // sendFinalData={true}
//                 />
//             )}
//             {openDialog === 'delete' && (
//                 <GeneralDeleteDialog
//                     dialogTitle={'بانک'}
//                     deleteID={selectedValue}
//                     deleteDescription={`آیا از حذف  ${listBanks?.data?.value?.find(item => item?.id === selectedValue)?.name} اطمینان دارید؟`}
//                     snackbarOpen={snackbarOpen}
//                     deleteEndPoint={'api/Error/DeleteBank/'}
//                     isDialogOpen={openDialog}
//                     customFunAfterSuccess={() => {
//                         listBanks?.refetch()
//                         // queryClient?.refetchQueries({ queryKey: ['get-list-view'] })
//                         // queryClient?.refetchQueries({ queryKey: ['kiosks-list'] })
//                         setSelectedValue(null)
//                     }}
//                     dialogCloseFun={() => setOpenDialog(null)}
//                 />
//             )}
//         </Grid>
//     )
// }



//@ts-nocheck
import Grid from '@mui/material/Grid2'
import { createFileRoute } from '@tanstack/react-router'
import { useGetData } from '@hooks/useGetData.ts'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { Access, KioskType, User } from '@type/userType.ts'
import { Suspense, useEffect, useState } from 'react'
import GeneralDialog from '@components/general/GeneralDialog.tsx'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog.tsx'
import { Box, Fab, Typography, useMediaQuery, useTheme } from '@mui/material'
import SuspendDialog from '@components/general/SuspendDialog'
import ArticleDataGridToolbar from '@components/section/main/ArticleDataGridToolbar'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { useForm } from 'react-hook-form'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { useAccessCheck } from '@src/utility/accessCheck'

// کامپوننت کارت موبایل را ایمپورت کنید (مسیر را در صورت نیاز اصلاح کنید)
import MobileErrorCard from '@components/mobile/MobileErrorCard'
import SettingsCard from '@components/mobile/SettingsCard'

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
            size: 2.9,
            component: TextFieldComp,
            validators: { ...REQUIRED_VALIDATOR },
        },
        {
            label: 'توضیحات',
            value: 'description',
            kind: 'textField',
            size: 8.9,
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
        <Grid container size={12} sx={{ position: 'relative', height: '100%' }}>

            {isMobile ? (
                // ---------------- حالت موبایل ----------------
                <Box sx={{ width: '100%', p: 2, pb: 10, overflowY: 'auto' }}>
                    {listBanks?.data?.value?.map((bank: any) => (
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
                    ))}

                    {/* دکمه افزودن شناور (FAB) برای موبایل */}
                    {hasWriteAccess && (
                        <Fab
                            color="primary"
                            sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }}
                            onClick={() => setOpenDialog('add')}
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
                    //@ts-ignore
                    setRows={(data) => data && setSelectedValue(data?.[0])}
                    multiSelect={false}
                    disableRowSelection={false}
                    columns={KIOSKS_COLUMNS}
                />
            )}

            {/* دیالوگ‌ها (مشترک بین دسکتاپ و موبایل) */}
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

