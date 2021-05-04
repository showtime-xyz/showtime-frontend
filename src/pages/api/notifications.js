import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import nc from 'next-connect'
import backend from '@/lib/backend'

const handler = nc()
	.get(async ({ cookies, query: { page = 1, limit = 7 } }, res) => {
		try {
			const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

			await backend(`/v1/notifications?page=${page}&limit=${limit}`, {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-Authenticated-Email': user.email || null,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			}).then(resp => res.json(resp.data))
		} catch (e) {
			console.error(e)
			res.status(400).json({ error: 'Unauthenticated.' })
		}
	})
	.post(async (req, res) => {
		try {
			const user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

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
		} catch (error) {
			console.log(error)
		}

		res.status(200).end()
	})

export default handler
