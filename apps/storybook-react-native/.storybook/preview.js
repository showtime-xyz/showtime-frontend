import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds'
import { DripsyProvider } from 'dripsy'
import { theme } from 'design-system/theme'
import { useFonts } from 'expo-font'

const FontsLoader = ({ children }) => {
	const [fontsLoaded, error] = useFonts({
		'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
		'Inter-Bold': require('../assets/fonts/Inter-Bold.otf'),
		'Inter-ExtraBold': require('../assets/fonts/Inter-ExtraBold.otf'),
		'Inter-ExtraLight': require('../assets/fonts/Inter-ExtraLight.otf'),
		'Inter-Light': require('../assets/fonts/Inter-Light.otf'),
		'Inter-Medium': require('../assets/fonts/Inter-Medium.otf'),
		Inter: require('../assets/fonts/Inter-Regular.otf'),
		'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
		'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.otf'),
		'Inter-Thin': require('../assets/fonts/Inter-Thin.otf'),
	})

	if (!fontsLoaded) return null

	if (error) {
		console.error(error)
	}

	return children
}

export const decorators = [
	withBackgrounds,
	Story => (
		<DripsyProvider theme={theme}>
			<FontsLoader>
				<Story />
			</FontsLoader>
		</DripsyProvider>
	),
]
export const parameters = {
	backgrounds: [
		{ name: 'plain', value: 'white', default: true },
		{ name: 'warm', value: 'hotpink' },
		{ name: 'cool', value: 'deepskyblue' },
	],
}
