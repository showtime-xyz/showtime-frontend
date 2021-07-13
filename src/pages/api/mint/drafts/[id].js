import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user, query: { id } }, res) => {
		backend
			.get(`/v1/get_draft_nft?draft_id=${id}`, {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(
				({
					data: {
						data: { id, wallet, title, description, nsfw, price, currency_ticker, number_of_copies, royalties, ipfs_hash, media_type },
					},
				}) => res.json({ draftId: id, selectedWallet: wallet, name: title, description, isAdultContent: nsfw, price: parseFloat(price), currency: currency_ticker, copies: number_of_copies, royalties: parseInt(royalties), ipfsHash: ipfs_hash, type: media_type.toLowerCase() })
			)
			.catch(err => {
				if (err.response.status !== 400) throw err

				res.status(400).json({ error: 'Draft does not exist' })
			})
	})
