import 'dotenv/config'

const STAGE = process.env.STAGE
const SCHEME = process.env.SCHEME ?? 'io.showtime'

const envConfig = {
	development: {
		scheme: `${SCHEME}.development`,
		icon: './assets/icon.development.png',
		foregroundImage: './assets/adaptive-icon.development.png',
		backgroundImage: './assets/adaptive-icon-background.development.png',
	},
	staging: {
		scheme: `${SCHEME}.staging`,
		icon: './assets/icon.staging.png',
		foregroundImage: './assets/adaptive-icon.staging.png',
		backgroundImage: './assets/adaptive-icon-background.staging.png',
	},
	production: {
		scheme: SCHEME,
		icon: './assets/icon.png',
		foregroundImage: './assets/adaptive-icon.png',
		backgroundImage: './assets/adaptive-icon-background.png',
	},
}

const config = envConfig[STAGE ?? 'development']

export default {
	name: 'Showtime',
	description: 'Discover and showcase crypto art',
	slug: 'showtime',
	scheme: 'showtime',
	owner: 'tryshowtime',
	icon: config.icon,
	version: '0.0.1',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#000000',
	},
	ios: {
		bundleIdentifier: config.scheme,
		supportsTablet: true,
		jsEngine: 'hermes',
		backgroundColor: '#FFFFFF',
	},
	android: {
		package: config.scheme,
		versionCode: 1,
		adaptiveIcon: {
			foregroundImage: config.foregroundImage,
			backgroundImage: config.backgroundImage,
		},
		jsEngine: 'hermes',
	},
	androidNavigationBar: {
		barStyle: 'dark-content',
		backgroundColor: '#FFFFFF',
	},
	assetBundlePatterns: ['**/*'],
	orientation: 'portrait',
	updates: {
		fallbackToCacheTimeout: 0,
	},
	extra: {
		STAGE: process.env.STAGE,
	},
	plugins: [
		'./plugins/react-native-mmkv-plugin.js',
		[
			'./plugins/with-pick-first.js',
			{
				paths: ['lib/**/libreactnativejni.so'],
			},
		],
	],
}
