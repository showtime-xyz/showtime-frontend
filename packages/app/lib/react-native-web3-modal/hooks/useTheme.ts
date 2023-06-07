import { useSnapshot } from 'valtio';
import { DarkTheme, LightTheme } from '../constants/Colors';
import { ThemeCtrl } from '../controllers/ThemeCtrl';

function useTheme() {
  const themeState = useSnapshot(ThemeCtrl.state);
  return themeState.themeMode === 'dark' ? DarkTheme : LightTheme;
}

export default useTheme;
