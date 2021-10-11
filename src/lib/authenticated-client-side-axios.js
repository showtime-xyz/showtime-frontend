import Axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import Router from 'next/router'
import { captureException } from '@sentry/nextjs'

import clientAccessToken from '@/lib/client-access-token'

const axios = Axios.create()

/**
 * An expired or missing access token sent to our backend services will trigger a
 * 401 or 500 response status code that we intercept to trigger a silent access token refresh.
 * On refresh success the request will be resent and on failure we force the logout flow.
 */
createAuthRefreshInterceptor(
	axios,
	async () => {
		const accessInterface = clientAccessToken()

		try {
			const refreshedAccessTokenValue = await accessInterface.refreshAccessToken()
			const invalidRefreshedAccessTokenValue = !refreshedAccessTokenValue

			if (invalidRefreshedAccessTokenValue) {
				throw 'The refresh request has failed, likely due to an expired refresh token'
			}

			return axios
		} catch (error) {
			const endpoint = '/api/auth/logout'
			const logoutInstance = Axios.create()

			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}

			await logoutInstance.post(endpoint)
			accessInterface.setAccessToken(null)
			window.localStorage.setItem('logout', Date.now())
			Router.reload(window.location.pathname)

			captureException(error, {
				tags: {
					failed_silent_refresh: 'authenticated-client-side-axios.js',
				},
			})

			// Prevents the refresh interceptor from retrying authentication
			return Promise.reject()
		}
	},
	{ statusCodes: [401, 500] }
)

/**
 * Configures the Authorization bearer access token before each request
 * dynamically to ensure a request is never referencing a stale access token.
 */
axios.interceptors.request.use(async request => {
	const accessInterface = clientAccessToken()
	const accessToken = accessInterface.getAccessToken()
	if (accessToken) {
		request.headers['Authorization'] = `Bearer ${accessToken}`
	}

	return request
})

export default axios
export const isCancel = err => Axios.isCancel(err)
export const CancelToken = Axios.CancelToken
