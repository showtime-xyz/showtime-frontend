import axios from '@/lib/axios'
import Router from 'next/router'
import jwt_decode from 'jwt-decode'
import { captureException } from '@sentry/nextjs'

class ClientAccessToken {
	#accessToken

	getAccessToken() {
		return this.#accessToken
	}

	setAccessToken(newAccessToken) {
		this.#accessToken = newAccessToken
	}

	getPublicAddressFromAccessToken() {
		const accessToken = this.getAccessToken()
		return accessToken ? jwt_decode(accessToken)?.address : null
	}

	async #refresh() {
		try {
			const response = await axios.post('/api/auth/refresh')
			const accessToken = response?.data.access
			return accessToken
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}

			await axios.post('/api/auth/logout')
			window.localStorage.setItem('logout', Date.now())
			Router.reload(window.location.pathname)

			captureException(error, {
				tags: {
					failed_silent_refresh: 'client-access-token.js',
				},
			})
		}
	}

	async refreshAccessToken() {
		const refreshedAccessTokenValue = await this.#refresh()
		this.setAccessToken(refreshedAccessTokenValue)
		return refreshedAccessTokenValue
	}
}

export default new ClientAccessToken()
