import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler.post(async ({ cookies, body: { page = 1, activityTypeId = 0, limit = 5 } }, res) => {
	let user = null

	try {
		user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	} catch (err) {
		if (page > 8) return res.status(200).json({ data: [] })

		throw err
	}

	await backend
		.get(`/v1/activity?page=${page}&type_id=${activityTypeId}&limit=${limit}`, {
			headers: {
				'X-Authenticated-User': user?.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		.then(resp => res.json(resp.data))
})
