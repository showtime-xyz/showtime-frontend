import { Meta } from '@storybook/react'
import { View } from '../view'
import { Text } from '../text'
import { Accordion } from './index'

export default {
	component: Accordion.Root,
	title: 'Components/Accordion',
} as Meta

const Container = (props: any) => {
	return (
		<View tw={' bg-gray-100 dark:bg-gray-900 p-10'} style={{ flex: 1 }}>
			{props.children}
		</View>
	)
}

export const Basic: React.VFC<{}> = () => (
	<Container>
		<Accordion.Root>
			<Accordion.Item value="hello" tw="mb-4">
				<Accordion.Trigger>
					<Accordion.Label>Label</Accordion.Label>
				</Accordion.Trigger>
				<Accordion.Content>
					<Text tw="dark:text-white text-gray-900">
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
						the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type and scrambled it to make a type specimen book. It has survived not only five centuries
					</Text>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="world">
				<Accordion.Trigger>
					<Accordion.Label>Label</Accordion.Label>
				</Accordion.Trigger>
				<Accordion.Content>
					<Text tw="dark:text-white text-gray-900">
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
						the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type and scrambled it to make a type specimen book. It has survived not only five centuries
					</Text>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Container>
)
