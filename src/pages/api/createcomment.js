import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'

export default async (req, res) => {
	try {
		const user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		const body = JSON.parse(req.body)
		const nftId = body.nftId
		const message = body.message

		await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/newcomment/${nftId}`, {
			method: 'POST',
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message }),
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
