import PropTypes from 'prop-types'
import {useMemo} from 'react'
// material
import {CssBaseline} from '@mui/material'
import {ThemeProvider, createTheme, StyledEngineProvider} from '@mui/material/styles'
//
import shape from './shape'
import palette from './palette'
import typography from './typography'
import GlobalStyles from './globalStyles'
import componentsOverride from './overrides'
import shadows, {customShadows} from './shadows'

ThemeConfig.propTypes = {
  children: PropTypes.node
}

export default function ThemeConfig({children}) {
  const themeOptions = useMemo(
    () => ({
      shape,
      palette,
      typography,
      shadows,
      customShadows
    }),

    []
  )

  const theme = createTheme(themeOptions)
  theme.components = componentsOverride(theme)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
