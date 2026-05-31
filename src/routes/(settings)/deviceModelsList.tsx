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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'

import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog.tsx'
import { Grid2, Typography } from '@mui/material'
import SuspendDialog from '@components/general/SuspendDialog'
import ArticleDataGridToolbar from '@components/section/main/ArticleDataGridToolbar'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { useForm } from 'react-hook-form'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { useAccessCheck } from '@src/utility/accessCheck'

export const Route = createFileRoute('/(settings)/DeviceModelsList ')({
  component: withSnackbar(DeviceModelsList),
})

function DeviceModelsList({
  snackbarOpen,
}: {
  snackbarOpen: snackbarOpenType
}) {
  const { accessCheck } = useAccessCheck()

  const ListDeviceModels = useGetData<User[]>(
    'api/Error/ListDeviceModels',
    'list-device-models',
  )
  const ListDevices = useGetData<User[]>('api/Error/ListDevices', 'List-devices')
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    undefined,
  )
  const [openDialog, setOpenDialog] = useState<
    'add' | 'delete' | 'edit' | null
  >(null)

  const KIOSKS_ARRAY: DialogArrayType[] = [

    {
      label: 'نام مدل قطعه',
      value: 'name',
      kind: 'textField',
      size: 5.9,
      component: TextFieldComp,
      validators: { ...REQUIRED_VALIDATOR },
    },

    {
      label: 'نام قطعه',
      value: 'deviceID',
      kind: 'combo',
      size: 5.9,
      component: AutoCompleteComp,
      validators: { ...REQUIRED_VALIDATOR },
    },
    {
      label: 'توضیحات',
      value: 'description',
      kind: 'textField',
      size: 12,
      component: TextFieldComp,
    },
  ]
  const KIOSKS_COLUMNS: TelecomColumnsType[] = [
    {
      field: 'name',
      headerName: ' نام مدل قطعه ',
      width: sizeConverter(120, 'width'),
    },
    {
      field: 'deviceID',
      headerName: ' نام  قطعه ',
      width: sizeConverter(120, 'width'),
      align: 'center',
      renderCell: (param) => <Typography variant="caption">{ListDevices?.data?.value?.find(i => i.id === param?.value)?.name}</Typography>
    },
    {
      field: 'description',
      headerName: 'توضیحات ',
      width: sizeConverter(250, 'width'),
    }
  ]

  return (
    <Grid container size={12}>
      <TelecomDataGrid
        data={ListDeviceModels?.data?.value}
        loading={ListDeviceModels?.isLoading}
        CustomToolBar={() => {
          return (
            accessCheck({
              accessInfoId: 104,
              KindAccessInfo: 'writeAccess',
            }) && <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
              <DataGridIconProvider
                toolTipText={'اضافه'}
                Icon={AddIcon}
                disable={false}
                clickFunc={() => setOpenDialog('add')}
              />
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

      {(openDialog === 'add' || openDialog === 'edit') && (
        <GeneralDialog
          open={openDialog}
          // width={sizeConverter(700,'width')}
          title={'قطعه'}
          close={() => setOpenDialog(null)}
          array={KIOSKS_ARRAY}
          editEndpoint={'api/Error/UpdateDeviceModel'}
          createEndpoint={'api/Error/AddDeviceModel'}
          staticServerData={openDialog === 'edit' ? { id: selectedValue } : {}}
          defaultValue={{
            ...ListDeviceModels?.data?.value?.find((i) => i?.id === selectedValue),
          }}
          wrapperFunc={() => ListDeviceModels.refetch()}
          snackbarOpen={snackbarOpen}
          // apiValueGetter={(data: any) => {
          //   return ({ ...data, deviceIDs: data?.deviceIDs?.map(x => x.id), bankIDs: data?.bankIDs?.map(x => x.id), keyWords: ['اینترنت'], id: selectedValue || 0 })
          // }}
          // sendFinalData={true}
          autoCompleteOption={{
            deviceID: ListDevices?.data?.value
          }}
        />
      )}
      {openDialog === 'delete' && (
        <GeneralDeleteDialog
          dialogTitle={'قطعه'}
          deleteID={selectedValue}
          deleteDescription={`آیا از حذف  ${ListDeviceModels?.data?.value?.find((item) => item?.id === selectedValue)?.name} اطمینان دارید؟`}
          snackbarOpen={snackbarOpen}
          deleteEndPoint={'api/Error/DeleteDeviceModel/'}
          isDialogOpen={openDialog}
          customFunAfterSuccess={() => {
            ListDeviceModels?.refetch()
            // queryClient?.refetchQueries({ queryKey: ['kiosks-list'] })
            setSelectedValue(null)
          }}
          dialogCloseFun={() => setOpenDialog(null)}
        />
      )}
    </Grid>
  )
}
