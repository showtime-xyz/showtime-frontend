import { Biconomy } from '@biconomy/mexa'
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'

export const getBiconomy = async (web3Modal, web3ModalCleanup = () => null) => {
	const web3 = new Web3Provider(await web3Modal.connect())
	web3ModalCleanup()
	const biconomy = new Biconomy(
		new JsonRpcProvider(
			`https://polygon-${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'mainnet'}.infura.io/v3/${
				process.env.NEXT_PUBLIC_INFURA_ID
			}`
		),
		{ apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, walletProvider: web3.provider }
	)

	await new Promise((resolve, reject) => biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject))

	return { biconomy, web3 }
}
