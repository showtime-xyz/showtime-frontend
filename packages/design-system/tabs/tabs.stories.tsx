import React, { useContext, useEffect } from 'react'
import { Meta } from '@storybook/react'
import { Text } from '../text'
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from 'react-native'
import { Tabs } from './tablib'
import { NativeViewGestureHandler, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedReaction,
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	runOnJS,
} from 'react-native-reanimated'
import { Animated as OldAnimated } from 'react-native'
import { TabContext } from './tablib'

const tabbarHeight = 50
const tabItemWidth = 100

const Header = () => {
	return (
		<Animated.View style={[{ width: '100%' }]} pointerEvents="none">
			<Image
				source={{
					uri:
						'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
				}}
				style={{ width: Dimensions.get('window').width, aspectRatio: 1.49 }}
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
				{ position: 'absolute', height: 2, backgroundColor: 'yellow', width: tabItemWidth, bottom: 0 },
				{ transform: [{ translateX }] },
			]}
		/>
	)
}

const PullToRefresh = () => {
	const { pullToRefreshY, refreshGestureState } = useContext(TabContext)
	const [refreshState, setRefreshState] = React.useState('idle')

	const onRefresh = () => {
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
			onRefresh()
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
					top: 40,
				},
			]}
			pointerEvents="none"
		>
			{refreshState === 'pulling' && <Text>Release to refresh</Text>}
			{refreshState === 'cancelling' && <Text>Pull to refresh</Text>}
			{refreshState === 'refreshing' && <ActivityIndicator color="black" size="large" />}
		</Animated.View>
	)
}

export const ScrollableTabs: React.FC = () => {
	const onIndexChange = () => {}
	const [refreshing, setRefreshing] = React.useState(false)

	const onRefresh = () => {
		setRefreshing(true)
		setTimeout(() => {
			setRefreshing(false)
		}, 4000)
	}

	return (
		<View style={{ flex: 1 }}>
			<Tabs.Root tabBarHeight={tabbarHeight} onIndexChange={onIndexChange}>
				<Tabs.Header>
					<Header />
				</Tabs.Header>

				<PullToRefresh />

				<Tabs.List>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>1</Text>
					</Tabs.Trigger>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>2</Text>
					</Tabs.Trigger>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>3</Text>
					</Tabs.Trigger>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>4</Text>
					</Tabs.Trigger>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>5</Text>
					</Tabs.Trigger>
					<Tabs.Trigger style={{ height: 50, width: tabItemWidth, backgroundColor: 'white', borderWidth: 1 }}>
						<Text>6</Text>
					</Tabs.Trigger>
					<Indicator />
				</Tabs.List>
				<Tabs.Pager>
					<PagerChild />
					<PagerChild bg={'black'} />
					<PagerChild bg={'grey'} />
					<PagerChild bg={'purple'} />
					<PagerChild bg={'brown'} />
					<PagerChild bg={'green'} />
				</Tabs.Pager>
			</Tabs.Root>
		</View>
	)
}

const PagerChild = ({ bg }) => {
	return (
		<Tabs.ScrollView bounces={false}>
			<View style={{ height: 200, backgroundColor: bg ?? 'pink' }} />
			<View style={{ height: 300, backgroundColor: 'yellow' }} />
			<View style={{ height: 200, backgroundColor: bg ?? 'pink' }} />
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
