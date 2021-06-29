import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user }, res) => {
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
