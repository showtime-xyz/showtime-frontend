import { Meta } from '@storybook/react'

import { Toast } from './index'
import { Button } from 'design-system/button'
import { Text } from 'design-system/text'
import { View } from 'design-system/view'
import { Spinner } from 'design-system/spinner'

export default {
	component: Spinner,
	title: 'Components/Toast',
} as Meta

export const Primary: React.VFC<{}> = () => {
	return (
		<View>
			<Button onPress={() => Toast.current.show({ message: 'Gm friends!', hideAfter: 4000 })}>
				<Text tw="text-white dark:text-black">Text toast</Text>
			</Button>
			<View tw="my-4"></View>
			<Button
				onPress={() => {
					Toast.current.show({
						element: (
							<View tw="flex-row items-center p-5">
								<Spinner size={20} />
								<View tw="mx-1" />
								<Text tw="dark:text-white text-black">This toast will hide in 5 seconds.</Text>
							</View>
						),
					})

					setTimeout(() => {
						Toast.current.hide()
					}, 5000)
				}}
			>
				<Text tw="text-white dark:text-black">Custom rendered toast</Text>
			</Button>
		</View>
	)
}
