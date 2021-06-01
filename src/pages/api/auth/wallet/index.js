import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'
import backend from '@/lib/backend'
import handler from '@/lib/api-handler'

export default handler().delete(async ({ cookies, body: { address } }, res) => {
	const user = await Iron.unseal(CookieService.getAuthToken(cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

	if (address === user.publicAddress) return res.status(400).json({ error: "This address can't be unlinked" })

	await backend
		.post(
			'/v1/removewallet',
			{ address },
			{
				headers: {
					'X-Authenticated-User': user.publicAddress,
					'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				},
			}
		)
		.then(resp => res.json(resp.data))

	res.status(200).end()
})
