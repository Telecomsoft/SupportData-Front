//@ts-nocheck

import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import StyledTextField from '@components/general/input/StyledTextField'
import { StyledAutoComplete } from '../input/StyledAutoComplete'
import { TextFieldCompProps } from './TextFieldComp'
import { useState } from 'react'
import { sizeConverter } from '@src/utility/sizeConverter'
import { AutoCompleteOption, AutoCompleteT, AutoCompleteObjectT } from '@src/data/type/AutoCompletes'
import { usePostData } from '@src/hooks/usePostData'
import { handleRequestWithDelay } from '@src/utility/handleRequestWithDelay'
import Chip from '@mui/material/Chip'

export type AutoCompleteCompProps = {
    autoCompleteOption?: AutoCompleteOption[]
    label: string
    autocompleteType: 'single' | 'multiple' | 'searchable' | 'freeSolo' | 'singleFreeSolo'
    searchEndPoint?: string
    searchBy?: string
    disabled?: boolean
} & TextFieldCompProps

const AutoCompleteComp = ({
    autoCompleteOption,
    label,
    value,
    autocompleteType = 'single',
    searchEndPoint,
    searchBy = 'Name',
    size = 12,
    control,
    validators,
    sx,
    helperText,
    placeholder,
    disabled,
}: AutoCompleteCompProps) => {

    const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
    const [searchResult, setSearchResult] = useState([])

    const searchPorts = usePostData(searchEndPoint!)
console.log('autoCompleteOption',autoCompleteOption)
    const safeOptions = autoCompleteOption ?? []

    const handleOnChangeTextField = (newValue: string) => {
        handleRequestWithDelay(() => {
            if (newValue === '') {
                setSearchResult([])
            } else {
                searchPorts?.mutate(
                    {
                        searchBy: searchBy,
                        searchTxt: newValue,
                        number: 15,
                    },
                    {
                        onSuccess: (res: any) => {
                            if (res?.data?.error === 0) {
                                setSearchResult(res.data.value)
                            }
                        },
                    }
                )
            }
        })
    }

    const autoCompleteTypes: AutoCompleteObjectT = {
        single: {
            options: safeOptions,
            getOptionLabel: (option: AutoCompleteOption) => option?.name,
            handleOnChange: 'basic',
        },
        multiple: {
            isMultiple: true,
            getOptionLabel: (option: AutoCompleteOption) => option?.name,
            options: [{ id: -1, name: 'انتخاب/حذف همه' }, ...safeOptions],
            isOptionEqualToValue: (option: AutoCompleteOption, value: AutoCompleteOption) => option?.id === value?.id,
            renderTags: (value: AutoCompleteOption[]) => (
                <Grid sx={{ mx: sizeConverter(5, 'space') }} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {renderTags(value)}
                </Grid>
            ),
            handleOnChange: 'custom',
        },
        freeSolo: {
            isMultiple: true,
            isFreeSolo: true,
            options: [],
            handleOnChange: 'basic',
        },
        singleFreeSolo: {
            isFreeSolo: true,
            options: [],
            handleOnChange: 'restrictSingle',
        },
        searchable: {
            options: searchResult,
            isMultiple: true,
            getOptionLabel: (option: AutoCompleteOption) => option?.name,
            handleOnChange: 'basic',
            onInputChange: (newValue: string) => handleOnChangeTextField(newValue),
        },
    }

    const config: AutoCompleteT = autoCompleteTypes[!!autocompleteType ? autocompleteType : 'single']

    const handleOnChange = (
        _event: React.ChangeEvent<{}>,
        newValues: AutoCompleteOption[] | AutoCompleteOption | null,
        onChange: (value: AutoCompleteOption[] | AutoCompleteOption | null) => void,
        value: AutoCompleteOption[] | null
    ) => {
        if (Array.isArray(newValues) && newValues?.map((i) => i?.id)?.includes(-1)) {
            if (isSelectAll || (!!value && value?.length === safeOptions?.length)) {
                onChange([])
                setIsSelectAll(false)
            } else {
                onChange(safeOptions)
                setIsSelectAll(true)
            }
        } else {
            onChange(newValues)
            setIsSelectAll(false)
        }
    }

    const handleRestrictSingleChange = (
        _event: React.ChangeEvent<{}>,
        newValue: AutoCompleteOption | null,
        onChange: (value: AutoCompleteOption | null) => void
    ) => {
        onChange(newValue ? [newValue] : null)
    }

    const renderTags = (selected: AutoCompleteOption[]) => {
        const selectedOptions = selected as AutoCompleteOption[]
        if (selectedOptions?.length > 2) return `${selectedOptions?.length} مورد انتخاب شده است`
        return selectedOptions?.map((option) => option?.name).join(', ')
    }

    const isValueFilled = value && value !== ''

    return (
        <Grid container size={size} sx={sx && sx}>
            <Controller
                name={value}
                control={control}
                // defaultValue={config.isMultiple ? [] : null}
                rules={validators}
                render={({ field: { onChange, value: controllerValue }, fieldState: { error } }) => {
                    return <StyledAutoComplete
                        disabled={disabled}
                         autocompleteType={autocompleteType}
                        options={autocompleteType === 'freeSolo' ? [] : config.options}
                        {...(!!config.isMultiple && { multiple: config?.isMultiple })}
                        {...(!!config.isFreeSolo && { freeSolo: config?.isFreeSolo })}
                        {...(!!config.getOptionLabel && autocompleteType !== 'freeSolo' && {
                            getOptionLabel: (option: AutoCompleteOption) => config?.getOptionLabel?.(option),
                        })}
                        {...(!!config?.isOptionEqualToValue && autocompleteType !== 'freeSolo' && {
                            isOptionEqualToValue: (opt, val) => config?.isOptionEqualToValue?.(opt, val),
                        })}

                        value={controllerValue ?? (config.isMultiple ? [] : null)}

                        // در قسمت onChange:
                        onChange={(event, newValue) => {
                            if (autocompleteType === 'freeSolo') {
                                // در حالت multiple + freeSolo، مقدار newValue همیشه یک آرایه است.
                                const cleanValues = (newValue || [])?.map((v: any) =>
                                    typeof v === 'string' ? v : v?.name ?? v?.inputValue ?? String(v)
                                )
                                onChange(cleanValues)
                                return
                            }

                            if (config?.handleOnChange === 'restrictSingle') {
                                handleRestrictSingleChange(event, newValue as AutoCompleteOption, onChange)
                            } else {
                                config?.handleOnChange === 'custom'
                                    ? handleOnChange(event, newValue as AutoCompleteOption[], onChange, controllerValue)
                                    : onChange(newValue)
                            }
                        }}


                        {...(autocompleteType === 'freeSolo' && {
                            renderTags: (tagValue: any[], getTagProps) =>
                                tagValue?.map((option, index) => (
                                    <Chip
                                        label={typeof option === 'string' ? option : option?.name}
                                        {...getTagProps({ index })}
                                        key={index}
                                    />
                                ))
                        })}

                        {...(!!config?.onInputChange && {
                            onInputChange: (_event, newValue) => config?.onInputChange?.(newValue),
                        })}

                        renderInput={(params) => (
                            <StyledTextField
                                {...params}
                                label={
                                    validators?.required ? (
                                        <span>
                                            {label} <span style={{ color: 'red', marginLeft: sizeConverter(20, 'spaceX') }}>*</span>
                                        </span>
                                    ) : label
                                }
                                error={!!error}
                                helperText={error ? error.message : helperText}
                                placeholder={placeholder}
                                InputLabelProps={{
                                    shrink: isValueFilled || undefined,
                                }}
                            />
                        )}

                        filterSelectedOptions={autocompleteType === 'searchable'}
                    />
                }}
            />
        </Grid>
    )
}

export default AutoCompleteComp
