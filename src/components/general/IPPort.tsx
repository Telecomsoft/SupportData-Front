import React, { FC, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid2'
import { sizeConverter } from '@src/utility/sizeConverter'
import TextFieldComp from './hookFromInputs/TextFieldComp'
import { formTypes } from '@src/data/type/reactHookFormType'
import Typography from '@mui/material/Typography'
import { IP_ADDRESS_VALIDATOR } from '@src/data/validators/validators'
import useCopyStore from '@src/store/copyStore'
import {SettingFields} from "@data/kioskDefine/bankKiosk.ts";


type IP_PortProps = {
    fields: SettingFields[]
} & formTypes<any>

const IP_Port: FC<IP_PortProps> = ({ fields, watch, errors, register, setValue }) => {
    const { copyData, clearCopyData } = useCopyStore()
    const ipRefs = useRef<{ [key: string]: (HTMLInputElement | null)[] }>({})

    const handleIpSegmentChange = (ipKey: string, segmentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value)
        if (isNaN(value)) value = 0
        if (value > 255) value = 255
        if (setValue) {
            setValue(`${ipKey}-${segmentIndex + 1}`, value.toString())
        }
    }

    const handleKeyDown = (ipKey: string, segmentIndex: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === '.') {
            event.preventDefault()
            if (ipRefs.current[ipKey] && ipRefs.current[ipKey][segmentIndex + 1]) {
                ipRefs.current[ipKey][segmentIndex + 1]?.focus()
            }
        }
    }

    useEffect(() => {
        if (copyData) {
            fields.forEach(({ key, fieldType }) => {
                const normalizedKey = key?.charAt(0).toLowerCase() + key!.slice(1)

                // Clear values if new copy data is empty
                if (fieldType === 'IP' && !copyData[normalizedKey]) {
                    ;[1, 2, 3, 4].forEach((segmentIndex) => {
                        if (setValue) {
                            setValue(`${key}-${segmentIndex}`, '')
                        }
                    })
                    if (setValue) {
                        setValue(key!, '')
                    }
                } else if (fieldType === 'Port' && copyData[normalizedKey] === undefined) {
                    if (setValue) {
                        setValue(key!, '')
                    }
                }

                if (fieldType === 'IP' && copyData[normalizedKey]) {
                    const ipSegments = copyData[normalizedKey].split('.')
                    ipSegments.forEach((segment: string, index: number) => {
                        if (setValue) {
                            setValue(`${key}-${index + 1}`, segment)
                        }
                    })
                } else if (fieldType === 'Port' && copyData[normalizedKey] !== undefined) {
                    if (setValue) {
                        setValue(key!, copyData[normalizedKey].toString())
                    }
                }
            })
        }

        return () => {
            clearCopyData()
        }
    }, [copyData, fields, setValue, clearCopyData])

    useEffect(() => {
        fields.forEach(({ key, fieldType }) => {
            if (fieldType === 'IP') {
                const segmentValues = [1, 2, 3, 4].map((segmentIndex) => (watch ? watch(`${key}-${segmentIndex}`) : ''))
                const allSegmentsFilled = segmentValues.every((segment) => segment !== undefined && segment !== '')
                if (allSegmentsFilled) {
                    const concatenatedIP = segmentValues.join('.')
                    if (setValue) {
                        setValue(key!, concatenatedIP)
                    }
                }
            }
        })
    }, [fields, watch, setValue])

    return (
        <Grid container sx={{ mt: sizeConverter(10, 'space') }} size={12} spacing={sizeConverter(10, 'space')}>
            {fields.map(({ label, key, fieldType }) =>
                fieldType === 'IP' ? (
                    <Grid container size={8} key={key} alignItems={'center'} direction={'row-reverse'} spacing={sizeConverter(2, 'space')}>
                        {Array(4)
                            .fill('')
                            .map((_, segmentIndex) => (
                                <Grid container alignItems={'center'} key={segmentIndex} size={2.9}>
                                    <TextFieldComp
                                        label={``}
                                        watch={watch}
                                        errors={errors}
                                        register={register}
                                        value={`${key}-${segmentIndex + 1}`}
                                        onChange={handleIpSegmentChange(key!, segmentIndex)}
                                        onKeyDown={handleKeyDown(key!, segmentIndex)}
                                        validators={IP_ADDRESS_VALIDATOR}
                                        size={'grow'}
                                        type="number"
                                        inputRef={(el: HTMLInputElement) => {
                                            if (!ipRefs.current[key!]) {
                                                ipRefs.current[key!] = []
                                            }
                                            ipRefs.current[key!][segmentIndex] = el
                                        }}
                                        InputProps={{ inputProps: { min: 0, max: 255 } }}
                                    />
                                    <Grid size={'auto'}>{!!segmentIndex && <Typography fontWeight={'bold'}>.</Typography>}</Grid>
                                </Grid>
                            ))}

                        <Grid size={'auto'}>
                            {' '}
                            :
                            {/* <Typography fontWeight={'bold'} sx={{ px: sizeConverter(1, 'space') }}>
                                :
                            </Typography> */}
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container sx={{ my: sizeConverter(4, 'spaceY') }} size={3.9}>
                        <TextFieldComp
                            key={key}
                            label={label}
                            watch={watch}
                            errors={errors}
                            register={register}
                            value={key}
                            // validators={PORT_VALIDATOR}
                            size={12}
                            type="number"
                            helperText={errors?.[key!]?.message ? String(errors[key!]?.message) : ''}
                            error={!!errors?.[key!]?.message}
                        />
                    </Grid>
                )
            )}
        </Grid>
    )
}

export default IP_Port
