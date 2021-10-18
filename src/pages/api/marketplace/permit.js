import handler, { middleware } from '@/lib/api-handler'
import ierc20PermitAbi from '@/data/IERC20Permit.json'
import { ethers } from 'ethers'
import { SOL_MAX_INT } from '@/lib/constants'

export default handler()
	.use(middleware.auth)
	.post(async ({ body: { holder, nonce, deadline, signature, tokenAddr } }, res) => {
		const wallet = new ethers.Wallet(process.env.WALLET_KEY, new ethers.providers.JsonRpcProvider(`https://polygon-${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'mainnet'}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`))
		const tokenContract = new ethers.Contract(tokenAddr, ierc20PermitAbi, wallet)
		tokenContract.permit(holder, process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, SOL_MAX_INT, nonce, deadline, Number('0x' + signature.slice(130, 132)), signature.slice(0, 66), signature.slice(66, 130))

		console.log(holder, nonce, deadline, signature)

		res.status(200).end()
	})
