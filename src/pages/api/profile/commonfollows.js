import handler from '@/lib/api-handler'
import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'

export default handler().get(async ({ cookies, query: { profileId, isComplete = false } }, res) => {
	try {
		const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		await backend
			.get(`/v1/commonfollows?profileid=${profileId}${isComplete ? '' : '&limit=4&count=1'}&sortbyfollowers=1`, {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-Authenticated-Email': user.email || null,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(resp => res.json(resp.data))
	} catch (error) {
		res.status(400).json({ error: 'Unauthenticated' })
	}
})
