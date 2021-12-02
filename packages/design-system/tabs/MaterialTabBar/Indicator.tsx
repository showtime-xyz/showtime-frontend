import React from 'react'
import { StyleSheet, I18nManager } from 'react-native'
import { tw as tailwind } from 'design-system/tailwind'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate } from 'react-native-reanimated'
import { IndicatorProps } from './types'

// Alpha color. Todo: add a tailwind token
export const TAB_BAR_ACTIVE_BG = 'rgba(0, 0, 0, 0.09)'

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
			<Animated.View style={[stylez, styles.indicatorLine, style, tailwind.style('bg-gray-900')]} />
		</>
	)
}

const styles = StyleSheet.create({
	indicator: {
		backgroundColor: TAB_BAR_ACTIVE_BG,
		position: 'absolute',
		borderRadius: 999,
		paddingVertical: 18,
		left: 0,
	},
	indicatorLine: {
		height: 2,
		position: 'absolute',
		bottom: 0,
		left: 0,
	},
})

export { Indicator }
