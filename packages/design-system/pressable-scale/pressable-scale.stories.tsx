import React from 'react'
import { Meta } from '@storybook/react'

import { Pressable } from './index'

export default {
	component: Pressable,
	title: 'Components/PressableScale',
} as Meta

export const Primary: React.VFC<{}> = () => (
	<Pressable tw="bg-black text-white p-2 rounded-full text-center">Press Me</Pressable>
)
