import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user }, res) => {
		console.log(process.env.ENCRYPTION_SECRET_V2)
		await backend
			.get('/v2/myinfo', {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-Authenticated-Email': user.email || null,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(resp => res.json(resp.data))
	})
	.post(async ({ user, body }, res) => {
		await backend.post('/v1/editname', body, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
		})

		res.status(200).end()
	})
