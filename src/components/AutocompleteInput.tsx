import {
  Autocomplete,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material'
import { Control, useController } from 'react-hook-form'

interface AutocompleteInputProps {
  name: string
  label: string
  options: {
    label: string | number
    value: string | number
  }[]
  multiple?: boolean
  control: Control<any>
}

export function AutocompleteInput({
  name,
  label,
  options,
  multiple,
  control,
}: AutocompleteInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, defaultValue: multiple ? [] : null })

  return (
    <FormControl className="w-full" error={!!error}>
      <Autocomplete
        id={name}
        value={value}
        multiple={multiple}
        options={options}
        filterSelectedOptions
        onChange={(_, value) => onChange(value)}
        getOptionLabel={(option) => (option ? option.label : '')}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField {...params} label={label} error={!!error} />
        )}
      />
      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  )
}
