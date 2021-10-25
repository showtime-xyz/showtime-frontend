import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ user, body }, res) => {
	await backend.post('/v1/update_list_order', body, {
		headers: {
			'X-Authenticated-User': user?.publicAddress || null,
			'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
		},
	})

	res.status(200).end()
})
