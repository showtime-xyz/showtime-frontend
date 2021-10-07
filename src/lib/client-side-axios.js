import Axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import clientAccessToken from '@/lib/client-access-token'

const axios = Axios.create()

/**
 * An expired or missing access token sent to our backend services will trigger a
 * 401 response status code that we intercept to trigger a silent access token refresh.
 * On refresh success the request will be resent and on failure we force a logout.
 */
createAuthRefreshInterceptor(
	axios,
	async () => {
		const accessInterface = await clientAccessToken()
		try {
			await accessInterface.refreshAccessToken()
		} catch (error) {
			await axios.post('/api/auth/logout')
			accessInterface.setAccessToken(null)
			window.localStorage.setItem('logout', Date.now())
		}
		return axios
	},
	{ statusCodes: [401] }
)

/**
 * Configures the Authorization bearer access token before each request
 * dynamically to ensure a request is never referencing a stale access token.
 */
axios.interceptors.request.use(async request => {
	const accessInterface = await clientAccessToken()
	const accessToken = accessInterface.getAccessToken()
	if (accessToken) {
		request.headers['Authorization'] = `Bearer ${accessToken}`
	}

	return request
})

export default axios
export const isCancel = err => Axios.isCancel(err)
export const CancelToken = Axios.CancelToken
