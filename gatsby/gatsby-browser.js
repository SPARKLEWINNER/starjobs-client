exports.onServiceWorkerUpdateReady = () => {
  if (window.confirm('Starjobs has been updated. Do you wish to reload the app to get the new data?')) {
    window.location.reload(true)
  }
}
