/* eslint-disable @typescript-eslint/no-explicit-any */
import Grid from '@mui/material/Grid2'
import { Box, Fab } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetData } from '@hooks/useGetData'
import { useDevice } from '@hooks/useDevice'
import { useAccessCheck } from '@utility/accessCheck'
import { sizeConverter } from '@utility/sizeConverter'
import { buildPayload } from '@utility/buildPayload'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import TelecomDataGrid from '@components/general/telecomDataGrid'
import { TelecomColumnsType } from '@components/general/telecomDataGrid/staticData/TelecomDataGridType'
import DataGridIconProvider from '@components/general/telecomDataGrid/components/DataGridIconProvider'
import GeneralDialog from '@components/general/GeneralDialog'
import GeneralDeleteDialog from '@components/general/GeneralDeleteDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import SettingsCard from '@components/mobile/SettingsCard'

export type CrudPageProps = {
    /** word used in the dialog titles, e.g. 'استان' */
    title: string
    queryKey: string
    listEndpoint: string
    createEndpoint: string
    /** leave empty for lists that can only be added to and deleted from (e.g. holidays) */
    updateEndpoint?: string
    /** the id is appended: 'api/Location/DeleteProvince/' */
    deleteEndpoint: string
    /** permission ID of the module (101-115): write access shows the buttons */
    accessID: number
    columns: TelecomColumnsType[]
    /** the form fields, as in the other pages (see dialogArrays/*.ts) */
    dialogArray: DialogArrayType[]
    /** options of the combo fields: { fieldName: [{ id, name }] } */
    autoCompleteOption?: Record<string, any[]>
    addDefaultValue?: Record<string, unknown>
    /** the mobile card */
    cardTitle: (row: any) => string
    cardDescription?: (row: any) => string | undefined
    /** the sentence in the delete dialog */
    deleteDescription: (row: any) => string
    snackbarOpen: snackbarOpenType
    /** an extra list the page needs to wait for (e.g. the provinces for the cities page) */
    isLoadingExtra?: boolean
    dialogWidth?: number
}

type Mode = 'add' | 'edit' | 'delete' | null

/**
 * One list page = the same 5 pieces as banksList.tsx: the list, the grid (desktop) or cards (mobile),
 * and the add / edit / delete dialogs. Pages that only differ in their fields use this component.
 */
const GeneralCrudPage = ({
    title, queryKey, listEndpoint, createEndpoint, updateEndpoint, deleteEndpoint, accessID, columns, dialogArray,
    autoCompleteOption, addDefaultValue, cardTitle, cardDescription, deleteDescription, snackbarOpen, isLoadingExtra,dialogWidth,
}: CrudPageProps) => {
    const list = useGetData<any[]>(listEndpoint, queryKey)
    const { accessCheck } = useAccessCheck()
    const { isMobile } = useDevice()
    const [selectedID, setSelectedID] = useState<number | undefined>(undefined)
    const [openDialog, setOpenDialog] = useState<Mode>(null)

    const hasWriteAccess = accessCheck({ accessInfoId: accessID, KindAccessInfo: 'writeAccess' })
    const canEdit = !!updateEndpoint
    const rows = list.data?.value ?? []
    const selectedRow = rows.find((r: any) => r?.id === selectedID)

    const openFor = (id: number, mode: Mode) => {
        setSelectedID(id)
        setOpenDialog(mode)
    }

    return (
        <Grid
            container
            size={12}
            sx={{ position: 'relative', height: isMobile ? '100dvh' : 'auto', overflow: isMobile ? 'hidden' : 'visible' }}
        >
            {list.isLoading || isLoadingExtra ? (
                <Grid sx={{ m: 'auto', mt: isMobile ? '50%' : '20%' }}>
                    <CustomCircularProgress thickness={2} size={60} />
                </Grid>
            ) : isMobile ? (
                // ---------------- mobile: cards ----------------
                <Box
                    sx={{
                        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto',
                        overflowX: 'hidden', pb: 26, gap: 2, WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {rows.map((row: any) => (
                        <Grid size={12} key={row.id}>
                            <SettingsCard
                                name={cardTitle(row)}
                                description={cardDescription?.(row)}
                                hasAccess={hasWriteAccess}
                                onEdit={canEdit ? () => openFor(row.id, 'edit') : undefined}
                                onDelete={() => openFor(row.id, 'delete')}
                            />
                        </Grid>
                    ))}
                    {hasWriteAccess && (
                        <Fab
                            color="primary"
                            sx={{ position: 'fixed', bottom: 70, right: 16, zIndex: 10 }}
                            onClick={() => { setSelectedID(undefined); setOpenDialog('add') }}
                        >
                            <AddIcon />
                        </Fab>
                    )}
                </Box>
            ) : (
                // ---------------- desktop: grid ----------------
                <TelecomDataGrid
                    data={rows}
                    loading={list.isLoading}
                    doubleClickFunc={() => hasWriteAccess && canEdit && setOpenDialog('edit')}
                    CustomToolBar={() =>
                        hasWriteAccess && (
                            <Grid container size={'auto'} spacing={sizeConverter(4, 'spaceX')}>
                                <DataGridIconProvider toolTipText={'اضافه'} Icon={AddIcon} disable={false} clickFunc={() => setOpenDialog('add')} />
                                {canEdit && (
                                    <DataGridIconProvider toolTipText={'ویرایش'} Icon={EditIcon} disable={!selectedID} clickFunc={() => setOpenDialog('edit')} />
                                )}
                                <DataGridIconProvider toolTipText={'حذف'} Icon={DeleteIcon} disable={!selectedID} clickFunc={() => setOpenDialog('delete')} />
                            </Grid>
                        )
                    }
                    setRows={(data: any) => data && setSelectedID(data?.[0])}
                    multiSelect={false}
                    disableRowSelection={false}
                    columns={columns}
                />
            )}

            {(openDialog === 'add' || openDialog === 'edit') && (
                <GeneralDialog
                    open={openDialog}
                    title={title}
                    width={dialogWidth ? sizeConverter(dialogWidth, 'width') : undefined}
                    close={() => setOpenDialog(null)}
                    array={dialogArray}
                    createEndpoint={createEndpoint}
                    editEndpoint={updateEndpoint}
                    autoCompleteOption={autoCompleteOption}
                    addDefaultValue={addDefaultValue}
                    defaultValue={openDialog === 'edit' ? { ...selectedRow } : undefined}
                    // our own body: checkboxes, numbers and "start from the whole row" (see buildPayload)
                    sendFinalData
                    apiValueGetter={((data: any) =>
                        buildPayload(dialogArray, data, openDialog === 'edit' ? { ...selectedRow } : { ...addDefaultValue })) as any}
                    wrapperFunc={() => list.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {openDialog === 'delete' && (
                <GeneralDeleteDialog
                    dialogTitle={title}
                    deleteID={selectedID}
                    deleteDescription={selectedRow ? deleteDescription(selectedRow) : ''}
                    snackbarOpen={snackbarOpen}
                    deleteEndPoint={deleteEndpoint}
                    isDialogOpen={openDialog}
                    customFunAfterSuccess={() => {
                        list.refetch()
                        setSelectedID(undefined)
                    }}
                    dialogCloseFun={() => setOpenDialog(null)}
                />
            )}
        </Grid>
    )
}

export default GeneralCrudPage