const path = require('path')

module.exports = function (api) {
	api.cache(true)

	const STAGE = process.env.STAGE ?? 'development'
	const envPath = path.resolve(__dirname, `.env.${STAGE}`)
	require('dotenv').config({
		path: envPath,
	})

	return {
		presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
		plugins: [['inline-dotenv', { path: envPath }], 'react-native-reanimated/plugin'],
	}
}
