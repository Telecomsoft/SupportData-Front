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
import { Box, Fab, Grid2, Typography, useTheme } from '@mui/material'
import SuspendDialog from '@components/general/SuspendDialog'
import ArticleDataGridToolbar from '@components/section/main/ArticleDataGridToolbar'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import { useForm } from 'react-hook-form'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import FreeSoloAutoComplete from '@components/general/hookFromInputs/FreeSoloAutoComplete'
import InfoIcon from '@mui/icons-material/Info'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import { useAccessCheck } from '@src/utility/accessCheck'
import UploadFile from '@components/general/uploadFile'
import { CustomErrorListDialog } from '@components/section/CustomErrorListDialog'
import SimpleInfoDialog from '@components/general/SimpleInfoDialog'
import getEndpoint from '@utility/getEndPoint.ts'
import SvgComponent from '@src/utility/SvgComponent'
import downloadIcon from 'public/icons/Download.svg'
import { LightTooltip } from '@components/general/StyledTooltip'
import MobileErrorCard from '@components/mobile/MobileErrorCard'
import { useDevice } from '@src/hooks/useDevice'
import CustomCircularProgress from '@components/general/CustomCircularProgress'

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { TextField, InputAdornment } from '@mui/material'

export const Route = createFileRoute('/(dashboard)/errorsList')({
  component: withSnackbar(kioskErrors),
  staticData: {
    breadcrumb: 'لیست خطاها',
  },
})

function kioskErrors({ snackbarOpen }: { snackbarOpen: snackbarOpenType }) {
  const { accessCheck } = useAccessCheck()
  const { isMobile } = useDevice()

  const theme = useTheme()
  const listErrors = useGetData<any>('api/Error/ListErrors', 'list-errors')
  const listErrorGroups = useGetData<any>('api/Base/ErrorGroups', 'list-error-groups')
  const ListBanks = useGetData<any>('api/Error/ListBanks', 'List-banks')
  const listDevices = useGetData<any>('api/Error/listDevices', 'List-devices')
  const ListDeviceModels = useGetData<any>(
    'api/Error/ListDeviceModels',
    'list-device-models',
  )
  const ListDevices = useGetData<any>('api/Error/ListDevices', 'List-devices')
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    undefined,
  )
  const [selectedMessage, setSelectedMessage] = useState('');
  const [openDialog, setOpenDialog] = useState<
    'add' | 'delete' | 'edit' | null
  >(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [solutionText, setSolutionText] = useState<string | null>(null)


  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredErrors = listErrors?.data?.value?.filter((item: any) => {
    if (!searchQuery) return true;
    return String(item?.code).includes(searchQuery);
  });
  const handleOpenSolution = (event: any, text: string) => {
    setAnchorEl(event.currentTarget)
    setSolutionText(text)
  }

  const handleCloseSolution = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const handleShowInfo = (msg: string) => {
    setSelectedMessage(msg);
    setOpenDialog('info');
  };
  const KIOSKS_ARRAY: DialogArrayType[] = [
    {
      label: 'کد خطا',
      value: 'code',
      kind: 'textField',
      size: 5.9,
      component: TextFieldComp,
    },
    {
      label: 'عنوان خطا',
      value: 'title',
      kind: 'textField',
      size: 5.9,
      component: TextFieldComp,
      validators: { ...REQUIRED_VALIDATOR },
    },

    {
      label: 'گروه',
      value: 'groupID',
      kind: 'combo',
      size: isMobile ? 12 : 5.9,
      component: AutoCompleteComp,
      validators: { ...REQUIRED_VALIDATOR },
    },
    {
      label: 'قطعه',
      value: 'deviceID',
      kind: 'combo',
      size: isMobile ? 12 : 5.9,
      component: AutoCompleteComp,
    },
    {
      component: CustomErrorListDialog,
    },
    {
      label: 'بانک های مرتبط',
      value: 'bankIDs',
      autocompleteType: 'multiple',
      type: 'multiple',
      kind: 'combo',
      size: isMobile ? 12 : 5.9,
      component: AutoCompleteComp,
    },
    {
      label: 'راه حل',
      value: 'solution',
      kind: 'textField',
      size: 12,
      component: TextFieldComp,
      multiline: true,
      maxRows: 12,
      validators: { ...REQUIRED_VALIDATOR },
    },
    {
      label: 'فایل های ضمیمه',
      value: 'attachedDocuments',
      uploadType: 'multiple',
      kind: 'uploadFile',
      size: 12,
      component: UploadFile,
    },
  ]
  const KIOSKS_ARRAY_SERVER: DialogArrayType[] = [
    {
      value: 'code',
      kind: 'textField'
    },
    {
      value: 'title',
      kind: 'textField',
    },
    {
      value: 'groupID',
      kind: 'combo',
    },
    {
      value: 'deviceID',
      kind: 'combo',
    },
    {
      value: 'deviceModelID',
      kind: 'combo',
    },
    {
      kind: 'combo',
      value: 'bankIDs',
      type: 'multiple',
    },
    {
      value: 'solution',
      kind: 'textField',
    },
    {
      value: 'attachedDocuments',
      kind: 'uploadFile',
    },
  ]
  const downloadHandler = (file) => {
    console.log('file', file)
    if (!!file) {
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.href = `${getEndpoint()}${file}`
      link.click()
    }
  }

  const KIOSKS_COLUMNS: TelecomColumnsType[] = [
    {
      field: 'code',
      headerName: 'کد خطا',
      width: sizeConverter(100, 'width'),
    },
    {
      field: 'title',
      headerName: 'عنوان خطا',
      width: sizeConverter(100, 'width'),
    },
    {
      field: 'deviceName',
      headerName: 'قطعه ',
      width: sizeConverter(100, 'width'),
    },

    {
      field: 'banks',
      headerName: 'بانک های مرتبط',
      width: sizeConverter(200),
    },
    {
      field: 'attachedDocuments',
      headerName: 'فایل',
      width: sizeConverter(200),
      align: 'center',
      renderCell: (params) => {
        return <Grid container justifyContent={'center'} sx={{ ml: sizeConverter(2, 'spaceX') }}>

          {params?.value?.map(i => <Grid size={2} onClick={() => downloadHandler(i)} >
            <SvgComponent
              icon={downloadIcon}
              width={sizeConverter(16)}
              height={sizeConverter(16)}
              color={theme.palette.black[0]}
            />
          </Grid>)
          }
        </Grid >
      },
    },
    {
      field: 'solution',
      headerName: 'دستورالعمل',
      width: sizeConverter(120, 'width'),
      align: 'center',
      renderCell: (params) => (
        <IconButton onClick={() => handleShowInfo(params?.value)}>
          <InfoIcon color="primary" />
        </IconButton>
      ),
    },
  ]

  const hasWriteAccess = accessCheck({
    accessInfoId: 103,
    KindAccessInfo: 'writeAccess',
  })




  return (
    <Grid container size={12}>
      {listErrors?.isLoading ?
        <Grid sx={{ m: 'auto', mt: '50%' }}>
          <CustomCircularProgress thickness={2} size={60} />
        </Grid>
        : isMobile ? (
          <Box
            sx={{
              height: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              pb: 8,
            }}
          >
            <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {isSearchOpen ? (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="جستجوی کد خطا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <IconButton onClick={() => setIsSearchOpen(true)} color="primary" sx={{ bgcolor: theme.palette.grey[200] }}>
                  <SearchIcon />
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.grey[200],
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.primary.main,
                  borderRadius: '4px',
                },
              }}
            >
              <Grid2 container spacing={2}>
                {filteredErrors?.map((item) => (
                  <Grid2 size={12} key={item.id}>
                    <MobileErrorCard
                      hasAccess={hasWriteAccess}
                      title={item?.title}
                      device={item?.deviceName}
                      errorCode={item?.code}
                      subtitle={item?.banks}
                      onInfo={() => handleShowInfo(item?.solution)}
                      onEdit={() => {
                        setSelectedValue(item?.id);
                        setOpenDialog('edit');
                      }}
                      onDelete={() => {
                        setSelectedValue(item?.id);
                        setOpenDialog('delete');
                      }}
                      onDownloadClick={downloadHandler}
                      files={
                        item?.attachedDocuments?.map((file: any, index: number) => ({
                          id: index,
                          name: `فایل ضمیمه ${index + 1}`,
                          rawFile: file // خود فایل را اینجا نگه می‌داریم تا به هندلر پاس بدهیم
                        })) || []
                      }
                    />
                  </Grid2>
                ))}
              </Grid2>
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
          </Box>
        ) : (
          <TelecomDataGrid
            data={listErrors?.data?.value}
            loading={listErrors?.isLoading}
            doubleClickFunc={(data) => handleShowInfo(data?.solution)}
            defaultSortColumns={{ code: 'asc' }}
            CustomToolBar={() => {
              return (
                accessCheck({
                  accessInfoId: 105,
                  KindAccessInfo: 'writeAccess',
                }) && (
                  <Grid
                    container
                    size={'auto'}
                    spacing={sizeConverter(4, 'spaceX')}
                  >
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
              )
            }}
            setRows={(data) => data && setSelectedValue(data?.[0])}
            multiSelect={false}
            disableRowSelection={false}
            columns={KIOSKS_COLUMNS}
          />
        )}

      {
        (openDialog === 'add' || openDialog === 'edit') && (
          <GeneralDialog
            key={`${openDialog}-${selectedValue}-${ListBanks?.dataUpdatedAt}`}
            open={openDialog}
            title={'خطا'}
            close={() => setOpenDialog(null)}
            array={KIOSKS_ARRAY}
            serverArray={KIOSKS_ARRAY_SERVER}
            editEndpoint={'api/Error/UpdateError'}
            createEndpoint={'api/Error/AddError'}
            autoCompleteOption={{
              deviceID: ListDevices?.data?.value || [],
              bankIDs: ListBanks?.data?.value || [],
              groupID: Object.entries(listErrorGroups?.data?.value)?.map(([id, name]) => ({ id: Number(id), name })) || [],
              deviceModelID: ListDeviceModels?.data?.value || []
            }}
            defaultValue={(() => {
              const selectedItem = listErrors?.data?.value?.find(
                (i) => i?.id === selectedValue
              );

              if (!selectedItem) return undefined;

              return {
                ...selectedItem,
              };
            })()}
            wrapperFunc={() => listErrors.refetch()}
            snackbarOpen={snackbarOpen}
            conditionValue={{ deviceModels: ListDeviceModels?.data?.value || [] }}
            apiValueGetter={(data: any) => {
              const finalData = {
                ...data,
                ...(openDialog === 'edit' ? { id: selectedValue } : {}),
                bankIDs: data?.bankIDs?.map((x: any) => x?.id),
                code: +data?.code,
                deviceID: data?.deviceID?.id ? +data.deviceID.id : undefined,
                deviceModelID: data?.deviceModelID?.id ? +data.deviceModelID.id : undefined,
                groupID: data?.groupID?.id ? +data.groupID.id : undefined,
              }
              return finalData
            }}
            sendFinalData={true}
          />
        )
      }
      {
        openDialog === 'delete' && (
          <GeneralDeleteDialog
            dialogTitle={'خطا'}
            deleteID={selectedValue}
            deleteDescription={`آیا از حذف  ${listErrors?.data?.value?.find((item) => item?.id === selectedValue)?.title} اطمینان دارید؟`}
            snackbarOpen={snackbarOpen}
            deleteEndPoint={'api/Error/DeleteError/'}
            isDialogOpen={openDialog}
            customFunAfterSuccess={() => {
              listErrors?.refetch()
              // queryClient?.refetchQueries({ queryKey: ['get-list-view'] })
              // queryClient?.refetchQueries({ queryKey: ['kiosks-list'] })
              setSelectedValue(null)
            }}
            dialogCloseFun={() => setOpenDialog(null)}
          />
        )
      }
      {
        openDialog === 'info' &&
        <SimpleInfoDialog
          open={!!openDialog}
          onClose={() => setOpenDialog(null)}
          title="راه حل"
          customContent={selectedMessage}
        />
      }
    </Grid>
  )
}


