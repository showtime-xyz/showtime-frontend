import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import nc from 'next-connect'
import backend from '@/lib/backend'

const handler = nc().post(async ({ cookies, body }, res) => {
	try {
		const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		await backend
			.post('/v1/editphoto', body, {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(resp => res.json(resp.data))
	} catch (error) {
		console.log(error)
	}

	res.status(200).end()
})

export default handler
