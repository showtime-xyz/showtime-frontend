import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'

export default handler().post(async (req, res) => {
	CookieService.expireTokenCookie(res)

	res.end()
})
