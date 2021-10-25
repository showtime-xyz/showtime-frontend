const { withExpo } = require('@expo/next-adapter')
const withPlugins = require('next-compose-plugins')
const withSentryConfig = require('@sentry/nextjs')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})
const withTM = require('next-transpile-modules')(['app', '@gorhom/bottom-sheet', '@gorhom/portal', 'dripsy', '@dripsy/core'])

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
	async redirects() {
		return [
			{
				source: '/discord',
				destination: 'https://discord.gg/FBSxXrcnsm',
				permanent: true,
			},
			{
				source: '/feedback',
				destination: 'https://showtime.nolt.io',
				permanent: true,
			},
		]
	},
}

module.exports = withPlugins([withTM, withBundleAnalyzer, isDev ? withSentryConfig : null, [withExpo, { projectRoot: __dirname + '/../..' }]], nextConfig)
