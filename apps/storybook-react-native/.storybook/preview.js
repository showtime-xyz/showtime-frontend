import { DripsyProvider } from 'dripsy'
import { theme } from 'design-system/theme'
import { useFonts } from 'expo-font'
import { useDeviceContext } from 'twrnc'
import { View } from 'react-native'
import { tw } from 'design-system/tailwind'

const FontsLoader = ({ children }) => {
	const [fontsLoaded, error] = useFonts({
		'Inter-Bold': require('../assets/fonts/Inter-Bold.otf'),
		'Inter-Medium': require('../assets/fonts/Inter-Medium.otf'),
		Inter: require('../assets/fonts/Inter-Regular.otf'),
		'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
		'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.otf'),
	})

	if (!fontsLoaded) return null

	if (error) {
		console.error(error)
	}

	return children
}

export const decorators = [
	Story => (
		<DripsyProvider theme={theme}>
			<MainAxisCenter>
				<FontsLoader>
					<Story />
				</FontsLoader>
			</MainAxisCenter>
		</DripsyProvider>
	),
]

const MainAxisCenter = ({ children }) => {
	useDeviceContext(tw)

	return <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>
}

export const parameters = {}
