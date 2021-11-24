import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds'
import { DripsyProvider } from 'dripsy'
import { theme } from 'design-system/theme'

export const decorators = [
	withBackgrounds,
	Story => (
		<DripsyProvider theme={theme}>
			<Story />
		</DripsyProvider>
	),
]
export const parameters = {
	backgrounds: [
		{ name: 'plain', value: 'white', default: true },
		{ name: 'warm', value: 'hotpink' },
		{ name: 'cool', value: 'deepskyblue' },
	],
}
