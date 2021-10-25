import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.post(
		async (
			{
				user,
				query: {
					nft_list: [nft_id, list_id],
				},
				body: { showDuplicates },
			},
			res
		) => {
			await backend.post(
				`/v1/unhide_nft/${nft_id}/${list_id}`,
				{ showDuplicates },
				{
					headers: {
						'X-Authenticated-User': user.publicAddress,
						'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
					},
				}
			)

			res.status(200).end()
		}
	)
