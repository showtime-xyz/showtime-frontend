import backend from '@/lib/backend'
import handler from '@/lib/api-handler'

export default handler().post(async ({ user, body: { commentId } }, res) => {
	if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

	await backend.post(
		`/v1/deletecomment/${commentId}`,
		{},
		{
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
