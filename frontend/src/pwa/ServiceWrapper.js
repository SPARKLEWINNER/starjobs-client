import React from 'react'
import {Snackbar, Button} from '@mui/material'
import {register} from '../serviceWorkerRegistration'

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = React.useState(false)
  const [installingWorker, setInstallingWorker] = React.useState(null)

  const onSWUpdate = (registration) => {
    setShowReload(true)
    setInstallingWorker(registration.installing)
  }

  React.useEffect(() => {
    register({onUpdate: onSWUpdate})
  }, [])

  const reloadPage = () => {
    installingWorker?.postMessage({type: 'SKIP_WAITING'})
    setShowReload(false)
    window.location.reload(true)
  }

  return (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      data-test-id="screens-new-version-snackbar"
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      action={
        <Button color="inherit" size="small" onClick={reloadPage}>
          Reload
        </Button>
      }
    />
  )
}

export default ServiceWorkerWrapper
