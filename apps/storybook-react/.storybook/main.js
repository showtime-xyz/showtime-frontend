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
					'node_modules/@gorhom/bottom-sheet',
					'node_modules/@gorhom/portal',
					'node_modules/dripsy',
					'node_modules/@dripsy/core',
					'node_modules/@dripsy/gradient',
					'node_modules/twrnc',
					'node_modules/moti',
					'node_modules/@motify/components',
					'node_modules/@motify/core',
					'node_modules/@motify/skeleton',
					'node_modules/@motify/interactions',
					'node_modules/expo-next-react-navigation',
					'node_modules/@zeego/menu',
					'node_modules/@zeego/dropdown-menu',
					'node_modules/react-native-reanimated',
					'node_modules/@react-navigation/native',
					'node_modules/expo-linear-gradient',
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
