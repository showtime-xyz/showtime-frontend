const { withSentryConfig } = require('@sentry/nextjs')

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
	outputFileTracing: false, // https://github.com/vercel/next.js/issues/30601#issuecomment-961323914
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

module.exports = isDev ? nextConfig : withSentryConfig(nextConfig)
