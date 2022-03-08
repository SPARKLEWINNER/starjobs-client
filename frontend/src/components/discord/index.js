import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { Icon } from '@iconify/react'
import helpIcon from '@iconify/icons-eva/question-mark-circle-outline'
import DiscordDialog from './DiscordDialog'

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div style={{ width: '100%', textAlign: 'center', marginBottom: '16px' }}>
      <Button
        fullWidth
        color="inherit"
        variant="outlined"
        endIcon={<Icon icon={helpIcon} />}
        onClick={() => handleClickOpen()}
      >
        Need Help?
      </Button>
      <DiscordDialog open={open} handleClose={handleClose} />
    </div>
  )
}
