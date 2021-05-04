import CookieService from '@/lib/cookie'
import nc from 'next-connect'

const handler = nc().post(async (req, res) => {
	CookieService.expireTokenCookie(res)

	res.end()
})

export default handler
