import backend from '@/lib/backend'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.auth)
	.post(async ({ body: { profileId }, user }, res) => {
		await backend
			.post(
				`/v1/decline_follow_suggestion/${profileId}`,
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
