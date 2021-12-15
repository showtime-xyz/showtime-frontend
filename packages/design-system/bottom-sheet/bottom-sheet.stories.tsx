import { Meta } from '@storybook/react'

import { BottomSheet } from './index'
import { useState } from 'react'
import { View } from '../view'
import { Button } from '../button'
import { Text } from '../text'

export default {
	component: BottomSheet,
	title: 'Components/BottomSheetScale',
} as Meta

const Container = (props: any) => {
	return <View tw={'dark:bg-gray-900 p-10 bg-white'}>{props.children}</View>
}

export const Basic: React.VFC<{}> = () => {
	const [visible, setVisible] = useState(false)
	return (
		<Container>
			<Button onPress={() => setVisible(!visible)}>
				<Text>Open bottom sheet</Text>
			</Button>
			<BottomSheet visible={visible} onDismiss={() => setVisible(false)} />
		</Container>
	)
}
