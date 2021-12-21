import { Meta } from '@storybook/react'

import { Modal } from './index'
import { useState } from 'react'
import { View } from '../view'
import { Button } from '../button'
import { Text } from '../text'

export default {
	component: Modal,
	title: 'Components/Modal',
} as Meta

const Container = (props: any) => {
	return <View tw={'dark:bg-gray-100 p-10 bg-white'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => {
	const [visible, setVisible] = useState(false)
	return (
		<Container>
			<Button onPress={() => setVisible(!visible)}>
				<Text tw="text-white dark:text-black">Open modal</Text>
			</Button>
			{visible && (
				<Modal title="Modal" close={() => setVisible(false)}>
					<View>
						<Text tw="dark:text-white text-black">Hello world</Text>
					</View>
				</Modal>
			)}
		</Container>
	)
}
