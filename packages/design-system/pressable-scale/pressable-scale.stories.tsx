import React from 'react'
import { Meta } from '@storybook/react'
import { DripsyProvider } from 'dripsy'

import { Pressable } from './index'
import { Text } from '../text'
import { theme } from '../theme'

export default {
	component: Pressable,
	title: 'Components/PressableScale',
} as Meta

export const Primary: React.VFC<{}> = () => (
	<Pressable tw="bg-black p-2 rounded-full text-center">
		<Text sx={{ color: 'white' }}>Press Me</Text>
	</Pressable>
)
