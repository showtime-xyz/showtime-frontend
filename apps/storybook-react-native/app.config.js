export default {
	name: 'Showtime',
	description: 'Showtime Storybook',
	slug: 'showtime-storybook-react-native',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.storybook.png',
	scheme: 'io.showtime.storybook',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#000000',
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
		jsEngine: 'hermes',
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundImage: './assets/adaptive-icon-background.storybook.png',
		},
		jsEngine: 'hermes',
	},
	web: {
		favicon: './assets/favicon.png',
	},
}
