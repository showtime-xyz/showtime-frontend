import { Magic } from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'

export default handler().post(async ({ headers: { authorization } }, res) => {
	// exchange the did from Magic for some user data
	const user = await new Magic(process.env.MAGIC_SECRET_KEY).users.getMetadataByToken(authorization.split('Bearer').pop().trim())

	// Author a couple of cookies to persist a user's session
	const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
	CookieService.setTokenCookie(res, token)

	res.end()
})
