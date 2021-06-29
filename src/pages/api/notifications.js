import handler, { middleware } from '@/lib/api-handler'
import backendnotifications from '@/lib/backend-notifications'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user, query: { page = 1, limit = 7 } }, res) => {
		await backendnotifications(`/v1/notifications?page=${page}&limit=${limit}`, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-Authenticated-Email': user.email || null,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}).then(resp => res.json(resp.data))
	})
	.post(async ({ user }, res) => {
		await backend.post(
			'/v1/check_notifications',
			{},
			{
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			}
		)

		res.status(200).end()
	})
