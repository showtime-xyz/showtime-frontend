import * as React from 'react'
import { useWindowDimensions } from 'react-native'
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

const FirstRoute = () => (
	<View style={{ backgroundColor: '#ff4081', flex: 1 }}>
		<Text>hello</Text>
	</View>
)

const SecondRoute = () => (
	<View style={{ backgroundColor: '#673ab7', flex: 1 }}>
		<Text>hello 22</Text>
	</View>
)

const renderScene = SceneMap({
	created: FirstRoute,
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
		const isSelected = props.navigationState.routes[props.navigationState.index].key === props.route.key

		return (
			<Pressable
				onPress={props.onPress}
				{...props}
				sx={{
					marginY: 10,
					paddingY: 4,
					width: TAB_BAR_WIDTH,
					borderRadius: 999,
					backgroundColor: isSelected ? '#E4E4E7' : undefined,
				}}
			>
				<View
					sx={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						paddingY: 8,
						paddingX: 16,
					}}
				>
					<Text style={{ fontWeight: '700', fontSize: 14, marginRight: 2 }}>{props.route.title}</Text>
					<Text style={{ fontWeight: '500', fontSize: 14 }}>{props.route.subtitle}</Text>
				</View>
			</Pressable>
		)
	}, [])

	const CustomTabBar = React.useCallback((props: any) => {
		return (
			<TabBar
				{...props}
				renderTabBarItem={TabBarItem}
				tabStyle={{ width: TAB_BAR_WIDTH }}
				indicatorStyle={{ backgroundColor: '#18181B' }}
				indicatorContainerStyle={{ borderBottomWidth: 1 }}
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
			swipeEnabled={false}
			renderTabBar={CustomTabBar}
			lazy
		/>
	)
}

type TabsRootProps = {
	children: Array<typeof TabsList | typeof TabsContent>
} & TabsContextValue

export const TabsRoot = (props: TabsRootProps) => {
	const tabRoutes = []
	// React.Children.forEach(child => {})
}
// API
/* 
<Tabs>
    <Tabs.List>

</Tabs> 
*/
