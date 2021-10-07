import axios from '@/lib/axios'

let initialize = true
let _accessTokenValue

/**
 * Wrapper function for refreshing or generating the access token
 */
async function refreshAccessToken() {
	const endpoint = '/api/auth/refresh'
	const response = await axios.post(endpoint)
	const accessToken = response?.data.access
	return accessToken
}

/**
 * Interface to access, set, clear and refresh access tokens.
 * Access tokens are stored in memory and are cleared on tab closing and sign out.
 */
async function clientAccessToken(initAccessTokenValue) {
	if (initialize) {
		_accessTokenValue = initAccessTokenValue ? initAccessTokenValue : await refreshAccessToken()
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
	}
}

export default clientAccessToken
