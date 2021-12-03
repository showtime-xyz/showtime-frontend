import React from 'react'
import { ScrollView, FlatList, SectionList } from 'react-native'
import { styles as tabBarStyles } from './MaterialTabBar/TabBar'
import { styles as tabItemStyles } from './MaterialTabBar/TabItem'
import { Tab } from './index'
import { TAB_BAR_ACTIVE_BG } from './MaterialTabBar/Indicator'
import { View } from '../view'
import * as RadixTabs from '@radix-ui/react-tabs'

const radixTriggerStyle = { position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }

export function makeRenderFunction(ComponentOrMemo) {
	return typeof ComponentOrMemo === 'function'
		? ComponentOrMemo
		: ComponentOrMemo && typeof ComponentOrMemo === 'object'
		? props => /*#__PURE__*/ React.createElement(ComponentOrMemo, props)
		: undefined
}

const TabsContainer = props => {
	const [selected, setSelected] = React.useState(props.defaultValue ?? '0')

	const { tabTriggers, tabContents, values } = React.useMemo(() => {
		let tabTriggers = []
		let tabContents = []
		let values = []

		React.Children.forEach(props.children, c => {
			tabTriggers.push(c.props.tabTrigger)
			tabContents.push(c.props.tabContent)
			values.push(c.props.value)
		})

		return { tabTriggers, tabContents, values }
	}, [props.children])

	const Header = React.useMemo(() => {
		return makeRenderFunction(props.renderHeader)
	}, [props.renderHeader])

	return (
		<>
			{Header && <Header />}
			<RadixTabs.Root value={selected} onValueChange={setSelected}>
				<RadixTabs.List aria-label={props.accessibilityLabel} asChild>
					<ScrollView contentContainerStyle={tabBarStyles.contentContainer}>
						{tabTriggers.map((t, index) => {
							const value = values[index] ?? index.toString()
							return (
								<RadixTabs.Trigger value={value} key={value} style={radixTriggerStyle}>
									<View
										style={tabItemStyles.tabItem}
										sx={{
											backgroundColor: selected === value ? TAB_BAR_ACTIVE_BG : undefined,
											borderRadius: 999,
										}}
									>
										{t}
									</View>
									{selected === value && (
										<View
											tw="bg-gray-900"
											sx={{
												height: 2,
												width: '100%',
												position: 'absolute',
												bottom: 0,
											}}
										/>
									)}
								</RadixTabs.Trigger>
							)
						})}
					</ScrollView>
				</RadixTabs.List>
				{tabContents.map((c, index) => {
					const value = values[index] ?? index.toString()
					return (
						<RadixTabs.Content key={value} value={value}>
							{c}
						</RadixTabs.Content>
					)
				})}
			</RadixTabs.Root>
		</>
	)
}

export const Tabs = {
	Tab,
	Container: TabsContainer,
	ScrollView: ScrollView,
	FlatList: FlatList,
	SectionList: SectionList,
}
