import { useState } from 'react'
import { Alert, Box, Button, Chip, FormControlLabel, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useGetData } from '@hooks/useGetData'
import { buildPayload } from '@utility/buildPayload'
import { sizeConverter } from '@utility/sizeConverter'
import { convertToShamsi } from '@utility/dateConverter'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import GeneralDialog from '@components/general/GeneralDialog'
import GeneralConfirmDialog from '@components/general/GeneralConfirmDialog'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import AutoCompleteComp from '@components/general/hookFromInputs/AutoComplete'
import { REQUIRED_VALIDATOR } from '@src/data/validators/validators'

type Props = { kioskID: number; canWrite: boolean; snackbarOpen: snackbarOpenType }

/**
 * The parts inside the kiosk, and the ones taken out (history). The daily swap is done on the TASK (it also moves the
 * warehouse stock); the two buttons here are for corrections only and do NOT touch the warehouse.
 */
const KioskPartsTab = ({ kioskID, canWrite, snackbarOpen }: Props) => {
    const parts = useGetData<any[]>(`api/Kiosk/ListKioskParts/${kioskID}?includeRemoved=true`, 'kiosk-parts', { ids: [String(kioskID)] })
    const models = useGetData<{ id: number; name: string }[]>('api/Device/ListDeviceModels', 'kiosk-parts-device-models')
    const [showRemoved, setShowRemoved] = useState(false)
    const [dialog, setDialog] = useState<'add' | 'remove' | null>(null)
    const [selected, setSelected] = useState<any>(null)

    const rows = (parts.data?.value ?? []).filter((p) => showRemoved || !p.removedAt)

    const addForm: DialogArrayType[] = [
        { label: 'مدل قطعه', value: 'deviceModelID', kind: 'combo', type: 'choice', size: 12, component: AutoCompleteComp, validators: { ...REQUIRED_VALIDATOR } },
        { label: 'سریال (برای مدل‌های سریال‌دار الزامی است)', value: 'serial', kind: 'textField', size: 12, component: TextFieldComp, ltr: true },
        { label: 'توضیحات', value: 'description', kind: 'textField', size: 12, component: TextFieldComp },
    ]

    if (parts.isLoading) return <CustomCircularProgress thickness={2} size={40} />

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 1 }}>
                تعویض قطعه در جریان کار را از صفحه‌ی تسک انجام بده (حرکت انبار هم ثبت می‌شود). افزودن و خارج‌کردن در این‌جا فقط برای اصلاح اطلاعات است و انبار را تغییر نمی‌دهد.
            </Alert>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <FormControlLabel control={<Switch checked={showRemoved} onChange={(e) => setShowRemoved(e.target.checked)} />} label="نمایش قطعات خارج‌شده" />
                {canWrite && <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setDialog('add')}>افزودن قطعه (اصلاح)</Button>}
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>قطعه</TableCell><TableCell>دستگاه</TableCell><TableCell>سریال</TableCell>
                            <TableCell>تاریخ نصب</TableCell><TableCell>تاریخ خروج</TableCell><TableCell>وضعیت</TableCell>
                            {canWrite && <TableCell />}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((p) => (
                            <TableRow key={p.id} sx={{ opacity: p.removedAt ? 0.6 : 1 }}>
                                <TableCell>{p.deviceModelName}</TableCell>
                                <TableCell>{p.deviceName}</TableCell>
                                <TableCell dir="ltr">{p.serial ?? '-'}</TableCell>
                                <TableCell>{p.installedAt ? convertToShamsi(p.installedAt) : '-'}</TableCell>
                                <TableCell>{p.removedAt ? convertToShamsi(p.removedAt) : '-'}</TableCell>
                                <TableCell>{p.removedAt ? <Chip size="small" label="خارج شده" /> : <Chip size="small" color="success" label="نصب است" />}</TableCell>
                                {canWrite && (
                                    <TableCell>
                                        {!p.removedAt && <Button size="small" color="error" onClick={() => { setSelected(p); setDialog('remove') }}>خارج کردن</Button>}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {rows.length === 0 && <TableRow><TableCell colSpan={7} align="center">قطعه‌ای ثبت نشده است</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </Box>

            {dialog === 'add' && (
                <GeneralDialog
                    open="add"
                    title="قطعه‌ی کیوسک"
                    close={() => setDialog(null)}
                    array={addForm}
                    createEndpoint="api/Kiosk/AddKioskPart"
                    autoCompleteOption={{ deviceModelID: models.data?.value ?? [] }}
                    sendFinalData
                    apiValueGetter={((data: any) => buildPayload(addForm, data, { kioskID })) as any}
                    wrapperFunc={() => parts.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}

            {dialog === 'remove' && (
                <GeneralConfirmDialog
                    dialogWidth={sizeConverter(420, 'width')}
                    snackbarOpen={snackbarOpen}
                    dialogCloseFun={() => { setDialog(null); setSelected(null) }}
                    dialogTitle="خارج کردن قطعه"
                    isDialogOpen={'add'}
                    confirmMessage={`قطعه‌ی ${selected?.deviceModelName ?? ''} از کیوسک خارج شود؟ (سابقه‌اش می‌ماند)`}
                    snackBarSuccessMessage="قطعه خارج شد"
                    customFunAfterSuccess={() => parts.refetch()}
                    endPoint={`api/Kiosk/RemoveKioskPart/${selected?.id}`}
                    apiMethod="put"
                />
            )}
        </Box>
    )
}

export default KioskPartsTab