import { lazy, Suspense, useState, useEffect } from 'react'
import Sidebar from '@components/general/sidebar'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import { SNACKBAR_SEVERITIES, withSnackbar } from '@components/hoc/withSnackbar'
import Grid from '@mui/material/Grid2'
import { snackbarOpenType } from '@src/data/type/snackbarOpen'
import { useGetData } from '@src/hooks/useGetData'
import { sizeConverter } from '@src/utility/sizeConverter'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import SuspendDialog from '@components/general/SuspendDialog'
import GeneralDialog from '@components/general/GeneralDialog'
import { ROLEDIALOG } from '@src/data/dialogArrays/role'
import CustomBar from '@components/section/permission/CustomBar'
import getPermissionColumns from '@components/section/permission/TelecomDataGridColumns'
import { usePutData } from '@src/hooks/usePutData'
import { ResType } from '@src/data/type/resType'
import { addOrUpdateQueryParam } from '@utility/updateQuery.ts'
import { useAccessCheck } from '@src/utility/accessCheck'

import MobilePermissionDialog from '@components/mobile/MobilePermissionDialog'
import MobileRoleList from '@components/mobile/MobileRoleList'
import { useDevice } from '@src/hooks/useDevice'
import CustomCircularProgress from '@components/general/CustomCircularProgress'


const GeneralConfirmDialog = lazy(
  () => import('@components/general/GeneralConfirmDialog.tsx'),
)

const GeneralDeleteDialog = lazy(
  () => import('@components/general/GeneralDeleteDialog.tsx'),
)

type Permissions = {
  id: number
  name: string
  readAccess: boolean
  writeAccess: boolean
}

type PermissionRole = {
  id: number
  name: string
  permissions: Permissions[]
}

export const Route = createFileRoute('/(systemManagement)/permissions')({
  component: withSnackbar(Permissions),
})

function Permissions({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { control, handleSubmit, reset } = useForm()
  const { accessCheck } = useAccessCheck()
  const { isMobile } = useDevice()

  const [openDialog, setOpenDialog] = useState<
    Record<string, 'add' | 'edit' | null>
  >({ confirm: null, roleAdd: null, roleDelete: null, roleMobile: null })

  const [selectedItem, setSelectedItem] = useState<PermissionRole | null>(null)

  const [updatedPermissions, setUpdatedPermissions] = useState<
    Permissions[]
  >([])

  const permissionRoles = useGetData<PermissionRole[]>(
    'api/Role/List',
    'get-roles',
  )

  // const permissionList = useGetData<Permissions[]>(
  //   'api/Main/Permissions/List',
  //   'get-permissions',
  // )

  const handleClickCloseDialog = (key: string) => {
    setOpenDialog((prev) => ({
      ...prev,
      [key]: null,
    }))
  }

  const handleAccessChange = (
    role: Permissions,
    accessType: string,
    value: boolean,
  ) => {
    setUpdatedPermissions((prevPermissions) => {
      const updated = [...prevPermissions]
      const index = updated.findIndex((perm) => perm.id === role.id)
      if (index !== -1) {
        updated[index] = { ...updated[index], [accessType]: value }
      } else {
        updated.push({ ...role, [accessType]: value })
      }
      return updated
    })
  }

  const selectAll = (select: boolean) => {
    if (selectedItem) {
      const updatedAllPermissions = selectedItem.permissions.map((perm) => ({
        ...perm,
        readAccess: select,
        writeAccess: select,
      }))
      setUpdatedPermissions(updatedAllPermissions)

      const defaultValues = updatedAllPermissions.reduce(
        (acc, perm) => {
          acc[`${perm.name}_readAccess`] = perm.readAccess
          acc[`${perm.name}_writeAccess`] = perm.writeAccess
          return acc
        },
        {} as Record<string, boolean>,
      )

      reset(defaultValues)
    }
  }

  const editItem = usePutData(
    selectedItem ? `api/Role/AssignPermissions/${selectedItem?.id}` : '',
  )

  const onSubmit = () => {
    const finalData = updatedPermissions
    editItem?.mutate(finalData, {
      onSuccess: (data) => {
        const res = data as ResType
        if (res.error === 0) {
          snackbarOpen(
            'مورد شما با موفقیت انجام شد',
            SNACKBAR_SEVERITIES.SUCCESS,
          )
          permissionRoles?.refetch()

          close()
        } else {
          snackbarOpen(
            res.error + ' ' + res.errorMessage,
            SNACKBAR_SEVERITIES.ERROR,
          )
        }
      },
      onError: (err: Error) => {
        snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR)
      },
    })
  }

  useEffect(() => {
    if (selectedItem) {
      setUpdatedPermissions(selectedItem.permissions)
      const defaultValues = selectedItem.permissions?.reduce(
        (acc, perm) => {
          acc[`${perm.name}_readAccess`] = perm.readAccess
          acc[`${perm.name}_writeAccess`] = perm.writeAccess
          return acc
        },
        {} as Record<string, boolean>,
      )

      reset(defaultValues)
    }
  }, [selectedItem, reset])

  const isAcceess = accessCheck({
    accessInfoId: 102,
    KindAccessInfo: 'writeAccess',
  })

  const renderMobile = () => {
    return (
      <MobileRoleList
        permissionRoles={permissionRoles}
        setSelectedItem={setSelectedItem}
        setOpenDialog={setOpenDialog}
        isAcceess={isAcceess}
      />
    );
  }

  const renderDesktop = () => {
    return (
      <>
        <Sidebar
          {...(isAcceess && { toolbarArray: ['add', 'edit', 'delete'] })}
          data={permissionRoles.data?.value}
          title={'لیست نقش ها'}
          treeStyle={'none'}
          showPictureUrlOrIcon={false}
          engTitle={'role'}
          size={2.5}
          isSearchParams
          searchKey={searchKeyInSidebar}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setOpenDialog={setOpenDialog}
        />

        <Grid container size={9.4}>
          <TelecomDataGrid
            loading={permissionRoles?.isLoading}
            title={'تخصیص دسترسی ها'}
            columns={getPermissionColumns({ control, handleAccessChange })}
            isShadowMount={!selectedItem}
            disableRowSelection
            data={selectedItem?.permissions}
            toolbarProps={{
              openDialog: () =>
                setOpenDialog((prev) => ({ ...prev, confirm: 'add' })),
              selectAll: () => selectAll(true),
              deselectAll: () => selectAll(false),
            }}
            {...(isAcceess && { CustomToolBar: CustomBar })}
          />
        </Grid>
      </>
    )
  }

  const searchKeyInSidebar = 'permissionID'
  return (
    <Grid
      container
      size={12}
      justifyContent={'flex-start'}
      columnGap={sizeConverter(6, 'spaceX')}
    >
      {permissionRoles?.isLoading ?
        <Grid sx={{ m: 'auto', mt: '50%' }}>
          <CustomCircularProgress thickness={2} size={60} />
        </Grid>
        : isMobile ? renderMobile() : renderDesktop()}


      <Suspense fallback={<SuspendDialog />}>
        {openDialog?.confirm && (
          <GeneralConfirmDialog
            dialogWidth={sizeConverter(400, 'width')}
            snackbarOpen={snackbarOpen}
            dialogCloseFun={() =>
              setOpenDialog((prev) => ({ ...prev, confirm: null }))
            }
            dialogTitle={'تخصیص کیوسک'}
            isDialogOpen={openDialog?.confirm ? 'add' : null}
            confirmMessage={'از تخصیص دسترسی ها طمینان دارید ؟'}
            snackBarSuccessMessage={'با موفقیت اعمال شد'}
            customFunAfterSuccess={() => permissionRoles.refetch()}
            noApiRequest
            noApiRequestFunc={handleSubmit(onSubmit)}
          />
        )}

        {openDialog.roleAdd && (
          <GeneralDialog
            width={sizeConverter(350, 'width')}
            title={'نقش'}
            array={ROLEDIALOG}
            defaultValue={selectedItem}
            editEndpoint={'api/Role/Edit'}
            createEndpoint={'api/Role/Create'}
            snackbarOpen={snackbarOpen}
            open={openDialog.roleAdd}
            wrapperFunc={(res: PermissionRole) => {
              permissionRoles?.refetch()
              if (res.id) {
                addOrUpdateQueryParam(searchKeyInSidebar, res.id.toString())
                setSelectedItem(res)
              }
            }}
            close={() => handleClickCloseDialog('roleAdd')}
          />
        )}

        {openDialog.roleDelete && (
          <GeneralDeleteDialog
            dialogTitle={'نقش'}
            deleteID={selectedItem?.id}
            deleteDescription={`حذف ${selectedItem?.name}`}
            snackbarOpen={snackbarOpen}
            deleteEndPoint={'api/Role/Delete/'}
            isDialogOpen={openDialog.roleDelete}
            customFunAfterSuccess={() => {
              permissionRoles?.refetch()
              setSelectedItem(null)
            }}
            dialogCloseFun={() => handleClickCloseDialog('roleDelete')}
          />
        )}
        {
          isMobile && !!openDialog.roleMobile &&
          <MobilePermissionDialog
            open={!!openDialog.roleMobile} // اگر آیتم انتخاب شده بود باز شود
            selectedRole={selectedItem}
            permissions={updatedPermissions} // استفاده از استیت لوکال برای تغییرات لحظه‌ای تیک‌ها
            onClose={() => { setSelectedItem(null); handleClickCloseDialog('roleMobile') }}
            onSave={handleSubmit(onSubmit)}
            onPermissionChange={handleAccessChange}
          />
        }
      </Suspense>
    </Grid>
  )

}
