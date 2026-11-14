import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import StyledTextField from '@components/general/input/StyledTextField'
import CustomCircularProgress from '@components/general/CustomCircularProgress'
import { SNACKBAR_SEVERITIES } from '@components/hoc/withSnackbar'
import { usePutData } from '@hooks/usePutData'
import { snackbarOpenType } from '@type/snackbarOpen'
import { ResType } from '@type/resType'

type Form = { password: string; newPassword: string; repeat: string }

type Props = {
    open: boolean
    close: () => void
    snackbarOpen: snackbarOpenType
}

/**
 * A user changes their OWN password: PUT api/Base/ChangePassword { userName, password, newPassword }.
 * (An admin setting somebody else's password is the "users" screen.) The server checks the current password
 * and answers HTTP 200 with { error != 0 } when it is wrong, so the reply's error code is checked here.
 */
const ChangePasswordDialog = ({ open, close, snackbarOpen }: Props) => {
    const [show, setShow] = useState(false)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Form>({ defaultValues: { password: '', newPassword: '', repeat: '' } })
    const change = usePutData<{ userName?: string; password: string; newPassword: string }, ResType>('api/Base/ChangePassword', 'change-own-password')

    const closeAndReset = () => {
        reset()
        setShow(false)
        close()
    }

    const submit = (data: Form) =>
        change.mutate(
            { userName: Cookies.get('userName'), password: data.password, newPassword: data.newPassword },
            {
                onSuccess: (res) => {
                    if (res.error === 0) {
                        snackbarOpen('رمز عبور تغییر کرد', SNACKBAR_SEVERITIES.SUCCESS)
                        closeAndReset()
                    } else {
                        snackbarOpen(`${res.error} ${res.errorMessage}`, SNACKBAR_SEVERITIES.ERROR)
                    }
                },
                onError: (err: Error) => snackbarOpen(err.message, SNACKBAR_SEVERITIES.ERROR),
            }
        )

    const eye = (
        <InputAdornment position="end">
            <IconButton aria-label="نمایش رمز عبور" onClick={() => setShow((v) => !v)} edge="end">
                {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    )
    const type = show ? 'text' : 'password'

    return (
        <Dialog open={open} onClose={closeAndReset} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit(submit)}>
                <DialogTitle>تغییر رمز عبور</DialogTitle>
                <DialogContent>
                    <Stack gap={2} sx={{ pt: 1 }}>
                        <StyledTextField
                            label="رمز عبور فعلی"
                            type={type}
                            autoFocus
                            InputProps={{ endAdornment: eye }}
                            {...register('password', { required: 'رمز عبور فعلی را وارد کنید' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <StyledTextField
                            label="رمز عبور جدید"
                            type={type}
                            {...register('newPassword', {
                                required: 'رمز عبور جدید را وارد کنید',
                                validate: (v) => v !== watch('password') || 'رمز جدید باید با رمز فعلی فرق داشته باشد',
                            })}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                        />
                        <StyledTextField
                            label="تکرار رمز عبور جدید"
                            type={type}
                            {...register('repeat', {
                                required: 'تکرار رمز عبور را وارد کنید',
                                validate: (v) => v === watch('newPassword') || 'رمز عبور با تکرار آن همخوانی ندارد',
                            })}
                            error={!!errors.repeat}
                            helperText={errors.repeat?.message}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeAndReset} disabled={change.isPending}>
                        انصراف
                    </Button>
                    <Button type="submit" variant="main" disabled={change.isPending}>
                        {change.isPending ? <CustomCircularProgress size={18} color="white.0" /> : 'تغییر رمز عبور'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ChangePasswordDialog
