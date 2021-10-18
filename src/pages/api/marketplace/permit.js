import handler, { middleware } from '@/lib/api-handler'
import ierc20PermitAbi from '@/data/IERC20Permit.json'
import { ethers } from 'ethers'
import { SOL_MAX_INT } from '@/lib/constants'

export default handler().post(async ({ body: { owner, deadline, signature, tokenAddr } }, res) => {
	const { v, r, s } = ethers.utils.splitSignature(signature)
	const wallet = new ethers.Wallet(process.env.WALLET_KEY, new ethers.providers.JsonRpcProvider(`https://polygon-${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'mainnet'}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`))
	const tokenContract = new ethers.Contract(tokenAddr, ierc20PermitAbi, wallet)

	try {
		const tx = await tokenContract.permit(owner, process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, SOL_MAX_INT, deadline, v, r, s)

		return res.status(200).send(tx.hash)
	} catch (error) {
		const revertMessage = JSON.parse(error?.error?.error?.body || '{}')?.error?.message

		if (!revertMessage) {
			return res.status(500).send('Something went wrong.')
		}

		return res.status(400).send(revertMessage.split('execution reverted: ')[1])
	}
})
