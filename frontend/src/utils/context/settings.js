import PropTypes from 'prop-types'
import {createContext} from 'react'
// hooks
import useLocalStorage from 'utils/hooks/storage'
// theme
import palette from 'theme/palette'

const PRIMARY_COLOR = [
  // DEFAULT
  {
    name: 'default',
    ...palette.primary,
  },
]

function SetColor() {
  return PRIMARY_COLOR[0]
}

const initialState = {
  setColor: PRIMARY_COLOR[1],
  colorOption: [],
}

const SettingsContext = createContext(initialState)

SettingsProvider.propTypes = {
  children: PropTypes.node,
}

function SettingsProvider({children}) {
  // eslint-disable-next-line
  const [settings, setSettings] = useLocalStorage('settings', {
    themeColor: 'default',
  })
  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setColor: SetColor(settings.themeColor),
        colorOption: PRIMARY_COLOR.map((color) => ({
          name: color.name,
          value: color.main,
        })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export {SettingsProvider, SettingsContext}
