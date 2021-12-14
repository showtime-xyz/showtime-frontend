import { Meta } from '@storybook/react'

import { Spinner } from './index'
import { View } from '../view'

export default {
	component: Spinner,
	title: 'Components/Spinner',
} as Meta

const Container = (props: any) => {
	return <View tw={'dark:bg-gray-900 p-10 bg-white'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => (
	<Container>
		<Spinner />
	</Container>
)
