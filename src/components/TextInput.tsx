import { StandardTextFieldProps, TextField } from '@mui/material'
import { Control, useController } from 'react-hook-form'

interface TextInputProps extends StandardTextFieldProps {
  name: string
  control: Control<any>
}

export function TextInput({ name, control, ...rest }: TextInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, defaultValue: '' })

  return (
    <TextField
      id={name}
      value={value}
      error={!!error}
      helperText={error?.message}
      onChange={onChange}
      {...rest}
    />
  )
}
