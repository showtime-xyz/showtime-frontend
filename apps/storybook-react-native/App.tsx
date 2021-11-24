import StorybookUIRoot from './.storybook/Storybook'
import { useFonts } from 'expo-font'

export default function App() {
	const [fontsLoaded, error] = useFonts({
		'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
		'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
		'Inter-ExtraBold': require('./assets/fonts/Inter-ExtraBold.otf'),
		'Inter-ExtraLight': require('./assets/fonts/Inter-ExtraLight.otf'),
		'Inter-Light': require('./assets/fonts/Inter-Light.otf'),
		'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
		Inter: require('./assets/fonts/Inter-Regular.otf'),
		'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
		'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.otf'),
		'Inter-Thin': require('./assets/fonts/Inter-Thin.otf'),
	})

	if (!fontsLoaded) return null

	if (error) {
		console.error(error)
	}

	return <StorybookUIRoot />
}
