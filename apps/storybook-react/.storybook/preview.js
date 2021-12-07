import '../styles/globals.css'

import React from 'react'
import * as NextImage from 'next/image'
import { DripsyProvider } from 'dripsy'
import { useDeviceContext } from 'twrnc'

import { theme } from 'design-system/theme'
import { tw } from 'design-system/tailwind'

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

const TailwindDeviceContextProvider = ({ children }) => {
	useDeviceContext(tw)

	return children
}

export const decorators = [
	Story => (
		<TailwindDeviceContextProvider>
			<DripsyProvider theme={theme}>
				<Story />
			</DripsyProvider>
		</TailwindDeviceContextProvider>
	),
]
