import { useColorScheme } from 'react-native'

export const useIsDarkMode = () => {
	return useColorScheme() === 'dark'
}
