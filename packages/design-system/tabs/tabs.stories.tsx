import React, { useContext, useEffect } from 'react'
import { Meta } from '@storybook/react'
import { Text } from '../text'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'
import { Tabs } from './tablib'
import Animated, { useAnimatedReaction, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import { Animated as OldAnimated } from 'react-native'
import { TabContext } from './tablib'

const tabbarHeight = 55
const tabItemWidth = 120

const Header = () => {
	const windowWidth = Dimensions.get('window').width
	return (
		<Animated.View style={[{ width: '100%' }]} pointerEvents="none">
			<Animated.Image
				source={{
					uri:
						'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
				}}
				style={[{ aspectRatio: 1.49, width: windowWidth }]}
			/>
		</Animated.View>
	)
}

const Indicator = () => {
	const { offset, position, tabItemLayouts } = useContext(TabContext)
	const newPos = OldAnimated.add(position, offset)
	const [itemWidths, setItemWidths] = React.useState([0, 0])

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
				runOnJS(setItemWidths)(values)
			}
		},
		[]
	)

	const translateX = newPos.interpolate({
		inputRange: itemWidths.map((_v, i) => i),
		outputRange: itemWidths,
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
					width: tabItemWidth,
					bottom: 0,
				}}
			/>
			<View
				style={[
					{
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
						height: '70%',
						width: tabItemWidth,
						borderRadius: 999,
					},
				]}
			/>
		</OldAnimated.View>
	)
}

const PullToRefresh = ({ onRefresh }) => {
	const { pullToRefreshY, refreshGestureState } = useContext(TabContext)
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

	const containerStyle = useAnimatedStyle(() => {
		return {
			opacity: refreshGestureState.value !== 'idle' ? withTiming(1) : withTiming(0),
		}
	})

	useEffect(() => {
		if (refreshState === 'refreshing') {
			onRefreshHandler()
		}
	}, [refreshState])

	return (
		<Animated.View
			style={[
				{
					zIndex: 99999,
					position: 'absolute',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.1)',
					height: 40,
				},
				containerStyle,
			]}
			pointerEvents="none"
		>
			{refreshState === 'pulling' && <Text style={{ color: 'white' }}>Release to refresh</Text>}
			{refreshState === 'cancelling' && <Text style={{ color: 'white' }}>Pull to refresh</Text>}
			{refreshState === 'refreshing' && <ActivityIndicator color="white" size="small" />}
		</Animated.View>
	)
}

export const ScrollableTabs: React.FC = () => {
	const onIndexChange = index => {
		console.log('Dd ', index)
	}

	const onRefresh = () => {
		console.log('refresh current index or profile!')
	}

	const data = [
		{ name: 'Created', count: 145 },
		{ name: 'Owned', count: 13 },
		{ name: 'Listed', count: 13 },
		{ name: 'Liked', count: 198 },
	]

	return (
		<View style={{ flex: 1 }}>
			<Tabs.Root tabBarHeight={tabbarHeight} onIndexChange={onIndexChange}>
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
					}}
				>
					<Indicator />
					{data.map(d => {
						return (
							<Tabs.Trigger
								style={{
									width: tabItemWidth,
									justifyContent: 'center',
									alignItems: 'center',
									height: '100%',
								}}
								key={d.name}
							>
								<View style={{ flexDirection: 'row' }}>
									<Text variant="text-sm" sx={{ fontWeight: '700', marginRight: 4 }}>
										{d.name}
									</Text>
									<Text variant="text-sm" sx={{ fontWeight: '400' }}>
										{d.count}
									</Text>
								</View>
							</Tabs.Trigger>
						)
					})}
				</Tabs.List>
				<Tabs.Pager>
					{data.map(d => {
						return <PagerChild key={d.name} />
					})}
				</Tabs.Pager>
			</Tabs.Root>
		</View>
	)
}

const PagerChild = ({ bg }) => {
	return (
		<Tabs.ScrollView bounces={false}>
			<View style={{ height: 200, backgroundColor: bg ?? 'grey' }} />
			<View style={{ height: 300, backgroundColor: 'black' }} />
			<View style={{ height: 200, backgroundColor: bg ?? 'white' }} />
			<View style={{ height: 300, backgroundColor: 'yellow' }} />
			<View style={{ height: 200, backgroundColor: 'pink' }} />
		</Tabs.ScrollView>
	)
}

const styles = StyleSheet.create({
	box: {
		height: 100,
		width: '100%',
	},
	boxA: {
		backgroundColor: 'white',
	},
	boxB: {
		backgroundColor: '#D8D8D8',
	},
	header: {
		width: '100%',
		backgroundColor: 'white',
	},
	indicator: {
		height: 4,
		backgroundColor: '#2196f3',
		position: 'absolute',
		bottom: 0,
	},
})

export default {
	component: Tabs.Container,
	title: 'Components/Tabs',
} as Meta
