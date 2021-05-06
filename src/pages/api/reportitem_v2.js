import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler.post(async ({ cookies, body: { nft_id, description, activity_id } }, res) => {
	let user
	try {
		user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	} catch {
		// User is not authenticated
	}

	await backend.post(
		'/v2/reportitem',
		{ nft_id, description, activity_id },
		{
			headers: {
				'X-Authenticated-User': user?.publicAddress, // may be null if logged out
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
