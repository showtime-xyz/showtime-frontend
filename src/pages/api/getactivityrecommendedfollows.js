import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'

export default async (req, res) => {
	const body = JSON.parse(req.body)
	const recache = body.recache || false

	try {
		let publicAddress

		try {
			const user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
			publicAddress = user.publicAddress
		} catch {}

		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/get_follow_suggestions${recache ? '?recache=1' : ''}`, {
			method: 'POST',
			headers: {
				'X-Authenticated-User': publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (myJson) {
				res.json(myJson)
			})
	} catch (error) {
		console.log(error)
	}

	res.statusCode = 200
	res.end()
}
