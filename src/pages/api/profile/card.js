import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().get(async ({ user, query: { userId } }, res) => {
	await backend
		.get(`/v1/profilehover?profileid=${userId}`, {
			headers: {
				'X-Authenticated-User': user?.publicAddress || null,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		.then(resp => res.json(resp.data))
})
