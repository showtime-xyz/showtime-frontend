import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ user, body: { page = 1, activityTypeId = 0, limit = 5 } }, res) => {
	if (!user && page > 8) return res.status(200).json({ data: [] })

	await backend
		.get(`/v2/activity?page=${page}&type_id=${activityTypeId}&limit=${limit}`, {
			headers: {
				'X-Authenticated-User': user?.publicAddress || null,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		.then(resp => res.json(resp.data))
})
