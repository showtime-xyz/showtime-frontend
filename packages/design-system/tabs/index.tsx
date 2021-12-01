import React from 'react'
import { View, StyleSheet, ListRenderItem, Text, ScrollView } from 'react-native'
import { TabBarProps, Tabs as CollapsibleTabs } from 'react-native-collapsible-tab-view'
import { MaterialTabBar } from './MaterialTabBar'

const HEADER_HEIGHT = 250

const DATA = [0, 1, 2, 3, 4]
const identity = (v: unknown): string => v + ''

const Header = () => {
	return <View style={styles.header} />
}

type TabProps = {
	tabTrigger: React.ReactNode
	tabContent: React.ReactNode
}

type TabsContainer = {
	renderHeader?: React.FC<TabBarProps>
	headerHeight?: number
	children?: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>
}

export const Tab = (_props: TabProps) => {
	return null
}

const TabsContainer = (props: TabsContainer) => {
	const newChildren = React.useMemo(
		() =>
			React.Children.map(props.children, (c, index) => {
				return (
					<CollapsibleTabs.Tab name={index.toString()} label={c.props.tabTrigger}>
						{c.props.tabContent}
					</CollapsibleTabs.Tab>
				)
			}),
		[props.children]
	)

	return (
		<CollapsibleTabs.Container
			renderHeader={props.renderHeader}
			headerHeight={props.headerHeight}
			renderTabBar={props => <MaterialTabBar {...props} scrollEnabled />}
		>
			{newChildren}
		</CollapsibleTabs.Container>
	)
}

export const Tabs: React.FC = () => {
	const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
		return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
	}, [])

	return (
		<TabsContainer renderHeader={Header} headerHeight={HEADER_HEIGHT}>
			<Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Created</Text>
						<Text>145</Text>
					</View>
				}
				tabContent={<CollapsibleTabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Owned</Text>
						<Text>78</Text>
					</View>
				}
				tabContent={
					//@ts-ignore
					<CollapsibleTabs.ScrollView>
						<View style={[styles.box, styles.boxA]} />
						<View style={[styles.box, styles.boxB]} />
					</CollapsibleTabs.ScrollView>
				}
			/>
			<Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Listed</Text>
						<Text>13</Text>
					</View>
				}
				tabContent={<CollapsibleTabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Liked</Text>
						<Text>198</Text>
					</View>
				}
				tabContent={<CollapsibleTabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
		</TabsContainer>
	)
}

const styles = StyleSheet.create({
	box: {
		height: 250,
		width: '100%',
	},
	boxA: {
		backgroundColor: 'white',
	},
	boxB: {
		backgroundColor: '#D8D8D8',
	},
	header: {
		height: HEADER_HEIGHT,
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

export const Tabsv2 = {
	Tab,
	Container: TabsContainer,
	ScrollView: CollapsibleTabs.ScrollView as unknown as typeof ScrollView,
	FlatList: CollapsibleTabs.FlatList,
	SectionList: CollapsibleTabs.SectionList,
}
