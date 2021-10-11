import axios from '@/lib/axios'
import Router from 'next/router'
import jwt_decode from 'jwt-decode'
import { captureException } from '@sentry/nextjs'

let initialize = true
let _accessTokenValue

/**
 * Wrapper function for refreshing or generating the access token
 */
async function refreshAccessToken() {
	try {
		const endpoint = '/api/auth/refresh'
		const response = await axios.post(endpoint)
		const accessToken = response?.data.access
		return accessToken
	} catch (error) {
		const endpoint = '/api/auth/logout'

		if (process.env.NODE_ENV === 'development') {
			console.error(error)
		}

		await axios.post(endpoint)
		window.localStorage.setItem('logout', Date.now())
		Router.reload(window.location.pathname)

		captureException(error, {
			tags: {
				failed_silent_refresh: 'client-access-token.js',
			},
		})
	}
}

/**
 * Interface to access, set, clear and refresh access tokens.
 * Access tokens are stored in memory and are cleared on tab closing and sign out.
 */
function clientAccessToken(initAccessTokenValue) {
	if (initialize && !_accessTokenValue) {
		_accessTokenValue = initAccessTokenValue ? initAccessTokenValue : false
		if (_accessTokenValue) {
			initialize = false
		}
	}

	return {
		getAccessToken() {
			return _accessTokenValue
		},
		setAccessToken(newAccessToken) {
			_accessTokenValue = newAccessToken
		},
		async refreshAccessToken() {
			const refreshedAccessTokenValue = await refreshAccessToken()
			this.setAccessToken(refreshedAccessTokenValue)
			return refreshedAccessTokenValue
		},
		getPublicAddressFromAccessToken() {
			const accessToken = this.getAccessToken()
			return accessToken ? jwt_decode(accessToken)?.address : null
		},
	}
}

export default clientAccessToken
