import React from 'react'
import { StyleSheet, Platform, Pressable } from 'react-native'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'

import { TabName } from './types'
import { MaterialTabItemProps } from './types'

const DEFAULT_COLOR = 'rgba(0, 0, 0, 1)'
export const TAB_ITEM_HEIGHT = 32

/**
 * Any additional props are passed to the pressable component.
 */
export const MaterialTabItem = <T extends TabName = any>({
	name,
	index,
	onPress,
	onLayout,
	scrollEnabled,
	indexDecimal,
	label,
	style,
	labelStyle,
	activeColor = DEFAULT_COLOR,
	inactiveColor = DEFAULT_COLOR,
	inactiveOpacity = 0.7,
	pressColor = '#DDDDDD',
	pressOpacity = Platform.OS === 'ios' ? 0.2 : 1,
	...rest
}: MaterialTabItemProps<T>): React.ReactElement => {
	const stylez = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				indexDecimal.value,
				[index - 1, index, index + 1],
				[inactiveOpacity, 1, inactiveOpacity],
				Animated.Extrapolate.CLAMP
			),
			color: Math.abs(index - indexDecimal.value) < 0.5 ? activeColor : inactiveColor,
		}
	})

	return (
		<Pressable onPress={() => onPress(name)} onLayout={onLayout} {...rest}>
			<Animated.View style={[styles.tabItem, stylez]}>{label}</Animated.View>
		</Pressable>
	)
}

export const styles = StyleSheet.create({
	tabItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		height: TAB_ITEM_HEIGHT,
	},
})
