import { View } from '../../view'
import { Text } from '../../text'
import React from 'react'
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated'
import { MotiView, AnimatePresence } from 'moti'
import { useTabsContext } from '../tablib'
import { Platform, Animated, useColorScheme } from 'react-native'
import { tw } from '../../tailwind'

// todo - make tabitemwidth dynamic. Current limitation of pager of using vanilla animated prevents animating width indicators.
// todo - figure out how to make reanimated native handlers work with pager view
export const Tab_ITEM_WIDTH = 120

type TabItemProps = {
	name: string
	count?: number
	selected?: boolean
}

export const TabItem = ({ name, count, selected }: TabItemProps) => {
	return (
		<MotiView
			from={{ opacity: 0.7 }}
			animate={selected ? { opacity: 1 } : { opacity: 0.7 }}
			transition={{ type: 'timing', duration: 100 }}
			style={{
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: Tab_ITEM_WIDTH,
			}}
		>
			<Text variant="text-sm" sx={{ fontWeight: '700' }} tw={`text-gray-900 dark:text-white`}>
				{name}{' '}
			</Text>

			<Text variant="text-sm" sx={{ fontWeight: '400' }} tw={`text-gray-900 dark:text-white`}>
				{count}
			</Text>
		</MotiView>
	)
}

type PullToRefreshProps = {
	onRefresh: () => void
}

export const PullToRefresh = ({ onRefresh }: PullToRefreshProps) => {
	if (Platform.OS === 'web') {
		return null
	}

	const { pullToRefreshY, refreshGestureState } = useTabsContext()
	const [refreshState, setRefreshState] = React.useState('idle')

	const onRefreshHandler = () => {
		onRefresh()
		setTimeout(() => {
			refreshGestureState.value = 'idle'
		}, 4000)
	}

	useAnimatedReaction(
		() => {
			return refreshGestureState.value
		},
		v => {
			runOnJS(setRefreshState)(v)
		}
	)

	React.useEffect(() => {
		if (refreshState === 'refreshing') {
			onRefreshHandler()
		}
	}, [refreshState])

	return (
		// todo blink animation?
		<AnimatePresence>
			{refreshState !== 'idle' ? (
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 200, type: 'timing' }}
					exit={{ opacity: 0 }}
					style={[
						{
							zIndex: 1,
							position: 'absolute',
							backgroundColor: 'rgba(0, 0, 0, 0.2)',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							height: 50,
						},
					]}
				>
					{refreshState === 'pulling' && <Text style={{ color: 'white' }}>Release to refresh</Text>}
					{refreshState === 'cancelling' && <Text style={{ color: 'white' }}>Pull to refresh</Text>}
					{refreshState === 'refreshing' && <Text style={{ color: 'white' }}>Refreshing...</Text>}
				</MotiView>
			) : null}
		</AnimatePresence>
	)
}

export const SelectedTabIndicator = () => {
	if (Platform.OS === 'web') {
		return null
	}

	// todo replace with useIsDarkMode hook
	const isDark = useColorScheme() === 'dark'

	const { offset, position, tabItemLayouts } = useTabsContext()
	const newPos = Animated.add(position, offset)
	const [itemOffsets, setItemOffsets] = React.useState([0, 0])

	useAnimatedReaction(
		() => {
			let result = []
			let sum = 0
			for (let i = 0; i < tabItemLayouts.length; i++) {
				if (tabItemLayouts[i].value) {
					const width = tabItemLayouts[i].value.width
					result.push(sum)
					sum = sum + width
				}
			}
			return result
		},
		values => {
			if (values.length > 1) {
				runOnJS(setItemOffsets)(values)
			}
		},
		[]
	)

	const translateX = newPos.interpolate({
		inputRange: itemOffsets.map((_v, i) => i),
		outputRange: itemOffsets,
	})

	return (
		<Animated.View
			style={[
				{
					transform: [{ translateX }],
					position: 'absolute',
					width: Tab_ITEM_WIDTH,
					height: '100%',
					justifyContent: 'center',
				},
			]}
		>
			<View
				style={[
					{
						height: 2,
						position: 'absolute',
						zIndex: 9999,
						width: '100%',
						bottom: 0,
					},
					tw.style(`bg-gray-900 dark:bg-gray-100`),
				]}
			/>
			<View
				sx={{
					backgroundColor: isDark ? 'rgba(229, 231, 235, 0.08)' : 'rgba(0, 0, 0, 0.1)',
					height: '70%',
					borderRadius: 999,
				}}
			/>
		</Animated.View>
	)
}
