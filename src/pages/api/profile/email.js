import { Magic } from '@magic-sdk/admin'
import handler from '@/lib/api-handler'
import backend from '@/lib/backend'

export default handler().post(async ({ user, headers: { authorization } }, res) => {
	if (!user) return res.status(401).json({ error: 'Unauthenticated.' })

	// exchange the did from Magic for some user data
	const new_user = await new Magic(process.env.MAGIC_SECRET_KEY).users.getMetadataByToken(authorization.split('Bearer').pop().trim())

	await backend.post(
		'/v1/addwallet',
		{
			address: new_user.publicAddress,
			email: new_user.email,
		},
		{
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		}
	)

	res.status(200).end()
})
