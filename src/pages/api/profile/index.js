import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler
	.get(async (req, res) => {
		try {
			const user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

			await backend
				.get('/v2/myinfo', {
					headers: {
						'X-Authenticated-User': user.publicAddress,
						'X-Authenticated-Email': user.email || null,
						'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
					},
				})
				.then(resp => res.json(resp.data))
		} catch (error) {
			res.status(400).json({ error: 'Unauthenticated' })
		}
	})
	.post(async ({ cookies, body }, res) => {
		const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		await backend.post('/v1/editname', body, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
		})

		res.status(200).end()
	})
