import React from 'react'
import { StyleSheet, I18nManager, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate } from 'react-native-reanimated'

import { IndicatorProps } from './types'

const Indicator: React.FC<IndicatorProps> = ({ indexDecimal, itemsLayout, style, fadeIn = false }) => {
	const opacity = useSharedValue(1)

	const stylez = useAnimatedStyle(() => {
		const transform =
			itemsLayout.length > 1
				? [
						{
							translateX: interpolate(
								indexDecimal.value,
								itemsLayout.map((_, i) => i),
								// when in RTL mode, the X value should be inverted
								itemsLayout.map(v => (I18nManager.isRTL ? -1 * v.x : v.x))
							),
						},
				  ]
				: undefined

		const width =
			itemsLayout.length > 1
				? interpolate(
						indexDecimal.value,
						itemsLayout.map((_, i) => i),
						itemsLayout.map(v => v.width)
				  )
				: itemsLayout[0]?.width

		return {
			transform,
			width,
			opacity: withTiming(opacity.value),
		}
	}, [indexDecimal, itemsLayout])

	const stylez2 = useAnimatedStyle(() => {
		const transform =
			itemsLayout.length > 1
				? [
						{
							translateX: interpolate(
								indexDecimal.value,
								itemsLayout.map((_, i) => i),
								// when in RTL mode, the X value should be inverted
								itemsLayout.map(v => (I18nManager.isRTL ? -1 * v.x : v.x))
							),
						},
				  ]
				: undefined

		const width =
			itemsLayout.length > 1
				? interpolate(
						indexDecimal.value,
						itemsLayout.map((_, i) => i),
						itemsLayout.map(v => v.width)
				  )
				: itemsLayout[0]?.width

		return {
			transform,
			width,
			opacity: withTiming(opacity.value),
		}
	}, [indexDecimal, itemsLayout])

	return (
		<>
			<Animated.View style={[stylez2, styles.indicator, style]} />
			<Animated.View style={[stylez, styles.indicatorLine, style]} />
		</>
	)
}

const styles = StyleSheet.create({
	indicator: {
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		position: 'absolute',
		borderRadius: 999,
	},
	indicatorLine: {
		height: 2,
		backgroundColor: 'rgb(0, 0, 0)',
		position: 'absolute',
		bottom: 0,
	},
})

export { Indicator }
