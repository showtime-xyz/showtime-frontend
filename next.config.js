const { withSentryConfig } = require('@sentry/nextjs')

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
			{
				source: '/claim',
				destination: 'https://claim.tryshowtime.com/',
				permanent: true,
			},
		]
	},
}

module.exports = isDev ? nextConfig : withSentryConfig(nextConfig)
