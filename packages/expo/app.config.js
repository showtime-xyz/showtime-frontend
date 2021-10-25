const STAGE = process.env.STAGE
const SCHEME = process.env.SCHEME ?? 'com.showtime'

const envConfig = {
	development: {
		scheme: `${SCHEME}.development`,
		icon: './assets/icon.development.png',
		foregroundImage: './assets/adaptive-icon-white.png',
		backgroundColor: '#C4B5FD',
	},
	staging: {
		scheme: `${SCHEME}.staging`,
		icon: './assets/icon.staging.png',
		foregroundImage: './assets/adaptive-icon-white.png',
		backgroundColor: '#4C1D95',
	},
	production: {
		scheme: SCHEME,
		icon: './assets/icon.png',
		foregroundImage: './assets/adaptive-icon.png',
		backgroundColor: '#1610FF',
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
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#000000',
	},
	ios: {
		bundleIdentifier: config.scheme,
		supportsTablet: true,
		jsEngine: 'hermes',
	},
	android: {
		package: config.scheme,
		versionCode: 1,
		adaptiveIcon: {
			foregroundImage: config.foregroundImage,
			backgroundColor: config.backgroundColor,
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
	hooks: {
		postPublish: [
			{
				file: 'sentry-expo/upload-sourcemaps',
				config: {},
			},
		],
	},
	extra: {
		STAGE: process.env.STAGE,
	},
	plugins: ['sentry-expo'],
}
