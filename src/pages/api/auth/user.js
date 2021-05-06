import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import handler from '@/lib/api-handler'

export default handler.get(async (req, res) => {
	try {
		await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults).then(res.json)
	} catch {
		res.status(401).json({ error: 'Unauthenticated.' })
	}
})
