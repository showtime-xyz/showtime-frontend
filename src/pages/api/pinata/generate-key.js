import axios from '@/lib/axios'
import { formatAddressShort } from '@/lib/utilities'
import handler, { middleware } from '@/lib/api-handler'

export default handler()
	.use(middleware.auth)
	.post(async ({ user }, res) => {
		const token = await axios
			.post(
				'https://api.pinata.cloud/users/generateApiKey',
				{
					maxUses: 1,
					keyName: `${formatAddressShort(user.publicAddress)}'s key`,
					permissions: {
						endpoints: {
							pinning: {
								pinFileToIPFS: true,
								pinJSONToIPFS: true,
							},
						},
					},
				},
				{ headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } }
			)
			.then(({ data: { JWT } }) => JWT)

		res.status(200).json({ token })
	})
