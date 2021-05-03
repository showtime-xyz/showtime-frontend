import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'

export default async (req, res) => {
	let user = null
	let socialLinkOptions = { data: [] }

	try {
		user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)

		//console.log(user);
		let email = null
		if (user.email) {
			email = user.email
		}

		//console.log(email);

		const socialLinkOptionsQuery = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/link_options`, {
			headers: {
				'X-Authenticated-User': user.publicAddress,
				'X-Authenticated-Email': email,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		socialLinkOptions = await socialLinkOptionsQuery.json()
	} catch {}

	res.statusCode = 200
	res.json(socialLinkOptions)
}
