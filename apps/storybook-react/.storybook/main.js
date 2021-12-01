const path = require('path')

module.exports = {
	stories: [
		'../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../../../packages/app/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../../../packages/design-system/**/*.stories.@(js|jsx|ts|tsx|mdx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		{
			name: '@storybook/addon-react-native-web',
			options: {
				modulesToTranspile: [
					'@gorhom/bottom-sheet',
					'@gorhom/portal',
					'dripsy',
					'@dripsy/core',
					'@dripsy/gradient',
					'twrnc',
					'moti',
					'@motify/components',
					'@motify/core',
					'@motify/skeleton',
					'@motify/interactions',
					'expo-next-react-navigation',
					'@zeego/menu',
					'@zeego/dropdown-menu',
					'react-native-reanimated',
					'@react-navigation/native',
					'expo-linear-gradient',
				],
				babelPlugins: ['react-native-reanimated/plugin'],
			},
		},
	],
	core: {
		builder: 'webpack5',
	},
	typescript: { reactDocgen: false },
}
