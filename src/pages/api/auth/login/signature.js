import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import { recoverPersonalSignature } from 'eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import backend from '@/lib/backend'
import handler from '@/lib/api-handler'

export default handler().post(async ({ body: { address, signature } }, res) => {
	if (!address || !signature)
		return res.status(400).json({ error: 'Address or signature not specified.' })

	// check the signature
	const {
		data: { data: nonce },
	} = await backend.get(`/v1/getnonce?address=${address}`)

	// If it checks out, save to a cookie
	const msg = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + nonce

	// We now are in possession of msg, publicAddress and signature. We
	// will use a helper from eth-sig-util to extract the address from the signature
	const verifiedAddress = recoverPersonalSignature({
		data: bufferToHex(Buffer.from(msg, 'utf8')),
		sig: signature,
	})

	// The signature verification is successful if the address found with
	// sigUtil.recoverPersonalSignature matches the initial publicAddress
	if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
		// Author a couple of cookies to persist a user's session
		const user = {
			publicAddress: verifiedAddress.toLowerCase(),
		}
		const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
		CookieService.setTokenCookie(res, token)

		// Expire the nonce after successful login
		backend.get(`/v1/rotatenonce?address=${address}`)
	} else {
		console.log('SIG VERIFICATION FAILED')
	}

	res.end()
})
