import React from 'react'
import { ScrollView, FlatList, SectionList, View } from 'react-native'
import * as RadixTabs from '@radix-ui/react-tabs'
import { TabRootProps } from './types'

const radixTriggerStyle = { position: 'relative', height: '100%', display: 'flex', alignItems: 'center' } as const

const Root = ({ children, initialIndex = 0, onIndexChange: onIndexChangeProp, accessibilityLabel }: TabRootProps) => {
	const [selected, setSelected] = React.useState(initialIndex.toString() ?? '0')

	const onIndexChange = v => {
		onIndexChangeProp(parseInt(v))
		setSelected(v)
	}

	const { tabTriggers, tabContents, headerChild } = React.useMemo(() => {
		let tabTriggers = []
		let tabContents = []
		let headerChild
		React.Children.forEach(children, c => {
			if (React.isValidElement(c)) {
				//@ts-ignore
				if (c.type === List) {
					//@ts-ignore
					React.Children.map(c.props.children, c => {
						if (React.isValidElement(c) && c) {
							tabTriggers.push(c)
						}
					})
					//@ts-ignore
				} else if (c.type === Header) {
					headerChild = c
					//@ts-ignore
				} else if (c.type === Pager) {
					//@ts-ignore
					React.Children.map(c.props.children, c => {
						tabContents.push(c)
					})
				}
			}
		})
		return { tabTriggers, headerChild, tabContents }
	}, [children])

	return (
		<>
			{headerChild}
			<RadixTabs.Root value={selected} onValueChange={onIndexChange} activationMode="manual">
				<RadixTabs.List aria-label={accessibilityLabel} asChild>
					<ScrollView
						contentContainerStyle={{
							flexDirection: 'row',
							flexWrap: 'nowrap',
							alignItems: 'center',
							paddingHorizontal: 10,
						}}
					>
						{tabTriggers.map((t, index) => {
							const value = index.toString()
							return (
								<RadixTabs.Trigger value={value} key={value} style={radixTriggerStyle}>
									<View
										style={{
											alignItems: 'center',
											borderBottomWidth: 2,
											borderBottomColor: selected === value ? 'black' : 'transparent',
											paddingVertical: 8,
										}}
									>
										<View
											style={{
												backgroundColor: selected === value ? 'rgba(0,0, 0, 0.1)' : undefined,
												borderRadius: 999,
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
												paddingHorizontal: 12,
												paddingVertical: 12,
											}}
										>
											{t}
										</View>
									</View>
								</RadixTabs.Trigger>
							)
						})}
					</ScrollView>
				</RadixTabs.List>
				{tabContents.map((c, index) => {
					const value = index.toString()
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

const Header = props => {
	return props.children
}

const List = () => {
	return null
}

const Pager = () => {
	return null
}

const Trigger = React.forwardRef((props: any, ref: any) => {
	return <View {...props} ref={ref} />
})

export const Tabs = {
	Root,
	Header,
	Pager,
	ScrollView: ScrollView,
	FlatList: FlatList,
	SectionList: SectionList,
	Trigger,
	View,
	List,
}
