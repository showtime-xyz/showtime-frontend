import React from 'react'
import { enableScreens } from 'react-native-screens'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DripsyProvider } from 'dripsy'

import { theme } from 'app/theme'
import { HelloWorld } from 'app/hello-world'

enableScreens(true)

export default function App() {
	return (
		<DripsyProvider theme={theme}>
			<SafeAreaProvider>
				<StatusBar style="dark" />
				<HelloWorld />
			</SafeAreaProvider>
		</DripsyProvider>
	)
}
