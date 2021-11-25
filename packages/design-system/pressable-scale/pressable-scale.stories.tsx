import React from 'react'
import { Meta } from '@storybook/react'

import { Pressable } from './index'
import { Text } from '../text'

export default {
	component: Pressable,
	title: 'Components/PressableScale',
} as Meta

export const Primary: React.VFC<{}> = () => (
	<Pressable tw="bg-black text-white p-2 rounded-full text-center">
		<Text>Press Me</Text>
	</Pressable>
)
