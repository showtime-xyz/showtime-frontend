import '../styles/globals.css'

import React from 'react'
import * as NextImage from 'next/image'
import { DripsyProvider } from 'dripsy'

import { theme } from 'design-system/theme'

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
	configurable: true,
	value: props => <OriginalNextImage {...props} unoptimized />,
})

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

export const decorators = [
	Story => (
		<DripsyProvider theme={theme}>
			<Story />
		</DripsyProvider>
	),
]
