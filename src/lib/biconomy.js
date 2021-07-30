import { Biconomy } from '@biconomy/mexa'
import { ethers } from 'ethers'

export const getBiconomy = async web3Modal => {
	const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())
	const biconomy = new Biconomy(new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`), { apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, debug: true, walletProvider: web3.provider })

	await new Promise((resolve, reject) => biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject))

	return { biconomy, web3 }
}
