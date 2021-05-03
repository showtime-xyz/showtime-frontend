import Iron from '@hapi/iron'
import CookieService from '@/lib/cookie'

export default async (req, res) => {
	let user = null
	let data_activity = { data: [] }
	const body = JSON.parse(req.body)
	const profileId = body.profileId || 51
	const page = body.page || 1
	const limit = body.limit || 6
	const listId = body.listId || 1
	const sortId = body.sortId || 1
	const showHidden = body.showHidden || 0
	const showDuplicates = body.showDuplicates || 0
	const collectionId = body.collectionId || 0

	try {
		let publicAddress
		try {
			user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET_V2, Iron.defaults)
			publicAddress = user.publicAddress
		} catch (err) {
			console.error(err)
		}

		const res_activity = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/profile_nfts?profile_id=${profileId}&page=${page}&limit=${limit}&list_id=${listId}&sort_id=${sortId}&show_hidden=${showHidden}&show_duplicates=${showDuplicates}&collection_id=${collectionId}`, {
			headers: {
				'X-Authenticated-User': publicAddress,
				'X-API-Key': process.env.SHOWTIME_FRONTEND_API_KEY_V2,
			},
		})
		data_activity = await res_activity.json()
		//console.log(data_activity);
	} catch (e) {
		console.error(e)
	}

	res.statusCode = 200
	res.json(data_activity)
}
