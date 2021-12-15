import crypto from 'crypto'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.auth)
	.get(async ({ query: { tokenId }, user }, res) => {
		const url = `https://buy-staging.moonpay.com/nft?contractAddress=${process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT}&tokenId=${tokenId}&apiKey=${process.env.NEXT_PUBLIC_MOONPAY_ID}&walletAddress=${user.publicAddress}`

		return res.redirect(
			`${url}&signature=${encodeURIComponent(
				crypto.createHmac('sha256', process.env.MOONPAY_KEY).update(new URL(url).search).digest('base64')
			)}`
		)
	})
