import React from 'react'
import { Meta } from '@storybook/react'
import { Text } from '../text'
import { Dimensions, Image, StyleSheet, View, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs } from './tablib'
import { NativeViewGestureHandler, PanGestureHandler } from 'react-native-gesture-handler'

const DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const headerHeight = 240
const tabbarHeight = 50
const tabItemWidth = 100

const Header = () => {
	return (
		<View style={{ width: '100%', height: headerHeight }} pointerEvents="none">
			<Image
				source={{
					uri:
						'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
				}}
				style={{ width: Dimensions.get('window').width, aspectRatio: 1.49 }}
			/>
		</View>
	)
}

const identity = (v: unknown): string => v + ''

export const ScrollableTabs: React.FC = () => {
	const [index, setIndex] = React.useState(0)

	const onIndexChange = () => {}
	const [refreshing, setRefreshing] = React.useState(false)

	const onRefresh = () => {
		setRefreshing(true)
		setTimeout(() => {
			setRefreshing(false)
		}, 4000)
	}

	return (
		<SafeAreaView style={{ flex: 1, marginTop: 45 }}>
			<Tabs.Root
				Header={Header}
				headerHeight={headerHeight}
				tabBarHeight={tabbarHeight}
				onIndexChange={onIndexChange}
				tabItemWidth={tabItemWidth}
			>
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
		</SafeAreaView>
	)
}

const PagerChild = ({ bg }) => {
	const ref = React.useRef()
	const nativeRef = React.useRef()

	return (
		<PanGestureHandler
			ref={ref}
			onGestureEvent={e => {
				console.log('ee ', e.nativeEvent.translationY)
			}}
			// failOffsetX={[-100, 100]}
			activeOffsetY={40}
			simultaneousHandlers={[ref, nativeRef]}
		>
			<NativeViewGestureHandler ref={nativeRef}>
				<Tabs.ScrollView bounces={false}>
					<View style={{ height: 200, backgroundColor: bg ?? 'pink' }} />
					<View style={{ height: 300, backgroundColor: 'yellow' }} />
					<View style={{ height: 200, backgroundColor: bg ?? 'pink' }} />
					<View style={{ height: 300, backgroundColor: 'yellow' }} />
					<View style={{ height: 200, backgroundColor: 'pink' }} />
				</Tabs.ScrollView>
			</NativeViewGestureHandler>
		</PanGestureHandler>
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
