const { withSentryConfig } = require('@sentry/nextjs')

const isDev = process.env.NODE_ENV === 'development'

// These are dope
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
			{
				source: '/claim',
				destination: 'https://claim.tryshowtime.com/',
				permanent: true,
			},
		]
	},
}

module.exports = isDev ? nextConfig : withSentryConfig(nextConfig)
