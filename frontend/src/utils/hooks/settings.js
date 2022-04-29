import {useContext} from 'react'
import {SettingsContext} from 'src/contexts/settings'

const useSettings = () => useContext(SettingsContext)

export default useSettings
