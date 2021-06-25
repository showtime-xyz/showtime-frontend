import handler, { middleware } from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler()
	.use(middleware.auth)
	.get(async ({ user, query: { profileId, isComplete = false } }, res) => {
		await backend
			.get(`/v1/commonfollows?profileid=${profileId}${isComplete ? '' : '&limit=5&count=1'}&sortbyfollowers=1`, {
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-Authenticated-Email': user.email || null,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			})
			.then(resp => res.json(resp.data))
	})
