import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'
import { verifyMessage } from 'ethers/lib/utils'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.guest)
	.post(async ({ body: { address, signature } }, res) => {
		if (!address || !signature) return res.status(400).json({ error: 'Address or signature not specified.' })

		// check the signature
		const {
			data: { data: nonce },
		} = await backend.get(`/v1/getnonce?address=${address}`)

		// If it checks out, save to a cookie
		const msg = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + nonce

		console.log(verifyMessage(msg, signature).toLowerCase(), address.toLowerCase())

		if (verifyMessage(msg, signature).toLowerCase() === address.toLowerCase()) {
			CookieService.setTokenCookie(res, await Iron.seal({ publicAddress: address.toLowerCase() }, process.env.ENCRYPTION_SECRET_V2, Iron.defaults))

			// Expire the nonce after successful login
			backend.get(`/v1/rotatenonce?address=${address}`)
		} else {
			console.log('SIG VERIFICATION FAILED')
		}

		res.end()
	})
