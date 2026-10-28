import { useState } from 'react'
import { Alert, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import { useGetData } from '@hooks/useGetData'
import { buildPayload } from '@utility/buildPayload'
import { snackbarOpenType } from '@type/snackbarOpen'
import { DialogArrayType } from '@type/dialogArrayType'
import GeneralDialog from '@components/general/GeneralDialog'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'

type Props = { kioskID: number; canWrite: boolean; snackbarOpen: snackbarOpenType }

const FIELDS: { key: 'kcuPassword' | 'level1Password' | 'level2Password'; label: string }[] = [
    { key: 'kcuPassword', label: 'رمز KCU' },
    { key: 'level1Password', label: 'رمز سطح ۱' },
    { key: 'level2Password', label: 'رمز سطح ۲' },
]

/**
 * The three kiosk passwords. They are stored encrypted and each VIEW is written to the server log (who and when),
 * so nothing is fetched until the user presses the button, and it is dropped from the screen when hidden again.
 */
const KioskPasswordsTab = ({ kioskID, canWrite, snackbarOpen }: Props) => {
    // enabled: false = no request until refetch() is called
    const passwords = useGetData<any>(`api/Kiosk/GetKioskPasswords/${kioskID}`, 'kiosk-passwords', { ids: [String(kioskID)], enabled: false, gcTime: 0 })
    const [visible, setVisible] = useState(false)
    const [editing, setEditing] = useState(false)

    const data = passwords.data?.value
    const form: DialogArrayType[] = FIELDS.map((f) => ({ label: f.label, value: f.key, kind: 'textField', size: 12, component: TextFieldComp, ltr: true }))

    const show = async () => {
        const res = await passwords.refetch()
        if (res.data && !res.data.error) setVisible(true)      // an error (403, 500...) is shown by the snackbar layer, not here
    }

    const copy = (text?: string) => text && navigator.clipboard?.writeText(text)

    return (
        <Box>
            <Alert severity="warning" sx={{ mb: 1 }}>هر بار نمایش یا تغییر رمزها در سرور ثبت می‌شود (چه کسی و چه زمانی).</Alert>

            {!visible ? (
                <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={show} disabled={passwords.isFetching}>نمایش رمزها</Button>
            ) : (
                <Stack gap={1}>
                    {FIELDS.map((f) => (
                        <Stack key={f.key} direction="row" alignItems="center" gap={1}>
                            <Typography variant="body2" sx={{ minWidth: 90 }}>{f.label}</Typography>
                            <Typography dir="ltr" sx={{ fontFamily: 'monospace' }}>{data?.[f.key] || '-'}</Typography>
                            {data?.[f.key] && <IconButton size="small" onClick={() => copy(data[f.key])}><ContentCopyIcon fontSize="small" /></IconButton>}
                        </Stack>
                    ))}
                    <Stack direction="row" gap={1}>
                        <Button startIcon={<VisibilityOffIcon />} onClick={() => setVisible(false)}>پنهان کردن</Button>
                        {canWrite && <Button startIcon={<EditIcon />} onClick={() => setEditing(true)}>تغییر رمزها</Button>}
                    </Stack>
                </Stack>
            )}

            {editing && (
                <GeneralDialog
                    open="edit"
                    title="رمزهای کیوسک"
                    close={() => setEditing(false)}
                    array={form}
                    editEndpoint="api/Kiosk/UpdateKioskPasswords"
                    defaultValue={{ ...data }}
                    // the server replaces all three, so all three are always sent
                    sendFinalData
                    apiValueGetter={((d: any) => buildPayload(form, d, { kioskID })) as any}
                    wrapperFunc={() => passwords.refetch()}
                    snackbarOpen={snackbarOpen}
                />
            )}
        </Box>
    )
}

export default KioskPasswordsTab