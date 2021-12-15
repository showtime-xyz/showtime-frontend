import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'
import { CHAIN_IDENTIFIERS } from '@/lib/constants'

export default handler()
	//.use(middleware.moonpay)
	.get(async ({ query: { contractAddr, tokenId } }, res) => {
		if (contractAddr != process.env.NEXT_PUBLIC_MINTING_CONTRACT) return res.status(404).end()

		const item = await backend
			.get(
				`/v2/token/${contractAddr}/${tokenId}?chain_identifier=${
					CHAIN_IDENTIFIERS[process.env.NEXT_PUBLIC_CHAIN_ID]
				}`
			)
			.then(({ data: { data } }) => data.item)

		if (item?.listing?.quantity <= 0) return res.status(403).end()

		return res.json({
			tokenId,
			contractAddress: contractAddr,
			name: item.token_name,
			collection: 'Showtime',
			imageUrl: item.token_img_url,
			explorerUrl: 'http://example.com',
			price: item.listing.min_price,
			priceCurrencyCode: item.listing.currency,
			quantity: item.listing.quantity,
			sellerAddress: item.listing.address,
			sellType: 'Primary',
			flow: 'Injected',
			tokenType: 'Erc1155',
			network: process.env.NEXT_PUBLIC_CHAIN_ID ? 'Mumbai' : 'Polygon',
		})
	})
