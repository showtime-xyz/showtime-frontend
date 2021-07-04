import { recoverPersonalSignature } from 'eth-sig-util'
import { bufferToHex } from 'ethereumjs-util'
import backend from '@/lib/backend'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.auth)
	.put(async ({ user, body: { addressDetected: address, signature } }, res) => {
		// check the signature
		const {
			data: { data: nonce },
		} = await backend.get(`/v1/getnonce?address=${address}`)

		// We now are in possession of msg, publicAddress and signature. We
		// will use a helper from eth-sig-util to extract the address from the signature
		const msgBufferHex = bufferToHex(Buffer.from(process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + ' ' + nonce, 'utf8'))
		const verifiedAddress = recoverPersonalSignature({ data: msgBufferHex, sig: signature })

		// The signature verification is successful if the address found with
		// sigUtil.recoverPersonalSignature matches the initial publicAddress
		if (verifiedAddress.toLowerCase() === address.toLowerCase()) {
			// Post the merge request to the backend securely

			await backend
				.post(
					'/v1/addwallet',
					{ address },
					{
						headers: {
							'X-Authenticated-User': user.publicAddress,
							'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
						},
					}
				)
				.then(resp => res.json(resp.data))

			// Expire the nonce after successful login
			backend.get(`/v1/rotatenonce?address=${address}`)
		} else {
			console.log('SIG VERIFICATION FAILED')
		}

		res.status(200).end()
	})
