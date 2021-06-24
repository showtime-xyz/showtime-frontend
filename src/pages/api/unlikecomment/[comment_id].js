import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.post(async ({ user, query: { comment_id } }, res) => {
		await backend.post(
			`/v1/unlikecomment/${comment_id}`,
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
