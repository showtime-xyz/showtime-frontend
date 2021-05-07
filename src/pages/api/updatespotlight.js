import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ cookies, body: { nft_id } }, res) => {
	let user

	try {
		user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	} catch (error) {
		// User is not logged in
	}

	await backend.post(
		'/v1/update_featured_nft',
		{ nft_id },
		{
			headers: {
				'X-Authenticated-User': user?.publicAddress || null, // may be null if logged out
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
