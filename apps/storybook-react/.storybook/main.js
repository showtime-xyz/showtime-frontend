const path = require('path')

module.exports = {
	stories: [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
		'../../../packages/app/**/*.stories.@(js|jsx|ts|tsx)',
		'../../../packages/design-system/**/*.stories.@(js|jsx|ts|tsx)',
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
	babel: async options => ({
		...options,
		presets: [...options.presets, ['babel-preset-expo', { jsxRuntime: 'automatic' }]],
	}),
	webpackFinal: async config => {
		const { withUnimodules } = require('@expo/webpack-config/addons')

		return withUnimodules(config, {
			babel: {
				dangerouslyAddModulePathsToTranspile: ['design-system'],
			},
		})
	},
}
