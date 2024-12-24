import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'dayjs/locale/pt-br'
import { Control, useController } from 'react-hook-form'

interface DatePickerInputProps {
  name: string
  label: string
  disableTime?: boolean
  control: Control<any>
}

export function DatePickerInput({
  name,
  label,
  disableTime,
  control,
}: DatePickerInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: null,
  })

  console.log(value)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {disableTime ? (
        <DatePicker
          className="w-full"
          label={label}
          value={value}
          ignoreInvalidInputs
          disableFuture
          onChange={(value) => onChange(value.toISOString())}
          renderInput={(params) => (
            <TextField
              {...params}
              // onKeyDown={(e) => e.preventDefault()}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      ) : (
        <DateTimePicker
          className="w-full"
          label={label}
          value={value}
          onChange={(value) => onChange(value.toISOString())}
          ignoreInvalidInputs
          disableFuture
          renderInput={(params) => (
            <TextField
              {...params}
              // onKeyDown={(e) => e.preventDefault()}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    </LocalizationProvider>
  )
}
