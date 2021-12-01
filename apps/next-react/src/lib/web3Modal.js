import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from 'fortmatic'
import { WalletLink } from 'walletlink'
import Web3Modal from 'web3modal'
import { Magic } from 'magic-sdk'

const getWeb3Modal = ({ withMagic = false, theme } = {}) => {
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
			...(withMagic
				? {
						'custom-magiclink': {
							display: {
								logo: '/img/logo_sm.png',
								name: 'Showtime Account',
								description: 'If you log in to Showtime with an email address, use this',
							},
							options: {
								apiKey: process.env.NEXT_PUBLIC_MAGIC_PUB_KEY,
							},
							package: Magic,
							connector: async (Magic, opts) => {
								const magic = new Magic(opts.apiKey)

								if (!(await magic.user.isLoggedIn()))
									await magic.auth.loginWithMagicLink({
										email: prompt('What email do you use to log into Showtime?'),
									})

								return magic.rpcProvider
							},
						},
				  }
				: {}),
		},
		theme,
	})

	web3Modal.clearCachedProvider()

	return web3Modal
}

export default getWeb3Modal
