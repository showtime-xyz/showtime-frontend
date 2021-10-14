import handler from '@/lib/api-handler'
import backend from '@/lib/backend'
import CookieService from '@/lib/cookie'
import Iron from '@hapi/iron'
import { captureException } from '@sentry/nextjs'

/**
 * Serverless function that acts as a proxy for the backend JWT service.
 * When invoked the function will unseal the refresh token and forward it
 * On success both the previous refresh and access token are rotated and
 * the a new refresh token is sealed and set as a cookie and the access token
 * is returned in the body.
 */
export default handler().post(async (req, res) => {
	try {
		const sealedRefreshTokenCookie = CookieService.getRefreshToken(req.cookies)

		if (!sealedRefreshTokenCookie) {
			throw 'Missing sealed refresh token cookie'
		}

		const { refreshToken } = await Iron.unseal(sealedRefreshTokenCookie, process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		const refreshResponse = await backend.post('/v1/jwt/refresh', {
			refresh: refreshToken,
		})

		const newAccessToken = refreshResponse?.data?.access
		const newRefreshToken = refreshResponse?.data?.refresh

		const sealedRefreshToken = await Iron.seal({ refreshToken: newRefreshToken }, process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		CookieService.setTokenCookie({
			res,
			sealedRefreshToken,
		})

		res.status(200).json({ access: newAccessToken })
	} catch (error) {
		const status = error?.response?.status
		const data = error?.response?.data

		if (process.env.NODE_ENV === 'development') {
			console.log('error.response.status', status)
			console.log('error.response.data', data)
			console.log('error', error)
		}

		captureException(error, {
			tags: {
				refresh_token: 'refresh.js',
			},
		})

		if (status) {
			res.status(status)
		}
	}

	res.end()
})
