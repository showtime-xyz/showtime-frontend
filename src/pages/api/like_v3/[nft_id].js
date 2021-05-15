import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'
import handler from '@/lib/api-handler'

export default handler().post(async ({ cookies, query: { nft_id } }, res) => {
	const user = await Iron.unseal(
		CookieService.getAuthToken(cookies),
		process.env.ENCRYPTION_SECRET_V2,
		Iron.defaults
	)

	await backend.post(
		`/v3/like/${nft_id}`,
		{},
		{
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.statusCode = 200
	res.status(200).end()
})
