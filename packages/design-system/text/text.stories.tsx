import React from 'react'
import { Meta } from '@storybook/react'

import { Text } from './index'

export default {
	component: Text,
	title: 'Components/Text',
} as Meta

export const Small: React.VFC<{}> = () => <Text variant="small">Hello World</Text>

export const Body: React.VFC<{}> = () => <Text variant="body">Hello World</Text>

export const Heading: React.VFC<{}> = () => <Text variant="heading">Hello World</Text>

export const Title: React.VFC<{}> = () => <Text variant="title">Hello World</Text>
