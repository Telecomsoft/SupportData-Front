import { FC, useEffect, useState } from 'react'
import { formTypes } from '@src/data/type/reactHookFormType'
import { DialogArrayType } from '@src/data/type/dialogArrayType'
import TextFieldComp from '@components/general/hookFromInputs/TextFieldComp'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

type CustomPasswordProps = {
    item?: DialogArrayType
} & formTypes

const CustomPassword: FC<CustomPasswordProps> = ({ watch, setError, errors, register, item }) => {
    const [showPassword, setShowPassword] = useState(false)

    const passwordValue = watch && watch(item!.value)
    const rePasswordValue = watch && watch('rePassword')

    useEffect(() => {
        if (rePasswordValue && passwordValue !== rePasswordValue) {
            setError &&
                setError('rePassword', {
                    type: 'manual',
                    message: 'رمز عبور با تکرار رمز عبور همخوانی ندارد',
                })
        } else {
            setError && setError('rePassword', {})
        }
    }, [passwordValue, rePasswordValue, setError])

    const toggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    }

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <TextFieldComp
                    label={'رمز عبور'}
                    value={item!.value}
                    type={showPassword ? 'text' : item?.value}
                    register={register}
                    validators={{ required: 'رمز عبور الزامی است' }}
                    helperText={errors?.password?.message ? String(errors?.password?.message) : ''}
                    error={!!errors?.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid size={12}>
                <TextFieldComp
                    label={'تکرار رمز عبور'}
                    value="rePassword"
                    type={showPassword ? 'text' : item?.value}
                    register={register}
                    validators={{ required: 'لطفا تکرار رمز عبور را وارد کنید'}}
                    helperText={errors?.rePassword?.message ? String(errors?.rePassword?.message) : ''}
                    error={!!errors?.rePassword?.message}
                />
            </Grid>
        </Grid>
    )
}

export default CustomPassword
