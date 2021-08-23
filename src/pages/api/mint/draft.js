import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user }, res) => {
		backend
			.get('/v1/get_draft_nft', {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(({ data: { data } }) => res.json(data))
			.catch(() => res.status(200).json({ title: null, description: null, number_of_copies: null, nsfw: null, price: null, royalties: null, currency: null, ipfs_hash: null, agreed_to_terms: null, mime_type: null, file_size: 0 }))
	})
	.post(async ({ user, body: { title, description, number_of_copies, nsfw, price, royalties, currency, ipfs_hash, agreed_to_terms, mime_type, minted, file_size } }, res) => {
		backend
			.post(
				'v1/set_draft_nft',
				{ title, description, number_of_copies, nsfw, price, royalties, currency, ipfs_hash, agreed_to_terms, mime_type, file_size, minted },
				{
					headers: {
						'X-Authenticated-User': user.publicAddress,
						'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
					},
				}
			)
			.then(resp => res.json(resp.data.data))
			.catch(error => res.status(error.response.status).json(error.response.data))
	})
