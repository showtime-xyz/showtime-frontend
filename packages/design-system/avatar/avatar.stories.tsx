import { Meta } from '@storybook/react'
import { useIsDarkMode } from '../hooks'
import { View } from '../view'

import { Avatar } from './index'

export default {
	component: Avatar,
	title: 'Components/Avatar',
} as Meta

const Container = (props: any) => {
	const isDark = useIsDarkMode()
	return <View tw={isDark ? 'bg-gray-900 p-10' : 'bg-gray-100 p-10'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => (
	<Container>
		<Avatar
			avatarUrl="https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1"
			showTokenIcon
		/>
	</Container>
)
