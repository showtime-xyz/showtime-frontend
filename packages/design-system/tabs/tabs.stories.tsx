import React from 'react'
import { Meta } from '@storybook/react'
import { Tabs } from './index'
import { Text } from '../text'
import { Dimensions, Image, StyleSheet, View } from 'react-native'

const DATA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

const identity = (v: unknown): string => v + ''

export const ScrollableTabs: React.FC = () => {
	const renderItem: any = React.useCallback(({ index }) => {
		return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
	}, [])

	return (
		<Tabs.Container>
			{[
				{ name: 'Created', count: 145 },
				{ name: 'Owned', count: 13 },
				{ name: 'Listed', count: 13 },
				{ name: 'Liked', count: 198 },
			].map(a => {
				return (
					<Tabs.Tab
						key={a.name}
						tabTrigger={
							<View style={{ flexDirection: 'row' }}>
								<Text variant="text-sm" sx={{ fontWeight: '700', marginRight: 4 }}>
									{a.name}
								</Text>
								<Text variant="text-sm" sx={{ fontWeight: '400' }}>
									{a.count}
								</Text>
							</View>
						}
						tabContent={<Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
					/>
				)
			})}
		</Tabs.Container>
	)
}

export const TabsWithHeader: React.FC = () => {
	const renderItem: any = React.useCallback(({ index }) => {
		return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
	}, [])

	const Header = () => {
		return (
			<View style={styles.header} pointerEvents="none">
				<Image
					source={{
						uri: 'https://images.unsplash.com/photo-1559065188-2537766d864b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
					}}
					style={{ width: Dimensions.get('window').width, aspectRatio: 1.49 }}
				/>
			</View>
		)
	}

	return (
		<Tabs.Container renderHeader={Header}>
			{[
				{ name: 'Created', count: 145 },
				{ name: 'Owned', count: 13 },
				{ name: 'Listed', count: 13 },
				{ name: 'Liked', count: 198 },
			].map(a => {
				return (
					<Tabs.Tab
						key={a.name}
						tabTrigger={
							<View style={{ flexDirection: 'row' }}>
								<Text variant="text-sm" sx={{ fontWeight: '700', marginRight: 4 }}>
									{a.name}
								</Text>
								<Text variant="text-sm" sx={{ fontWeight: '400' }}>
									{a.count}
								</Text>
							</View>
						}
						tabContent={<Tabs.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
					/>
				)
			})}
		</Tabs.Container>
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
