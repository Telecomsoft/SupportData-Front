//@ts-nocheck
import Grid from '@mui/material/Grid2'
import { createFileRoute } from '@tanstack/react-router'
import { useGetData } from '@hooks/useGetData.ts'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import { sizeConverter } from '@utility/sizeConverter.ts'
import { useState } from 'react'
import GeneralDialog from '@components/general/GeneralDialog.tsx'
import { snackbarOpenType } from '@type/snackbarOpen.ts'
import { withSnackbar } from '@components/hoc/withSnackbar.tsx'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider.tsx'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Fab, Grid2, useTheme, Zoom, InputAdornment, IconButton } from '@mui/material'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import InfoIcon from '@mui/icons-material/Info'
import { useAccessCheck } from '@src/utility/accessCheck'
import UploadFile from '@components/general/uploadFile'
import { CustomErrorListDialog } from '@components/section/CustomErrorListDialog'
import SimpleInfoDialog from '@components/general/SimpleInfoDialog'
import getEndpoint from '@utility/getEndPoint.ts'
import SvgComponent from '@src/utility/SvgComponent'
import downloadIcon from 'public/icons/Download.svg'
import MobileErrorCard from '@components/mobile/MobileErrorCard'
import { useDevice } from '@src/hooks/useDevice'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import StyledTextField from '@components/general/input/StyledTextField'
import FloatingSearch from '@components/mobile/FloatingSearch'

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

  // Queries
  const listErrors = useGetData<any>('api/Error/ListErrors', 'list-errors')
  const listErrorGroups = useGetData<any>('api/Base/ErrorGroups', 'list-error-groups')
  const ListBanks = useGetData<any>('api/Error/ListBanks', 'List-banks')
  const listDevices = useGetData<any>('api/Error/listDevices', 'List-devices')
  const ListDeviceModels = useGetData<any>('api/Error/ListDeviceModels', 'list-device-models')
  const ListDevices = useGetData<any>('api/Error/ListDevices', 'List-devices')

  // States
  const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined)
  const [selectedMessage, setSelectedMessage] = useState('')
  const [openDialog, setOpenDialog] = useState<'add' | 'delete' | 'edit' | 'info' | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredErrors = listErrors?.data?.value?.filter((item: any) => {
    if (!searchQuery) return true
    return String(item?.code).includes(searchQuery) || String(item?.title).includes(searchQuery)
  })

  const handleShowInfo = (msg: string) => {
    setSelectedMessage(msg)
    setOpenDialog('info')
  }

  const downloadHandler = (file) => {
    if (!!file) {
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.href = `${getEndpoint()}${file}`
      link.click()
    }
  }

  const hasWriteAccess = accessCheck({
    accessInfoId: 103,
    KindAccessInfo: 'writeAccess',
  })

  const KIOSKS_ARRAY = [
    { label: 'کد خطا', value: 'code', kind: 'textField', size: 5.9, component: TextFieldComp },
    { label: 'عنوان خطا', value: 'title', kind: 'textField', size: 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'گروه', value: 'groupID', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'قطعه', value: 'deviceID', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp },
    { component: CustomErrorListDialog },
    { label: 'بانک های مرتبط', value: 'bankIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp },
    { label: 'راه حل', value: 'solution', kind: 'textField', size: 12, component: TextFieldComp, multiline: true, maxRows: 12, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'فایل های ضمیمه', value: 'attachedDocuments', uploadType: 'multiple', kind: 'uploadFile', size: 12, component: UploadFile },
  ]

  const KIOSKS_COLUMNS = [
    { field: 'code', headerName: 'کد خطا', width: sizeConverter(100, 'width') },
    { field: 'title', headerName: 'عنوان خطا', width: sizeConverter(100, 'width') },
    { field: 'deviceName', headerName: 'قطعه ', width: sizeConverter(100, 'width') },
    { field: 'banks', headerName: 'بانک های مرتبط', width: sizeConverter(200) },
    {
      field: 'attachedDocuments',
      headerName: 'فایل',
      width: sizeConverter(200),
      align: 'center',
      renderCell: (params) => (
        <Grid container justifyContent={'center'} sx={{ ml: sizeConverter(2, 'spaceX') }}>
          {params?.value?.map((i, index) => (
            <Grid key={index} size={2} onClick={() => downloadHandler(i)}>
              <SvgComponent icon={downloadIcon} width={sizeConverter(16)} height={sizeConverter(16)} color={theme.palette.black[0]} />
            </Grid>
          ))}
        </Grid>
      ),
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

  return (
    <Grid container size={12}>
      {listErrors?.isLoading ? (
        <Grid sx={{ m: 'auto', mt: '50%' }}>
          <CustomCircularProgress thickness={2} size={60} />
        </Grid>
      ) : isMobile ? (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* محتوای لیست با Padding Bottom برای دکمه‌های شناور */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pt: 2, pb: 20 }}>
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
                    onEdit={() => { setSelectedValue(item?.id); setOpenDialog('edit'); }}
                    onDelete={() => { setSelectedValue(item?.id); setOpenDialog('delete'); }}
                    onDownloadClick={downloadHandler}
                    files={item?.attachedDocuments?.map((file, index) => ({ id: index, name: `فایل ${index + 1}`, rawFile: file })) || []}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Box>

          {/* بخش دکمه‌های شناور و سرچ */}


          <Box
            sx={{
              position: "fixed",
              bottom: 85,
              right: 16,
              left: 16,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              zIndex: 100,
            }}
          >
            <FloatingSearch
              title="جستجوی کد یا عنوان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              isOpen={isSearchOpen}
              setIsOpen={setIsSearchOpen}
              position={{
                bottom: 90,
                right: 86,
              }}
            />

            <Fab
              color="primary"
              onClick={() => setOpenDialog("add")}
              sx={{ boxShadow: 4 }}
            >
              <AddIcon />
            </Fab>
          </Box>

        </Box>
      ) : (
        <TelecomDataGrid
          data={listErrors?.data?.value}
          loading={listErrors?.isLoading}
          doubleClickFunc={(data) => handleShowInfo(data?.solution)}
          columns={KIOSKS_COLUMNS}
          setRows={(data) => data && setSelectedValue(data?.[0])}
          CustomToolBar={() => (
            accessCheck({ accessInfoId: 105, KindAccessInfo: 'writeAccess' }) && (
              <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                <DataGridIconProvider toolTipText={'اضافه'} Icon={AddIcon} clickFunc={() => setOpenDialog('add')} />
                <DataGridIconProvider toolTipText={'ویرایش'} Icon={EditIcon} disable={!selectedValue} clickFunc={() => setOpenDialog('edit')} />
                <DataGridIconProvider toolTipText={'حذف'} Icon={DeleteIcon} disable={!selectedValue} clickFunc={() => setOpenDialog('delete')} />
              </Grid>
            )
          )}
        />
      )
      }

      {/* Dialogs */}
      {
        (openDialog === 'add' || openDialog === 'edit') && (
          <GeneralDialog
            open={openDialog}
            title={'خطا'}
            close={() => setOpenDialog(null)}
            array={KIOSKS_ARRAY}
            editEndpoint={'api/Error/UpdateError'}
            createEndpoint={'api/Error/AddError'}
            defaultValue={listErrors?.data?.value?.find((i) => i?.id === selectedValue)}
            wrapperFunc={() => listErrors.refetch()}
            snackbarOpen={snackbarOpen}
          />
        )
      }

      {
        openDialog === 'info' && (
          <SimpleInfoDialog open={!!openDialog} onClose={() => setOpenDialog(null)} title="راه حل" customContent={selectedMessage} />
        )
      }
    </Grid >
  )
}
