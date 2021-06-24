import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ user, body }, res) => {
	if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

	await backend
		.post('/v2/editphoto', body, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
		})
		.then(resp => res.json(resp.data))

	res.status(200).end()
})
