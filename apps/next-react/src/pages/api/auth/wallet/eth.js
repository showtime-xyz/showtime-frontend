import backend from '@/lib/backend'
import handler, { middleware } from '@/lib/api-handler'
import { verifyMessage } from 'ethers/lib/utils'

export default handler()
	.use(middleware.auth)
	.put(async ({ user, body: { addressDetected: address, signature } }, res) => {
		// check the signature
		const {
			data: { data: nonce },
		} = await backend.get(`/v1/getnonce?address=${address}`)

		if (
			verifyMessage(process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + ' ' + nonce, signature).toLowerCase() ===
			address.toLowerCase()
		) {
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
