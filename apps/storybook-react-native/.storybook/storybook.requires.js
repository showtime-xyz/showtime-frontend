/* do not change this file, it is auto generated by storybook. */

import { configure, addDecorator, addParameters, addArgsEnhancer } from '@storybook/react-native'

import { decorators, parameters } from './preview'

if (decorators) {
	decorators.forEach(decorator => addDecorator(decorator))
}

if (parameters) {
	addParameters(parameters)
}

const getStories = () => {
	return [
		require('../../../packages/design-system/pressable-scale/pressable-scale.stories.tsx'),
		require('../../../packages/design-system/tabs/tabs.stories.tsx'),
		require('../../../packages/design-system/skeleton/skeleton.stories.tsx'),
		require('../../../packages/design-system/text/text.stories.tsx'),
	]
}

configure(getStories, module, false)
