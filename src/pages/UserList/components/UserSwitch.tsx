import { Switch } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import * as userService from '../../../services/user.service'

type SwitchProps = {
  userId: string
  checked: boolean
}

export function UserSwitch({ userId, checked }: SwitchProps) {
  const { mutate: toogleUserStateMutate } =
    userService.useToogleUserStateMutation()

  const [state, setState] = useState<boolean>(checked)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked

    toogleUserStateMutate(userId)

    setState(isChecked)
  }

  return (
    <Switch
      checked={state}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  )
}
