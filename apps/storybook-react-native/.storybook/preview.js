import { DripsyProvider } from 'dripsy'
import { theme } from 'design-system/theme'
import { useFonts } from 'expo-font'
import { useDeviceContext } from 'twrnc'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { tw } from 'design-system/tailwind'
import { View } from 'design-system/view'

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

const TailwindDeviceContextProvider = ({ children }) => {
	useDeviceContext(tw)

	return children
}

export const decorators = [
	Story => (
		<TailwindDeviceContextProvider>
			<DripsyProvider theme={theme}>
				<SafeAreaProvider>
					<MainAxisCenter>
						<FontsLoader>
							<Story />
						</FontsLoader>
					</MainAxisCenter>
				</SafeAreaProvider>
			</DripsyProvider>
		</TailwindDeviceContextProvider>
	),
]

const MainAxisCenter = ({ children }) => {
	useDeviceContext(tw)

	return <View tw="flex-1 justify-center dark:bg-gray-900">{children}</View>
}

export const parameters = {}
