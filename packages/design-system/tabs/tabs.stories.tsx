import React from 'react'
import { Meta } from '@storybook/react'
import { Tabsv2 } from './index'
import { Text } from '../text'
import { StyleSheet, View } from 'react-native'

const DATA = [0, 1, 2, 3, 4]
const identity = (v: unknown): string => v + ''

export const ScrollableTabs: React.FC = () => {
	const renderItem: any = React.useCallback(({ index }) => {
		return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
	}, [])

	return (
		<Tabsv2.Container>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Created</Text>
						<Text>145</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Owned</Text>
						<Text>78</Text>
					</View>
				}
				tabContent={
					<Tabsv2.ScrollView>
						<View style={[styles.box, styles.boxA]} />
						<View style={[styles.box, styles.boxB]} />
					</Tabsv2.ScrollView>
				}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Listed</Text>
						<Text>13</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Liked</Text>
						<Text>198</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
		</Tabsv2.Container>
	)
}

export const TabsWithHeader: React.FC = () => {
	const renderItem: any = React.useCallback(({ index }) => {
		return <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
	}, [])

	const Header = () => {
		return <View style={styles.header} />
	}

	return (
		<Tabsv2.Container renderHeader={Header}>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Created</Text>
						<Text>145</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Owned</Text>
						<Text>78</Text>
					</View>
				}
				tabContent={
					<Tabsv2.ScrollView>
						<View style={[styles.box, styles.boxA]} />
						<View style={[styles.box, styles.boxB]} />
					</Tabsv2.ScrollView>
				}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Listed</Text>
						<Text>13</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
			<Tabsv2.Tab
				tabTrigger={
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ marginRight: 4, fontWeight: '600' }}>Liked</Text>
						<Text>198</Text>
					</View>
				}
				tabContent={<Tabsv2.FlatList data={DATA} renderItem={renderItem} keyExtractor={identity} />}
			/>
		</Tabsv2.Container>
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
		height: 200,
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
	component: Tabsv2.Container,
	title: 'Components/Tabs',
} as Meta
