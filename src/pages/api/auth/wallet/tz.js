import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'
import sodium from 'libsodium-wrappers'
import bs58check from 'bs58check'
import backend from '@/lib/backend'

const prefix = { edsig: new Uint8Array([9, 245, 205, 134, 18]), edpk: new Uint8Array([13, 15, 37, 217]) }

const hex2buf = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)))

const b58decode = (enc, prefix) => bs58check.decode(enc).slice(prefix.length)

const char2Bytes = str => Buffer.from(str, 'utf8').toString('hex')

export default handler().put(async ({ cookies, body: { address, signature, publicKey } }, res) => {
	const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

	const {
		data: { data: nonce },
	} = await backend.get(`/v1/getnonce?address=${address}`)

	await sodium.ready

	if (sodium.crypto_sign_verify_detached(b58decode(signature, prefix.edsig), sodium.crypto_generichash(32, hex2buf(char2Bytes(process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + nonce))), b58decode(publicKey, prefix.edpk))) {
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
	} else {
		console.log('SIG VERIFICATION FAILED')
	}

	res.status(200).end()
})
