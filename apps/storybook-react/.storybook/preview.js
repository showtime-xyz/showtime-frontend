import '../styles/globals.css'

import * as NextImage from 'next/image'
import { DripsyProvider } from 'dripsy'
import { useDeviceContext } from 'twrnc'

import { theme } from 'design-system/theme'
import { tw } from 'design-system/tailwind'
import { View } from 'design-system/view'

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

	return <View tw="flex-1 h-[95vh] justify-center dark:bg-gray-900">{children}</View>
}

export const decorators = [
	Story => (
		<DripsyProvider theme={theme}>
			<TailwindDeviceContextProvider>
				<Story />
			</TailwindDeviceContextProvider>
		</DripsyProvider>
	),
]
