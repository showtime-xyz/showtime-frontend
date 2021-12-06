import React from 'react'
import { Meta } from '@storybook/react'

import { Pressable } from './index'
import { Text } from '../text'

export default {
	component: Pressable,
	title: 'Components/PressableScale',
} as Meta

export const Primary: React.VFC<{}> = () => (
	<Pressable tw="bg-purple-900 p-4 rounded-full w-auto">
		<Text tw="text-white text-center">Press Me</Text>
	</Pressable>
)
