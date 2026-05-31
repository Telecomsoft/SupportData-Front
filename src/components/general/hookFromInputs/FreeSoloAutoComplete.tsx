// FreeSoloAutoComplete.tsx
import { Controller } from 'react-hook-form';
import { Autocomplete, TextField, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect } from 'react';

interface FreeSoloAutoCompleteProps {
  value: string;
  label: string;
  control: any;
  size?: number;
  placeholder?: string;
  disabled?: boolean;
  validators?: any;
  helperText?: string;
  defaultValue?: string[];
  // برای دریافت setValue از GeneralDialog
  setValue?: (name: string, value: any) => void;
}

const FreeSoloAutoComplete = ({
  value,
  label,
  control,
  size = 12,
  placeholder,
  disabled,
  validators,
  helperText,
  defaultValue = [],
  setValue,
}: FreeSoloAutoCompleteProps) => {
  // هر بار که defaultValue تغییر کند، مقدار فرم را به‌روزرسانی می‌کنیم
  useEffect(() => {
    if (setValue && defaultValue) {
      const safeDefault = Array.isArray(defaultValue)
        ? defaultValue.filter((v) => typeof v === 'string')
        : [];
      setValue(value, safeDefault);
    }
  }, [defaultValue, setValue, value]);

  return (
    <Grid container size={size}>
      <Controller
        name={value}
        control={control}
        defaultValue={[]}
        rules={validators}
        render={({ field: { onChange, value: fieldValue }, fieldState: { error } }) => {
          const safeValue = Array.isArray(fieldValue)
            ? fieldValue.filter((v) => typeof v === 'string')
            : [];

          console.log(`fieldValue for ${value}:`, safeValue);

          return (
            <Autocomplete
              multiple
              freeSolo
              disabled={disabled}
              options={[]}
              value={safeValue}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return '';
              }}
              onChange={(_, newValue) => {
                const strings = newValue
                  .map((v) => (typeof v === 'string' ? v.trim() : ''))
                  .filter((v) => v !== '');
                onChange(strings);
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                  error={!!error}
                  helperText={error ? error.message : helperText}
                />
              )}
            />
          );
        }}
      />
    </Grid>
  );
};

export default FreeSoloAutoComplete;