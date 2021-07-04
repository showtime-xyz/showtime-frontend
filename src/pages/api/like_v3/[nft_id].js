import backend from '@/lib/backend'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.auth)
	.post(async ({ user, query: { nft_id } }, res) => {
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

		res.status(200).end()
	})
