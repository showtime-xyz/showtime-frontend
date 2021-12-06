import React from 'react'
import { Meta } from '@storybook/react'
import { Dimensions, View, Image } from 'react-native'
import { Tabs } from './tablib'
import { PullToRefresh, SelectedTabIndicator, TabItem } from './tablib/components'

const Header = () => {
	const windowWidth = Dimensions.get('window').width
	return (
		<View style={[{ width: '100%' }]} pointerEvents="none">
			<Image
				source={{
					uri: 'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
				}}
				style={[{ aspectRatio: 1.49, width: windowWidth }]}
			/>
		</View>
	)
}

export const SimpleTabs: React.FC = () => {
	const onIndexChange = index => {
		console.log('index changed', index)
	}

	const data = [
		{ name: 'Created', count: 145 },
		{ name: 'Owned', count: 13 },
		{ name: 'Listed', count: 13 },
		{ name: 'Liked', count: 198 },
	]

	return (
		<View style={{ flex: 1 }}>
			<Tabs.Root onIndexChange={onIndexChange}>
				<Tabs.List
					contentContainerStyle={{
						alignItems: 'center',
					}}
					style={{
						paddingHorizontal: 10,
						backgroundColor: 'white',
						height: 55,
					}}
				>
					{data.map(d => {
						return (
							<Tabs.Trigger key={d.name}>
								<TabItem name={d.name} count={d.count} />
							</Tabs.Trigger>
						)
					})}

					{/* no-op on web */}
					<SelectedTabIndicator />
				</Tabs.List>
				<Tabs.Pager>
					<Tabs.View style={{ height: 100, backgroundColor: '#059669' }} />
					<Tabs.View style={{ height: 200, backgroundColor: '#FEF2F2' }} />
					<Tabs.View style={{ height: 300, backgroundColor: '#D1FAE5' }} />
					<Tabs.View style={{ height: 100, backgroundColor: '#2563EB' }} />
				</Tabs.Pager>
			</Tabs.Root>
		</View>
	)
}

export const TabsWithHeader: React.FC = () => {
	const onIndexChange = index => {
		console.log('index changed', index)
	}

	const onRefresh = () => {
		console.log('refresh page!')
	}

	const data = [
		{ name: 'Created', count: 145 },
		{ name: 'Owned', count: 13 },
		{ name: 'Listed', count: 13 },
		{ name: 'Liked', count: 198 },
	]

	return (
		<View style={{ flex: 1 }}>
			<Tabs.Root onIndexChange={onIndexChange} lazy>
				{/*  no-op on web */}
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
						height: 55,
					}}
				>
					{data.map(d => {
						return (
							<Tabs.Trigger key={d.name}>
								<TabItem name={d.name} count={d.count} />
							</Tabs.Trigger>
						)
					})}
					{/* no-op on web */}
					<SelectedTabIndicator />
				</Tabs.List>
				<Tabs.Pager>
					{data.map(d => {
						return (
							<Tabs.FlatList
								bounces={false}
								data={[1, 2, 3, 4, 5, 6, 99, 7, 8]}
								keyExtractor={item => item.toString()}
								key={d.name}
								renderItem={({ index }) => {
									return (
										<View
											style={{
												height: 200,
												backgroundColor: ['#059669', '#FEF2F2', '#D1FAE5'][index % 3],
											}}
										/>
									)
								}}
							/>
						)
					})}
				</Tabs.Pager>
			</Tabs.Root>
		</View>
	)
}

export default {
	component: Tabs.Root,
	title: 'Components/Tabs',
} as Meta
