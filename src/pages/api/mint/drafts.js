import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user }, res) => {
		backend
			.get('/v1/list_draft_nft', {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(resp => res.json(resp.data.data.list))
	})
	.post(async ({ user, body: { selectedWallet, name, description, copies, isAdultContent, price, royalties, currency, ipfsHash, hasVerifiedAuthorship, type, draftId } }, res) => {
		backend
			.post(
				'v1/set_draft_nft',
				{ draft_id: draftId, wallet: selectedWallet, title: name, description, number_of_copies: copies, nsfw: isAdultContent, price, royalties, currency, ipfs_hash: ipfsHash, agreed_to_terms: hasVerifiedAuthorship, media_type: type.charAt(0).toUpperCase() + type.slice(1) },
				{
					headers: {
						'X-Authenticated-User': user.publicAddress,
						'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
					},
				}
			)
			.then(resp => res.json(resp.data))
			.catch(error => res.status(error.response.status).json(error.response.data))
	})
