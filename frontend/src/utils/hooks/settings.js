import { useContext } from 'react';
import { SettingsContext } from '../context/settings';

// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext);

export default useSettings;
