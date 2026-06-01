// src/components/general/hookFromInputs/MobileAutoCompleteComp.tsx
import { Controller } from 'react-hook-form';
import { Grid2 as Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import { StyledAutoComplete } from '@components/general/input/StyledAutoComplete';
import StyledTextField from '@components/general/input/StyledTextField';

const MobileAutoCompleteComp = ({
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

    const safeOptions = autoCompleteOption ?? [];

    return (
        <Grid size={size} sx={sx}>
            <Controller
                name={value}
                control={control}
                rules={validators}
                render={({ field: { onChange, value: controllerValue }, fieldState: { error } }) => (
                    <StyledAutoComplete
                        disabled={disabled}
                        options={safeOptions}
                        multiple={autocompleteType === 'multiple'}
                        freeSolo={autocompleteType === 'freeSolo' || autocompleteType === 'singleFreeSolo'}
                        getOptionLabel={(option: any) => option?.name || option || ''}
                        isOptionEqualToValue={(option, val) => option?.id === val?.id}
                        value={controllerValue ?? (autocompleteType === 'multiple' ? [] : null)}
                        
                        onChange={(_event, newValue) => {
                            if (autocompleteType === 'multiple') {
                                onChange(newValue);
                            } else if (autocompleteType === 'freeSolo' || autocompleteType === 'singleFreeSolo') {
                                onChange(typeof newValue === 'string' ? newValue : newValue?.name || newValue);
                            } else {
                                onChange(newValue);
                            }
                        }}

                        renderTags={(tagValue: any[], getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    key={index}
                                    label={typeof option === 'string' ? option : option?.name}
                                    {...getTagProps({ index })}
                                    size="medium"
                                    sx={{ m: 0.5 }}
                                />
                            ))
                        }

                        renderInput={(params) => (
                            <StyledTextField
                                {...params}
                                label={
                                    validators?.required ? (
                                        <span>
                                            {label} <span style={{ color: 'red' }}>*</span>
                                        </span>
                                    ) : label
                                }
                                error={!!error}
                                helperText={error?.message || helperText}
                                placeholder={placeholder || `انتخاب ${label}`}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        fontSize: '1.1rem',
                                        py: 1.5,
                                    }
                                }}
                            />
                        )}

                        sx={{
                            '& .MuiAutocomplete-popup': {
                                maxHeight: '60vh',
                            }
                        }}
                    />
                )}
            />
        </Grid>
    );
};

export default MobileAutoCompleteComp;