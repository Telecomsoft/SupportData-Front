// src/components/systemManagement/users/Users.tsx
import { createFileRoute } from '@tanstack/react-router'
import Grid from '@mui/material/Grid2'
import { lazy, Suspense, useState } from 'react'
import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { useGetData } from '@hooks/useGetData.ts'
import { User } from '@type/userType.ts'
import SuspendDialog from '@components/general/SuspendDialog.tsx'

import { sizeConverter } from '@utility/sizeConverter.ts'
import TelecomDataGrid from '@components/general/telecomDataGrid'

import { ASSIGNPASSWORD, USER } from '@src/data/dialogArrays/user'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Typography } from '@mui/material'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import LockResetIcon from '@mui/icons-material/LockReset';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded'
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import CircleIcon from '@mui/icons-material/Circle'
import { useAccessCheck } from '@src/utility/accessCheck'
import { useDevice } from '@hooks/useDevice' // <-- ایمپورت هوک تشخیص دستگاه
import { MobileUserList } from '@components/mobile/MobileUserList'
import CustomCircularProgress from '@components/general/CustomCircularProgress'

const GeneralDeleteDialog = lazy(
    () => import('@components/general/GeneralDeleteDialog.tsx'),
)
const GeneralDialog = lazy(
    () => import('@components/general/GeneralDialog.tsx'),
)

export const Route = createFileRoute('/(systemManagement)/users')({
    component: withSnackbar(Users),
})

type PermissionInfo = {
    id: number
    name: string
    readAccess?: boolean
    writeAccess?: boolean
}
type PermissionRole = {
    id: number
    name: string
    permissionInfo: PermissionInfo[]
}

type DialogState = 'add' | 'edit' | 'delete' | null;
type AddKindState = 'user' | 'password' | 'capacity' | null;

function Users({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
    const { accessCheck } = useAccessCheck()
    const { isMobile } = useDevice()

    const users = useGetData<any>('api/User/List', 'get-users')
    const permissionRoles = useGetData<PermissionRole[]>('api/Role/List', 'get-roles-user')

    const [selectedItem, setSelectedItem] = useState<User | undefined | null>(null)
    const [addKind, setAddKind] = useState(null)
    const [openDialog, setOpenDialog] = useState<DialogState>(null);

    const hasWriteAccess = accessCheck({ accessInfoId: 101, KindAccessInfo: 'writeAccess' });

    const handleDialog = (value: string) => {
        const parts = value?.split('/');
        const dialog = parts?.[0] as DialogState;
        const kind = parts?.[1] as AddKindState;
        setOpenDialog(dialog);
        setAddKind(kind ?? null);
    };

    // هندلر برای اکشن‌های موبایل (ابتدا کاربر انتخاب می‌شود سپس دیالوگ باز می‌شود)
    const handleMobileAction = (actionType: string, user: any) => {
        setSelectedItem([user.id] as any); // شبیه‌سازی انتخاب گرید که آرایه‌ای از ID ها برمی‌گرداند
        handleDialog(actionType);
    };

    const defultValue = users?.data?.value?.find((i: Record<string, any>) => i.id == selectedItem?.[0])

    const USERS_COL: TelecomColumnsType[] = [
        { field: 'userName', headerName: 'نام کاربر', width: sizeConverter(120, 'width') },
        {
            field: 'roleID', headerName: 'نقش کاربر', width: sizeConverter(120, 'width'), align: 'center',
            renderCell: (param) => <Typography>{permissionRoles?.data?.value?.find(i => i.id === param?.value)?.name} </Typography>
        },
        {
            field: 'disabled', headerName: 'وضعیت', width: sizeConverter(120, 'width'), align: 'center',
            renderCell: (param) => <CircleIcon sx={{ color: !param?.value ? 'primary.main' : 'gray' }} />
        },
        ...(hasWriteAccess ? [{
            field: 'password', headerName: 'تغییر رمز عبور', width: sizeConverter(120, 'width'), align: 'center' as const,
            renderCell: () => <PasswordRoundedIcon onClick={() => handleDialog('add/password')} />
        }] : []),
        ...(hasWriteAccess ? [{
            field: 'reset', headerName: 'باز نشانی رمز عبور', width: sizeConverter(120, 'width'), align: 'center' as const,
            renderCell: () => <LockResetIcon onClick={() => handleDialog('add/reset')} />
        }] : [])
    ]

    const renderDesktop = () => (
        <TelecomDataGrid
            title='لیست کاربران'
            data={users?.data?.value}
            loading={users?.isLoading}
            CustomToolBar={() => (
                hasWriteAccess &&
                <>
                    <DataGridIconProvider
                        toolTipText={'اضافه'}
                        Icon={AddIcon}
                        clickFunc={() => handleDialog('add/user')}
                    />
                    <DataGridIconProvider
                        toolTipText={'ویرایش'}
                        Icon={EditIcon}
                        disable={!selectedItem}
                        clickFunc={() => handleDialog('edit/user')}
                    />
                    <DataGridIconProvider
                        toolTipText={'حذف'}
                        Icon={DeleteIcon}
                        disable={!selectedItem}
                        clickFunc={() => handleDialog('delete')}
                    />
                </>
            )}
            //@ts-ignore
            setRows={setSelectedItem}
            multiSelect={false}
            disableRowSelection={false}
            columns={USERS_COL}
        />
    );

    const renderMobile = () => (
        <Grid
            container
            size={12}
            spacing={2}
            sx={{
                flex: 1,
                minHeight: 0,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                pb: 26,
                alignContent: 'flex-start',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <MobileUserList
                users={users?.data?.value || []}
                roles={permissionRoles?.data?.value || []}
                hasAccess={hasWriteAccess}
                onAction={handleMobileAction}
                onAddClick={() => handleDialog('add/user')}
            />
        </Grid>
    );

    return (
        <Grid
            container
            size={12}
            justifyContent={'flex-start'}
            sx={{
                height: isMobile ? '100dvh' : 'auto',
                overflow: isMobile ? 'hidden' : 'visible'
            }}
            columnGap={sizeConverter(6, 'spaceX')}
        >
            {permissionRoles?.isLoading ?
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}>
                    <CustomCircularProgress thickness={2} size={60} />
                </Grid>
                : isMobile ? renderMobile() : renderDesktop()}

            <Suspense fallback={<SuspendDialog />}>
                {(openDialog === 'add' || openDialog === 'edit') && addKind === 'user' && (
                    <GeneralDialog
                        width={sizeConverter(350, 'width')}
                        title={'کاربر'}
                        array={USER}
                        defaultValue={defultValue}
                        editEndpoint={'api/User/Edit'}
                        createEndpoint={'api/User/Create'}
                        snackbarOpen={snackbarOpen}
                        autoCompleteOption={{ roleID: permissionRoles?.data?.value ?? [] }}
                        open={openDialog}
                        wrapperFunc={() => {
                            users?.refetch();
                        }}
                        close={() => {
                            setOpenDialog(null);
                            setAddKind(null);
                            setSelectedItem(null); // پاک کردن انتخاب بعد از بسته شدن
                        }}
                    />
                )}

                {/* دیالوگ حذف */}
                {openDialog === 'delete' && (
                    <GeneralDeleteDialog
                        dialogTitle={'کاربر'}
                        deleteID={selectedItem?.[0]}
                        deleteDescription={`آیا میخواهید کاربر ${users?.data?.value?.find((i: any) => i.id == selectedItem?.[0])?.userName} را حذف کنید؟`}
                        snackbarOpen={snackbarOpen}
                        deleteEndPoint={'api/User/Delete/'}
                        isDialogOpen={openDialog === 'delete' ? 'add' : null}
                        customFunAfterSuccess={() => {
                            users?.refetch();
                            setSelectedItem(null);
                        }}
                        dialogCloseFun={() => {
                            setOpenDialog(null);
                            setAddKind(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {/* دیالوگ تغییر رمز عبور */}
                {addKind === 'password' && (
                    <GeneralDialog
                        width={sizeConverter(350, 'width')}
                        title={'انتصاب رمز عبور'}
                        array={ASSIGNPASSWORD}
                        apiValueGetter={(data) => ({ ...data, userID: selectedItem?.[0] })}
                        editEndpoint={'api/User/SetPassword'}
                        snackbarOpen={snackbarOpen}
                        open="add"
                        wrapperFunc={() => users?.refetch()}
                        close={() => {
                            setAddKind(null);
                            setOpenDialog(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {/* دیالوگ بازنشانی رمز عبور */}
                {addKind === 'reset' && (
                    <GeneralConfirmDialog
                        dialogWidth={sizeConverter(400, 'width')}
                        snackbarOpen={snackbarOpen}
                        dialogCloseFun={() => {
                            setAddKind(null);
                            setOpenDialog(null);
                            setSelectedItem(null);
                        }}
                        dialogTitle={'بازنشانی رمز عبور'}
                        isDialogOpen={addKind}
                        confirmMessage={'از بازنشانی رمز عبور اطمینان دارید؟'}
                        snackBarSuccessMessage={'با موفقیت اعمال شد'}
                        customFunAfterSuccess={() => users?.refetch()}
                        endPoint={`api/User/ResetPassword/${selectedItem?.[0]}`}
                        apiMethod="put"
                    />
                )}
            </Suspense>
        </Grid>
    )
}

export default Users
