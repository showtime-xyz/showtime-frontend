import React, { useEffect } from 'react'
import { Meta } from '@storybook/react'
import { Text } from '../text'
import { Dimensions, View } from 'react-native'
import { Tabs } from './tablib'
import Animated, { useAnimatedReaction, runOnJS } from 'react-native-reanimated'
import { Animated as OldAnimated } from 'react-native'
import { useTabsContext } from './tablib'
import { MotiView, AnimatePresence } from 'moti'

// todo - make tabitemwidth dynamic. Current limitation of pager of using vanilla animated prevents animating width indicators.
// todo - figure out how to make reanimated native handlers work with pager view
const tabItemWidth = 120

const Header = () => {
	const windowWidth = Dimensions.get('window').width
	return (
		<Animated.View style={[{ width: '100%' }]} pointerEvents="none">
			<Animated.Image
				source={{
					uri: 'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
				}}
				style={[{ aspectRatio: 1.49, width: windowWidth }]}
			/>
		</Animated.View>
	)
}

const SelectedTabIndicator = () => {
	const { offset, position, tabItemLayouts } = useTabsContext()
	const newPos = OldAnimated.add(position, offset)
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
		<OldAnimated.View
			style={[
				{
					transform: [{ translateX }],
					position: 'absolute',
					width: tabItemWidth,
					height: '100%',
					justifyContent: 'center',
				},
			]}
		>
			<View
				style={{
					height: 2,
					backgroundColor: 'black',
					position: 'absolute',
					zIndex: 9999,
					width: '100%',
					bottom: 0,
				}}
			/>
			<View
				style={[
					{
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
						height: '70%',
						borderRadius: 999,
					},
				]}
			/>
		</OldAnimated.View>
	)
}

const PullToRefresh = ({ onRefresh }) => {
	const { pullToRefreshY, refreshGestureState } = useTabsContext()
	const [refreshState, setRefreshState] = React.useState('idle')

	// const safeAreaInset = useSafeAreaInsets()

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

	useEffect(() => {
		if (refreshState === 'refreshing') {
			onRefreshHandler()
		}
	}, [refreshState])

	return (
		<AnimatePresence>
			{refreshState !== 'idle' ? (
				<MotiView
					from={{
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
					}}
					animate={{
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
					}}
					exit={{
						opacity: 0,
					}}
					transition={{
						loop: true,
						type: 'timing',
						duration: 500,
					}}
					style={[
						{
							zIndex: 1,
							position: 'absolute',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							// top: safeAreaInset.top,
							height: 50,
						},
					]}
					pointerEvents="none"
				>
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 200, type: 'timing' }}
					>
						{refreshState === 'pulling' && <Text style={{ color: 'white' }}>Release to refresh</Text>}
						{refreshState === 'cancelling' && <Text style={{ color: 'white' }}>Pull to refresh</Text>}
						{refreshState === 'refreshing' && <Text style={{ color: 'white' }}>Refreshing...</Text>}
					</MotiView>
				</MotiView>
			) : null}
		</AnimatePresence>
	)
}

const TabItem = ({ name, count }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: tabItemWidth,
			}}
		>
			<Text variant="text-sm" sx={{ fontWeight: '700', marginRight: 4 }}>
				{name}
			</Text>
			<Text variant="text-sm" sx={{ fontWeight: '400' }}>
				{count}
			</Text>
		</View>
	)
}

export const ScrollableTabs: React.FC = () => {
	const onIndexChange = index => {
		console.log('index changed', index)
	}

	const onRefresh = () => {
		console.log('refresh page!')
	}

	const data = [
		{ name: 'Created', count: 145 },
		{ name: 'Owned', count: 13 },
		{ name: 'Listed', count: 13 },
		{ name: 'Liked', count: 198 },
	]

	return (
		<View style={{ flex: 1 }}>
			<Tabs.Root onIndexChange={onIndexChange} lazy>
				<PullToRefresh onRefresh={onRefresh} />

				<Tabs.Header>
					<Header />
				</Tabs.Header>

				<Tabs.List
					contentContainerStyle={{
						alignItems: 'center',
					}}
					style={{
						paddingHorizontal: 10,
						backgroundColor: 'white',
						height: 55,
					}}
				>
					{data.map(d => {
						return (
							<Tabs.Trigger key={d.name}>
								<TabItem name={d.name} count={d.count} />
							</Tabs.Trigger>
						)
					})}

					{/* Line and current tab hightlight Indicator  */}
					<SelectedTabIndicator />
					{/* */}
				</Tabs.List>
				<Tabs.Pager>
					{data.map(d => {
						return (
							<Tabs.FlatList
								bounces={false}
								data={[1, 2, 3, 4, 5, 6, 99, 7, 8]}
								keyExtractor={item => item.toString()}
								key={d.name}
								renderItem={({ index }) => {
									return (
										<View
											style={{
												height: 200,
												backgroundColor: ['#9CA3AF', '#FEF2F2', '#D1FAE5'][index % 3],
											}}
										/>
									)
								}}
							/>
						)
					})}
				</Tabs.Pager>
			</Tabs.Root>
		</View>
	)
}

export default {
	component: Tabs.Root,
	title: 'Components/Tabs',
} as Meta
