import React from 'react'
import { ScrollView } from 'react-native'
import { Tabs as CollapsibleTabs } from 'react-native-collapsible-tab-view'
import { TAB_BAR_HEIGHT } from './MaterialTabBar/TabBar'
import { MaterialTabBar } from './MaterialTabBar'
import { TabProps, TabsContainerProps } from './types'

export const Tab = (_props: TabProps) => {
	return null
}

const TabsContainer = (props: TabsContainerProps) => {
	const newChildren = React.useMemo(
		() =>
			React.Children.map(props.children, (c, index) => {
				return (
					<CollapsibleTabs.Tab
						name={c.props.value ?? index.toString()}
						//@ts-ignore - we're using this label field to render custom component
						label={c.props.tabTrigger}
					>
						{c.props.tabContent}
					</CollapsibleTabs.Tab>
				)
			}),
		[props.children]
	)

	const TabBar = React.useCallback(props => <MaterialTabBar {...props} scrollEnabled />, [])

	return (
		<CollapsibleTabs.Container
			renderHeader={props.renderHeader}
			headerHeight={props.headerHeight}
			lazy={props.lazy ?? true}
			// pagerProps={{ scrollEnabled: false }}
			renderTabBar={TabBar}
			minHeaderHeight={props.minHeaderHeight}
			tabBarHeight={TAB_BAR_HEIGHT}
			initialTabName={props.defaultValue}
		>
			{newChildren}
		</CollapsibleTabs.Container>
	)
}

export const Tabs = {
	Tab,
	Container: TabsContainer,
	ScrollView: CollapsibleTabs.ScrollView as unknown as typeof ScrollView,
	FlatList: CollapsibleTabs.FlatList,
	SectionList: CollapsibleTabs.SectionList,
}
