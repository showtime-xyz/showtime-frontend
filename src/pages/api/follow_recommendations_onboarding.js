import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().get(async (req, res) => {
	const user = await Iron.unseal(
		CookieService.getAuthToken(req.cookies),
		process.env.ENCRYPTION_SECRET_V2,
		Iron.defaults
	)

	await backend
		.post(
			'/v1/follow_recommendations_onboarding',
			{},
			{
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			}
		)
		.then(resp => res.json(resp.data))

	res.status(200).end()
})
