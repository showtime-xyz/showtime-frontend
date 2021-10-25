import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.post(async ({ user, body: { nftId, message, parent_id } }, res) => {
		await backend
			.post(
				`/v1/newcomment/${nftId}`,
				{ message, parent_id },
				{
					headers: {
						'X-Authenticated-User': user.publicAddress,
						'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
						'Content-Type': 'application/json',
					},
				}
			)
			.then(resp => res.json(resp.data))

		res.status(200).end()
	})
