import React from 'react'
import { Platform, useColorScheme } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

export const useIsDarkMode = () => {
	return useColorScheme() === 'dark'
}

export const useOnFocus = () => {
	const focused = useSharedValue(0)
	// use state on web for now till useAnimatedStyle bug is resolved
	const [state, setFocused] = React.useState(0)

	const focusHandler = React.useMemo(() => {
		return {
			onFocus: () => {
				focused.value = 1
				if (Platform.OS === 'web') {
					setFocused(1)
				}
			},
			onBlur: () => {
				focused.value = 0
				if (Platform.OS === 'web') {
					setFocused(0)
				}
			},
			focused: Platform.select({ default: focused, web: { value: state } }),
		}
	}, [state])

	return focusHandler
}
