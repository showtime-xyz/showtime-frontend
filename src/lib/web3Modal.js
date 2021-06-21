import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from 'fortmatic'
import { WalletLink } from 'walletlink'
import { useTheme } from 'next-themes'
import Web3Modal from 'web3modal'

class DummyModal {}

const useWeb3Modal = () => {
	const { resolvedTheme } = useTheme()

	if (typeof window === 'undefined') return DummyModal

	const web3Modal = new Web3Modal({
		network: 'mainnet',
		cacheProvider: false,
		providerOptions: {
			walletconnect: {
				display: {
					description: 'Use Rainbow & other popular wallets',
				},
				package: WalletConnectProvider,
				options: {
					infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
				},
			},
			fortmatic: {
				package: Fortmatic,
				options: {
					key: process.env.NEXT_PUBLIC_FORTMATIC_PUB_KEY,
				},
			},
			'custom-walletlink': {
				display: {
					logo: '/coinbase.svg',
					name: 'Coinbase',
					description: 'Use the Coinbase Wallet app on your mobile device',
				},
				options: {
					appName: 'Showtime',
					networkUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
					chainId: process.env.NEXT_PUBLIC_CHAINID,
				},
				package: WalletLink,
				connector: async (_, options) => {
					const { appName, networkUrl, chainId } = options
					const walletLink = new WalletLink({ appName })
					const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
					await provider.enable()
					return provider
				},
			},
		},
		theme: resolvedTheme,
	})

	return web3Modal
}

export default useWeb3Modal
