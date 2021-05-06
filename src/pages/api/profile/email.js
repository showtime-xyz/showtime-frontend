import { Magic } from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async (req, res) => {
	try {
		const user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		// exchange the did from Magic for some user data
		const new_user = await new Magic(process.env.MAGIC_SECRET_KEY).users.getMetadataByToken(req.headers.authorization.split('Bearer').pop().trim())

		await backend.post(
			'/v1/addwallet',
			{
				address: new_user.publicAddress,
				email: new_user.email,
			},
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
