module.exports = {
	stories: [
		'../stories/**/*.stories.mdx',
		'../stories/**/*.stories.@(js|jsx|ts|tsx)',
		'../../../packages/app/**/*.stories.@(js|jsx|ts|tsx)',
		'../../../packages/design-system/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-ondevice-notes',
		'@storybook/addon-ondevice-controls',
		'@storybook/addon-ondevice-backgrounds',
		'@storybook/addon-ondevice-actions',
	],
}
