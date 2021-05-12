import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().get(async (req, res) => {
	let user = null

	user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

	await backend
		.get('/v1/link_options', {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-Authenticated-Email': user?.email ?? null,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		.then(resp => res.json(resp.data))
})
