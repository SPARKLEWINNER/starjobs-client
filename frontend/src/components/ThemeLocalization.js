import PropTypes from 'prop-types';
// material
import { ThemeProvider, createTheme, useTheme } from '@material-ui/core/styles';
// hooks
import useLocales from 'utils/hooks/locales';

// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
  children: PropTypes.node
};

export default function ThemeLocalization({ children }) {
  const defaultTheme = useTheme();
  const { currentLang } = useLocales();

  const theme = createTheme(defaultTheme, currentLang.systemValue);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
