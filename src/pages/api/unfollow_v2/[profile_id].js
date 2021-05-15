import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async (req, res) => {
	const profile_id = req.query.profile_id

	const user = await Iron.unseal(
		CookieService.getAuthToken(req.cookies),
		process.env.ENCRYPTION_SECRET_V2,
		Iron.defaults
	)

	await backend.post(
		`/v2/unfollow/${profile_id}`,
		{},
		{
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
