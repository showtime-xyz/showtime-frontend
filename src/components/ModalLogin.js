import { useContext, useState } from 'react'
import mixpanel from 'mixpanel-browser'
import { Magic } from 'magic-sdk'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletLink } from 'walletlink'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import CloseButton from './CloseButton'
import { ethers } from 'ethers'
import Fortmatic from 'fortmatic'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'
import { useTheme } from 'next-themes'
import { Biconomy } from '@biconomy/mexa'
import useAuth from '@/hooks/useAuth'

export default function Modal({ isOpen }) {
	const context = useContext(AppContext)
	const { resolvedTheme } = useTheme()
	const { revalidate } = useAuth()
	const [signaturePending, setSignaturePending] = useState(false)

	const handleSubmitEmail = async event => {
		mixpanel.track('Login - email button click')
		event.preventDefault()

		const { elements } = event.target

		// the magic code
		const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
		try {
			const did = await magic.auth.loginWithMagicLink({ email: elements.email.value })
			context.setWeb3(new ethers.providers.Web3Provider(new Biconomy(new ethers.providers.Web3Provider(magic.rpcProvider).provider, { apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, debug: true })))

			// Once we have the did from magic, login with our own API
			await axios.post(
				'/api/auth/login',
				{},
				{
					headers: { Authorization: `Bearer ${did}` },
				}
			)

			mixpanel.track('Login success - email')
			revalidate()

			if (!context?.user) context.getUserFromCookies()
			context.setLoginModalOpen(false)
		} catch {
			/* handle errors */
		}
	}

	const handleSubmitWallet = async () => {
		mixpanel.track('Login - wallet button click')

		var providerOptions = {
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
				package: Fortmatic, // required
				options: {
					key: process.env.NEXT_PUBLIC_FORTMATIC_PUB_KEY, // required
				},
			},
		}
		if (!context.isMobile) {
			providerOptions = {
				...providerOptions,
				'custom-walletlink': {
					display: {
						logo: '/coinbase.svg',
						name: 'Coinbase',
						description: 'Use Coinbase Wallet app on mobile device',
					},
					options: {
						appName: 'Showtime', // Your app name
						networkUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
						chainId: process.env.NEXT_PUBLIC_CHAINID,
					},
					package: WalletLink,
					connector: async (_, options) => {
						const { appName, networkUrl, chainId } = options
						const walletLink = new WalletLink({
							appName,
						})
						const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
						await provider.enable()
						return provider
					},
				},
			}
		}

		const web3Modal = new Web3Modal({
			network: 'mainnet', // optional
			cacheProvider: true, // optional
			providerOptions, // required
			theme: resolvedTheme,
		})

		let web3
		if (!context.web3) {
			const provider = await web3Modal.connect()

			web3 = new ethers.providers.Web3Provider(new Biconomy(new ethers.providers.Web3Provider(provider).provider, { apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, debug: false }))

			context.setWeb3(web3)
		} else web3 = context.web3

		const address = await web3.getSigner().getAddress()
		const response_nonce = await backend.get(`/v1/getnonce?address=${address}`)

		try {
			setSignaturePending(true)
			const signature = await web3.getSigner().signMessage(process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + response_nonce.data.data)

			// login with our own API
			await axios.post('/api/auth/login/signature', { signature, address })

			revalidate()
			mixpanel.track('Login success - wallet signature')

			if (!context?.user) context.getUserFromCookies()
			context.setLoginModalOpen(false)
		} catch (err) {
			//throw new Error("You need to sign the message to be able to log in.");
			//console.log(err);
		} finally {
			setSignaturePending(false)
		}
	}

	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={() => context.setLoginModalOpen(false)} contentWidth="25rem">
					<div className="p-4">
						<div className="text-2xl dark:text-gray-300 border-b-2 dark:border-gray-800 pb-2">Sign in</div>
						<CloseButton setEditModalOpen={context.setLoginModalOpen} />
						{signaturePending ? (
							<div className="text-center py-40 dark:text-gray-400">Pushed a request to your wallet...</div>
						) : (
							<>
								<form onSubmit={handleSubmitEmail}>
									<div className="text-center pt-8">
										<div>
											<label htmlFor="email" className="pb-4 dark:text-gray-400">
												Enter your email to receive a sign in link.
											</label>
											<div className="pt-1 pb-1 text-xs text-gray-700 dark:text-gray-500">If this is your first time, it will create a new account.</div>
										</div>
										<br />
										<input name="email" placeholder="Email" type="email" className="border-2 dark:border-gray-800 w-full text-black dark:text-gray-300 rounded-lg p-3 focus:outline-none focus-visible:ring-1" autoFocus />

										<div className="pt-8 pb-8 text-gray-700 dark:text-gray-500 text-xs">
											By signing in you agree to our{' '}
											<a className="dark:text-gray-400" href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68" target="_blank" rel="noreferrer">
												Terms &amp; Conditions
											</a>
											.
										</div>

										<button className="bg-stpink text-white dark:text-gray-900 rounded-full px-6 py-2 cursor-pointer border-2 hover:text-stpink hover:bg-white dark:hover:bg-gray-900 dark:hover:text-stpink border-stpink transition">
											<span className="text-sm md:text-base">Sign in with Email</span>
										</button>
										<div className="py-6 text-gray-700 dark:text-gray-600">— or —</div>
									</div>
								</form>

								<div className="mb-4 text-center">
									<button className="bg-black text-white dark:text-gray-300 border-black rounded-full px-6 py-2 cursor-pointer border-2 hover:text-black hover:bg-white dark:hover:bg-gray-800 dark:hover:border-gray-800 transition focus:outline-none focus-visible:ring-1" onClick={() => handleSubmitWallet()}>
										<span className="text-sm md:text-base">Sign in with Wallet</span>
									</button>
								</div>
							</>
						)}
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
