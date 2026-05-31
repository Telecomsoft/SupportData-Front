/* eslint-disable */
//@ts-nocheck

import StyledTextField from '@components/general/input/StyledTextField'
import Grid from '@mui/material/Grid2'
import { TextFieldProps } from '@mui/material/TextField'
import { RegisterOptions } from 'react-hook-form'
import { formTypes } from '@type/reactHookFormType.ts'
import { GridSize } from '@mui/material/Grid2/Grid2'
import {
    ChangeEventHandler,
    CSSProperties,
    FocusEventHandler,
    FormEventHandler,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactNode,
    Ref,
} from 'react'
import { sizeConverter } from '@utility/sizeConverter.ts'

export type TextFieldCompProps = {
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>
    textFieldSx?: CSSProperties
    value?: string
    onClick?: MouseEventHandler<HTMLDivElement>
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    autoFocus?: boolean
    defaultValue?: string
    inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>
    onInput?: FormEventHandler<HTMLDivElement>
    type?: string
    rows?: number
    disabled?: boolean
    multiline?: boolean
    maxRows?: number
    InputProps?: TextFieldProps['InputProps']
    error?: boolean
    disableArrows?: boolean
    InputLabelProps?: TextFieldProps['InputLabelProps']
    helperText?: ReactNode
    placeholder?: string
    sx?: CSSProperties
    validators?: RegisterOptions
    size?: GridSize
    label?: string
} & formTypes
const TextFieldComp = ({
    onKeyDown,
    textFieldSx,
    value,
    onClick,
    onChange,
    onBlur,
    onFocus,
    autoFocus,
    defaultValue,
    inputRef,
    onInput,
    type,
    rows,
    disabled,
    multiline,
    maxRows,
    InputProps,
    error,
    disableArrows,
    InputLabelProps,
    helperText,
    placeholder,
    sx = {},
    size = 12,
    register,
    ltr,
    label,
    validators,
}: TextFieldCompProps) => {
    const isValueFilled = value && value !== ''
console.log('maxRows',maxRows)
    return (
        <Grid
            container
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            alignContent={'flex-start'}
            size={size}
            sx={{
                direction: ltr ? 'rtl' : 'auto',
                ...(sx && sx),
            }}
        >
            <StyledTextField
                dir='rtl'
                onWheel={(event: any) => {
                    event.preventDefault()
                }}
                {...(onKeyDown && { onKeyDown: onKeyDown })}
                {...(textFieldSx && { sx: { ...textFieldSx } })}
                {...(value && register && register(value, { ...validators }))}
                {...(onClick && { onClick: onClick })}
                {...(onChange && { onChange: onChange })}
                {...(label && {
                    label: validators?.required ? (
                        <span>
                            {label} <span style={{ color: 'red', marginLeft: sizeConverter(20, 'spaceX') }}>*</span>
                        </span>
                    ) : (
                        label
                    ),
                })}
                {...(onBlur && { onBlur: onBlur })}
                {...(onFocus && { onFocus: onFocus })}
                {...(autoFocus && { autoFocus: autoFocus })}
                defaultValue={defaultValue}
                {...(inputRef && { inputRef: inputRef })}
                {...(onInput && { onInput: onInput })}
                {...(type && { type: type })}
                {...(rows && { rows: rows })}
                {...(disabled && { disabled: disabled })}
                {...(multiline && { multiline: multiline })}
                {...(maxRows && { maxRows: maxRows })}
                {...(InputProps && {
                    InputProps: InputProps,
                })}
                {...(error && { error: error })}
                {...(disableArrows && { disableArrows: disableArrows })}
                InputLabelProps={{
                    shrink: isValueFilled || undefined,
                    ...InputLabelProps,
                }}
                {...(helperText && { helperText: helperText })}
                placeholder={placeholder}
                {...(type === 'float' && { type: 'number', inputProps: { step: 'any', inputMode: 'numeric', pattern: '[0-9]*' } })}
                {...(type === 'natural' && {
                    type: 'number',
                    inputProps: {
                        min: 0,
                        step: 1,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    },
                })}
            />
        </Grid>
    )
}

export default TextFieldComp
