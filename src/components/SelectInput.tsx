import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import { Control, useController } from 'react-hook-form'

interface SelectInputProps extends SelectProps {
  name: string
  options: {
    label: string | number
    value: string | number
  }[]
  control: Control<any>
}

export function SelectInput({
  name,
  label,
  options,
  required,
  control,
  ...rest
}: SelectInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  })

  return (
    <FormControl className="w-full" error={!!error}>
      <InputLabel id={name} required={required}>
        {label}
      </InputLabel>
      <Select
        labelId={name}
        label={label}
        value={value}
        error={!!error}
        onChange={onChange}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  )
}
