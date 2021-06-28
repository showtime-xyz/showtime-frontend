import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'
import backendscripts from '@/lib/backend-scripts'

export default handler().post(async ({ body: { recache }, cookies }, res) => {
	let user

	try {
		user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	} catch {
		// the user is not authenticated yet
	}

	const headers = {
		'X-Authenticated-User': user?.publicAddress || null,
		'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
	}

	if (recache) {
		await backendscripts.post('/api/v1/get_follow_suggestions?recache=1', {}, { headers }).then(resp => res.json(resp.data))
	} else {
		await backend.post('/v1/get_follow_suggestions', {}, { headers }).then(resp => res.json(resp.data))
	}
})
