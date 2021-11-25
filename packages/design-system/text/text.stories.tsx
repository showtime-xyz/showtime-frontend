import React from 'react'
import { Meta } from '@storybook/react'

import { Text } from './index'

export default {
	component: Text,
	title: 'Components/Text',
} as Meta

export const TextXS: React.VFC<{}> = () => <Text variant="text-xs">Hello World</Text>

export const TextSM: React.VFC<{}> = () => <Text variant="text-sm">Hello World</Text>

export const TextBase: React.VFC<{}> = () => <Text variant="text-base">Hello World</Text>

export const TextLG: React.VFC<{}> = () => <Text variant="text-lg">Hello World</Text>

export const TextXL: React.VFC<{}> = () => <Text variant="text-xl">Hello World</Text>

export const Text2XL: React.VFC<{}> = () => <Text variant="text-2xl">Hello World</Text>

export const Text3XL: React.VFC<{}> = () => <Text variant="text-3xl">Hello World</Text>

export const Text4XL: React.VFC<{}> = () => <Text variant="text-4xl">Hello World</Text>
