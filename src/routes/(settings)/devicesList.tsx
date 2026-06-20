
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
import { Fab } from '@mui/material'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { useAccessCheck } from '@src/utility/accessCheck'
import SettingsCard from '@components/mobile/SettingsCard'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { useDevice } from '@src/hooks/useDevice'
import { DialogArrayType } from '@src/data/type/dialogArrayType'
import { TelecomColumnsType } from '@src/data/type/TelecomDataGridType'

export const Route = createFileRoute('/(settings)/devicesList')({
  component: withSnackbar(devicesList),
  staticData: {
    breadcrumb: 'قطعات',
  },
})

function devicesList({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const ListDevices = useGetData<User[]>('api/Error/ListDevices', 'List-devices')
  const { accessCheck } = useAccessCheck()
  const { isMobile } = useDevice()

  const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined)
  const [openDialog, setOpenDialog] = useState<'add' | 'delete' | 'edit' | null>(null)

  const KIOSKS_ARRAY: DialogArrayType[] = [
    {
      label: 'کد قطعه',
      value: 'code',
      kind: 'textField',
      size: isMobile ? 12 : 2.9,
      component: TextFieldComp,
      validators: { ...REQUIRED_VALIDATOR }
    },
    {
      label: 'نام قطعه',
      value: 'name',
      kind: 'textField',
      size: isMobile ? 12 : 8.9,
      component: TextFieldComp,
      validators: { ...REQUIRED_VALIDATOR },
    },

    {
      label: 'توضیحات',
      value: 'description',
      kind: 'textField',
      maxRows: 2,
      multiline: true,
      size: 12,
      component: TextFieldComp,
    },
  ]

  const KIOSKS_COLUMNS: TelecomColumnsType[] = [
    {
      field: 'code',
      headerName: 'کد قطعه',
      width: sizeConverter(120, 'width')
    },
    {
      field: 'name',
      headerName: 'نام قطعه',
      width: sizeConverter(120, 'width')
    },
    {
      field: 'description',
      headerName: 'توضیحات ',
      width: sizeConverter(250, 'width')
    },
  ]

  const canWrite = accessCheck({
    accessInfoId: 104,
    KindAccessInfo: 'writeAccess',
  })

  return (
    <Grid
      container
      size={12}
      sx={{
        // ۱. اگر موبایل بود، ارتفاع کل صفحه را قفل کن تا فرزند اجازه اسکرول پیدا کند
        height: isMobile ? '100dvh' : 'auto',
        overflow: isMobile ? 'hidden' : 'visible',
      }}
    >
      {ListDevices?.isLoading ? (
        <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}>
          <CustomCircularProgress thickness={2} size={60} />
        </Grid>
      ) : isMobile ? (
        // === نمای موبایل ===
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
          {ListDevices?.data?.value?.map((item: Record<string, any>) => (
            <Grid size={12} key={item.id}>
              <SettingsCard
                name={item.name}
                code={item.code}
                description={item.description}
                onEdit={() => {
                  setSelectedValue(item.id)
                  setOpenDialog('edit')
                }}
                onDelete={() => {
                  setSelectedValue(item.id)
                  setOpenDialog('delete')
                }}
                hasAccess={canWrite}
              />
            </Grid>
          ))}

          {/* دکمه شناور افزودن در موبایل */}
          {canWrite && (
            <Fab
              color="primary"
              sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }}
              onClick={() => {
                setSelectedValue(undefined)
                setOpenDialog('add')
              }}
            >
              <AddIcon />
            </Fab>
          )}
        </Grid>
      ) : (
        // === نمای دسکتاپ ===
        <TelecomDataGrid
          data={ListDevices?.data?.value}
          loading={ListDevices?.isLoading}
          CustomToolBar={() => {
            return canWrite && (
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
      )
      }
      {
        (openDialog === 'add' || openDialog === 'edit') && (
          <GeneralDialog
            open={openDialog}
            title={'قطعه'}
            close={() => setOpenDialog(null)}
            array={KIOSKS_ARRAY}
            editEndpoint={'api/Error/UpdateDevice'}
            createEndpoint={'api/Error/AddDevice'}
            staticServerData={openDialog === 'edit' ? { id: selectedValue } : {}}
            defaultValue={{ ...ListDevices?.data?.value?.find((i) => i?.id === selectedValue) }}
            wrapperFunc={() => ListDevices.refetch()}
            snackbarOpen={snackbarOpen}
          />
        )
      }

      {
        openDialog === 'delete' && (
          <GeneralDeleteDialog
            dialogTitle={'قطعه'}
            deleteID={selectedValue}
            deleteDescription={`آیا از حذف  ${ListDevices?.data?.value?.find(item => item?.id === selectedValue)?.name} اطمینان دارید؟`}
            snackbarOpen={snackbarOpen}
            deleteEndPoint={'api/Error/DeleteDevice/'}
            isDialogOpen={openDialog}
            customFunAfterSuccess={() => {
              ListDevices?.refetch()
              setSelectedValue(undefined)
            }}
            dialogCloseFun={() => setOpenDialog(null)}
          />
        )
      }
    </Grid >
  );
}
