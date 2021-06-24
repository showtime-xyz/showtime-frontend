import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.get(async ({ user }, res) => {
		if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

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
		if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

		await backend.post('/v1/editname', body, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
		})

		res.status(200).end()
	})
