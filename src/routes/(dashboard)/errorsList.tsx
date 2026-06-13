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
import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog'
import { useMemo } from 'react';
// import { Tabs, Tab } from '@mui/material';
import { ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory'; // آیکون سخت‌افزار
import CodeIcon from '@mui/icons-material/Code';     // آیکون نرم‌افزار
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { ErrorFilterChips } from '@components/general/ErrorFilterChips'
import FileDialog from '@components/general/FileDialog'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

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
  const [activeTab, setActiveTab] = useState('total');
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false);


  const filteredErrors = listErrors?.data?.value?.filter((item: any) => {
    if (!searchQuery) return true
    return String(item?.code).includes(searchQuery) || String(item?.title).includes(searchQuery)
  })

  const handleShowInfo = (msg: string) => {
    setSelectedMessage(msg)
    setOpenDialog('info')
  }

  // const downloadHandler = (file) => {
  //   if (!!file) {
  //     const link = document.createElement('a')
  //     link.setAttribute('target', '_blank')
  //     link.href = `${getEndpoint()}${file}`
  //     link.click()
  //   }
  // }
  const downloadHandler = (file) => {
    if (!file) return;

    const link = document.createElement('a');
    link.href = `${getEndpoint()}${file}`;

    const extension = file.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    if (imageExtensions.includes(extension)) {
      // باز شدن تصویر در یک تب جدید برای نمایش
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer'); // برای امنیت بیشتر در تب جدید
    } else {
      // اجبار به دانلود برای تمام فایل‌های دیگر (PDF, Zip, etc.)
      link.setAttribute('download', '');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  const hasWriteAccess = accessCheck({
    accessInfoId: 103,
    KindAccessInfo: 'writeAccess',
  })

  const gridFilteredData = useMemo(() => {
    if (!listErrors?.data?.value) return [];

    return listErrors.data.value.filter((item) => {
      // ⚠️ توجه: فیلد groupID یا groupName را بر اساس دیتای بک‌اند خودتون جایگزین کنید
      if (activeTab === 'hardware') {
        return item?.groupID === 1; // شناسه گروه سخت‌افزاری
      } else if (activeTab === 'software') {
        return item?.groupID === 2; // شناسه گروه نرم‌افزاری
      }
      return true;
    });
  }, [listErrors?.data?.value, activeTab]);

  const finalMobileData = gridFilteredData?.filter((item: any) => {
    if (!searchQuery) return true
    return String(item?.code).includes(searchQuery) || String(item?.title).includes(searchQuery)
  })

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedValue(null); // پاک کردن مقدار انتخاب شده قبلی موقع تغییر تب
  };
  const handleChipClick = (tabValue) => {
    if (activeTab !== tabValue) {
      setActiveTab(tabValue);
    }
  };

  const KIOSKS_ARRAY = [
    { label: 'کد خطا', value: 'code', kind: 'textField', size: 5.9, component: TextFieldComp },
    { label: 'عنوان خطا', value: 'title', kind: 'textField', size: 5.9, component: TextFieldComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'گروه', value: 'groupID', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'قطعه', value: 'deviceID', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp },
    { component: CustomErrorListDialog },
    { label: 'بانک های مرتبط', value: 'bankIDs', autocompleteType: 'multiple', type: 'multiple', kind: 'combo', size: isMobile ? 12 : 5.9, component: AutoCompleteComp },
    { label: 'راه حل', value: 'solution', kind: 'textField', size: 12, component: TextFieldComp, multiline: true, maxRows: 7, validators: { ...REQUIRED_VALIDATOR } },
    { label: 'فایل های ضمیمه', value: 'attachedDocuments', uploadType: 'multiple', kind: 'uploadFile', size: 12, component: UploadFile },
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
  const KIOSKS_COLUMNS = [
    { field: 'code', headerName: 'کد خطا', width: sizeConverter(100, 'width') },
    { field: 'title', headerName: 'عنوان خطا', width: sizeConverter(100, 'width') },
    { field: 'deviceName', headerName: 'قطعه ', width: sizeConverter(100, 'width') },
    { field: 'deviceModelName', headerName: 'مدل قطعه ', width: sizeConverter(100, 'width') },
    { field: 'banks', headerName: 'بانک های مرتبط', width: sizeConverter(200) },
    {
      field: 'attachedDocuments',
      headerName: 'فایل',
      width: sizeConverter(200),
      align: 'center',
      renderCell: (params) =>
        //   <Grid container justifyContent={'center'} sx={{ ml: sizeConverter(2, 'spaceX') }}>
        //     {params?.value?.map((i, index) => (
        //       <Grid key={index} size={2} onClick={() => downloadHandler(i)}>
        //         <SvgComponent icon={downloadIcon} width={sizeConverter(16)} height={sizeConverter(16)} color={theme.palette.black[0]} />
        //       </Grid>
        //     ))}
        //   </Grid>
        // ,
        <DownloadForOfflineIcon sx={{ color: params?.row?.attachedDocuments?.length > 0 ? theme.palette.primary.main : theme.palette.black[7] }} onClick={params?.row?.attachedDocuments?.length > 0 ? () => setIsFilesDialogOpen(true) : null} />
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
        <Grid sx={{ m: 'auto', mt: isMobile ? '30%' : '15%' }}>
          <CustomCircularProgress thickness={2} size={60} />
        </Grid>
      ) : isMobile ? (
        <Box sx={{
          height: '100dvh',
          display: 'flex', flexDirection: 'column', position: 'relative', width: '100%'
        }}>

          {/* اضافه شدن کامپوننت چیپ ها به حالت موبایل */}
          <Box sx={{
            width: '99%',
            maxWidth: '90dvw',
            overflow: 'hidden',
            pb: 4
          }}>
            <ErrorFilterChips activeTab={activeTab} onTabChange={handleChipClick} />
          </Box>

          {/* محتوای لیست با Padding Bottom برای دکمه‌های شناور */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pt: 1, pb: 20 }}>
            <Grid2 container spacing={2}>
              {/* استفاده از دیتای نهایی فیلتر شده برای موبایل */}
              {finalMobileData?.map((item) => (
                <Grid2 size={12} key={item.id}>
                  <MobileErrorCard
                    hasAccess={hasWriteAccess}
                    title={item?.title}
                    device={item?.deviceName}
                    deviceModel={item?.deviceModelName}
                    errorCode={item?.code}
                    subtitle={item?.banks}
                    onInfo={() => handleShowInfo(item?.solution)}
                    onEdit={() => { setSelectedValue(item?.id); setOpenDialog('edit'); }}
                    onDelete={() => { setSelectedValue(item?.id); setOpenDialog('delete'); }}
                    onDownloadClick={downloadHandler}
                    files={item?.attachedDocuments?.map((file, index) => ({ id: index, name: file.split('/')?.[3], rawFile: file })) || []}
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
              setSearchQuery={setSearchQuery}
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
        <Grid container size={12} direction="column">

          {/* استفاده از کامپوننت در حالت دسکتاپ */}
          <Box sx={{ mb: 1 }}>
            <ErrorFilterChips activeTab={activeTab} onTabChange={handleChipClick} />
          </Box>

          <TelecomDataGrid
            data={gridFilteredData} // دیتای فیلتر شده به دیتاگرید پاس داده شده است
            height={sizeConverter(550, 'height')}
            loading={listErrors?.isLoading}
            doubleClickFunc={(data) => handleShowInfo(data?.solution)}
            columns={KIOSKS_COLUMNS}
            setRows={(data) => data && setSelectedValue(data?.[0])}
            defaultSortColumns={{ code: 'asc' }}
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
        </Grid>
      )
      }


      {/* Dialogs */}
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
        openDialog === 'info' && (
          <SimpleInfoDialog open={!!openDialog} onClose={() => setOpenDialog(null)} title="راه حل" customContent={selectedMessage} />
        )
      }
      <FileDialog
        open={isFilesDialogOpen}
        onClose={() => setIsFilesDialogOpen(false)}
        files={listErrors?.data?.value?.find((i) => i?.id === selectedValue)?.attachedDocuments?.map((file, index) => ({ id: index, name: file.split('/')?.[3], rawFile: file })) || []}

        onDownloadClick={downloadHandler}
      />
    </Grid >
  )
}
