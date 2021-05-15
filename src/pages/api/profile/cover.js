import handler from '@/lib/api-handler'
import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'

export default handler().post(async ({ cookies, body }, res) => {
	const user = await Iron.unseal(
		CookieService.getAuthToken(cookies),
		process.env.ENCRYPTION_SECRET_V2,
		Iron.defaults
	)

	await backend
		.post('/v2/editcoverphoto', body, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
		})
		.then(resp => res.json(resp.data))

	res.status(200).end()
})

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '12mb',
		},
	},
}
