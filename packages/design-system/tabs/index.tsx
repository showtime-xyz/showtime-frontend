import React from 'react'
import { ScrollView } from 'react-native'
import { TabBarProps, Tabs as CollapsibleTabs } from 'react-native-collapsible-tab-view'
import { TAB_BAR_HEIGHT } from './MaterialTabBar/TabBar'
import { MaterialTabBar } from './MaterialTabBar'

type TabProps = {
	tabTrigger: React.ReactNode
	tabContent: React.ReactNode
}

type TabsContainer = {
	/**
	 * Render a custom Header component
	 */
	renderHeader?: React.FC<TabBarProps>
	/**
	 * Is optional, but will optimize the first render.
	 */
	headerHeight?: number
	children?: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>
	/**
	 * Whether tab content should be lazily mounted
	 * @default true
	 */
	lazy?: boolean
	/**
	 * Header minimum height when collapsed
	 */
	minHeaderHeight?: number
	/**
	 * Header minimum height when collapsed
	 *  @default 64
	 */
	tabBarHeight?: number
}

export const Tab = (_props: TabProps) => {
	return null
}

const TabsContainer = (props: TabsContainer) => {
	const newChildren = React.useMemo(
		() =>
			React.Children.map(props.children, (c, index) => {
				return (
					<CollapsibleTabs.Tab
						name={index.toString()}
						//@ts-ignore we're using this label field to render custom component
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
			cancelLazyFadeIn
			renderTabBar={TabBar}
			minHeaderHeight={props.minHeaderHeight}
			tabBarHeight={TAB_BAR_HEIGHT}
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
