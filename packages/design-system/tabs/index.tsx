import * as React from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import { Pressable } from '../pressable-scale'
import { View } from '../view'
import { Text } from '../text'
import { TabView, SceneMap, SceneRendererProps, NavigationState, TabBar, TabBarItemProps } from 'react-native-tab-view'

// fix width is required for indicator scroll animation!
const TAB_BAR_WIDTH = 120

type TabsContextValue = {
	value: null | string
	onValueChange: (value: string) => void
}

const TabsRootContext = React.createContext<TabsContextValue | null>(null)

type TabTriggerProps = {
	value: string
	children: React.ReactNode
}

const TabTrigger = (props: TabTriggerProps) => {
	return props.children
}

type TabsListProps = {
	children: Array<typeof TabTrigger> | typeof TabTrigger
}

const TabsList = (_props: TabsListProps) => {
	return null
}

type TabsContentProps = {
	children: React.ReactNode
	value: string
}

const TabsContent = (_props: TabsContentProps) => {
	return null
}

TabsContent.displayName = 'TabsContent'

TabsList.displayName = 'TabsList'
TabsContent.displayName = 'TabsContent'

const SecondRoute = () => <View tw="bg-gray-200" style={{ flex: 1 }}></View>

const getTranslateX = (position: Animated.AnimatedInterpolation, routes: any) => {
	const inputRange = routes.map((_, i) => i)

	const outputRange = inputRange.map(index => index * TAB_BAR_WIDTH)

	const translateX = position.interpolate({
		inputRange,
		outputRange,
		extrapolate: 'clamp',
	})

	return translateX
}

const renderScene = SceneMap({
	created: SecondRoute,
	owned: SecondRoute,
	listed: SecondRoute,
	liked: SecondRoute,
})

type TabParam = { key: string; title: string; subtitle: string }

export function Tabs() {
	const layout = useWindowDimensions()

	const [index, setIndex] = React.useState(0)
	const [routes] = React.useState<Array<TabParam>>([
		{ key: 'created', title: 'Created', subtitle: '145' },
		{ key: 'owned', title: 'Owned', subtitle: '78' },
		{ key: 'listed', title: 'Listed', subtitle: '13' },
		{ key: 'liked', title: 'Liked', subtitle: '14' },
	])

	const TabBarItem = React.useCallback((props: TabBarItemProps<TabParam>) => {
		return (
			<Pressable
				onPress={props.onPress}
				{...props}
				sx={{
					marginY: 16,
				}}
			>
				<View
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						paddingY: 8,
						paddingX: 16,
						width: TAB_BAR_WIDTH,
					}}
				>
					<Text style={{ fontWeight: '700', fontSize: 14, marginRight: 2 }}>{props.route.title}</Text>
					<Text style={{ fontWeight: '500', fontSize: 14 }}>{props.route.subtitle}</Text>
				</View>
			</Pressable>
		)
	}, [])

	const renderIndicator = React.useCallback(props => {
		const { position, navigationState } = props
		const { routes } = navigationState
		const transform = []
		const translateX = getTranslateX(position, routes)

		transform.push({ translateX })

		return (
			<>
				<Animated.View
					pointerEvents="none"
					style={{
						height: 35,
						top: 12,
						width: TAB_BAR_WIDTH,
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
						position: 'absolute',
						borderRadius: 999,
						zIndex: 1,
						transform,
					}}
				/>
				<Animated.View
					pointerEvents="none"
					style={{
						height: 2,
						bottom: 0,
						width: TAB_BAR_WIDTH,
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						position: 'absolute',
						zIndex: 1,
						transform,
					}}
				/>
			</>
		)
	}, [])

	const CustomTabBar = React.useCallback((props: any) => {
		return (
			<TabBar
				{...props}
				renderIndicator={renderIndicator}
				renderTabBarItem={TabBarItem}
				tabStyle={{ width: TAB_BAR_WIDTH }}
				indicatorStyle={{ backgroundColor: '#18181B' }}
				style={{ backgroundColor: 'white' }}
				scrollEnabled
			/>
		)
	}, [])

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={{ width: layout.width }}
			renderTabBar={CustomTabBar}
			lazy
		/>
	)
}
