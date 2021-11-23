import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'
import { verifyMessage } from 'ethers/lib/utils'
import handler, { middleware } from '@/lib/api-handler'
import { captureException } from '@sentry/nextjs'

export default handler()
	.use(middleware.guest)
	.post(async ({ body: { address, signature } }, res) => {
		if (!address || !signature) return res.status(400).json({ error: 'Address or signature not specified.' })

		try {
			// check the signature
			const {
				data: { data: nonce },
			} = await backend.get(`/v1/getnonce?address=${address}`)

			// If it checks out, save to a cookie
			const msg = process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + nonce

			const loginResponse = await backend.post('/v1/login_wallet', {
				address,
				signature,
			})

			const accessToken = loginResponse?.data?.access
			const refreshToken = loginResponse?.data?.refresh

			const validMessage = verifyMessage(msg, signature).toLowerCase() === address.toLowerCase()

			if (validMessage) {
				const sealedRefreshToken = await Iron.seal(
					{ refreshToken },
					process.env.ENCRYPTION_SECRET_V2,
					Iron.defaults
				)
				CookieService.setTokenCookie({
					res,
					sealedRefreshToken,
				})
				// Expire the nonce after successful login
				backend.get(`/v1/rotatenonce?address=${address}`)
			} else {
				throw 'SIGNATURE VERIFICATION FAILED'
			}

			res.status(200).json({ access: accessToken })
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}
			//TODO: update this in notion
			captureException(error, {
				tags: {
					login_signature_flow: 'signature.js',
				},
			})
		}

		res.end()
	})
