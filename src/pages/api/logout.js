import CookieService from '@/lib/cookie'

export default async (req, res) => {
	if (req.method !== 'POST') return res.status(405).end()

	CookieService.expireTokenCookie(res)

	res.end()
}
