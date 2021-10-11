import { useContext, useState } from 'react'
import mixpanel from 'mixpanel-browser'
import { Magic } from 'magic-sdk'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import CloseButton from './CloseButton'
import { ethers } from 'ethers'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'
import { useTheme } from 'next-themes'
import useAuth from '@/hooks/useAuth'
import getWeb3Modal from '@/lib/web3Modal'
import { personalSignMessage } from '@/lib/utilities'
import clientAccessToken from '@/lib/client-access-token'
import { captureException } from '@sentry/nextjs'

export default function Modal({ isOpen }) {
	const context = useContext(AppContext)
	const { resolvedTheme } = useTheme()
	const { revalidate } = useAuth()
	const [signaturePending, setSignaturePending] = useState(false)

	const handleSubmitEmail = async event => {
		try {
			mixpanel.track('Login - email button click')
			event.preventDefault()

			const { elements } = event.target

			// Magic Link authenticates through email
			const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
			await magic.auth.loginWithMagicLink({ email: elements.email.value })
			const web3 = new ethers.providers.Web3Provider(magic.rpcProvider)
			context.setWeb3(web3)
			const user = await magic.user.getMetadata()
			const address = user.publicAddress

			const response_nonce = await backend.get(`/v1/getnonce?address=${address}`)

			const signature = await personalSignMessage(web3, process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + response_nonce.data.data)

			// Generate refresh/access token from Magic authenticated public address
			const response = await axios.post('/api/auth/login/signature', { signature, address })
			const isValidSignature = response.status === 200

			if (isValidSignature) {
				const accessToken = response?.data?.access
				const accessInterface = await clientAccessToken(accessToken)
				await accessInterface.setAccessToken(accessToken)
			}

			mixpanel.track('Login success - email')
			revalidate()

			if (!context?.user) context.getUserFromCookies()
			context.setLoginModalOpen(false)
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}
			//TODO: update this in notion
			captureException(error, {
				tags: {
					login_signature_flow: 'modalLogin.js',
					login_magic_link: 'modalLogin.js',
				},
			})
		}
	}

	const handleSubmitWallet = async () => {
		try {
			mixpanel.track('Login - wallet button click')

			const web3Modal = getWeb3Modal({ theme: resolvedTheme })
			const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())

			const address = await web3.getSigner().getAddress()
			const response_nonce = await backend.get(`/v1/getnonce?address=${address}`)

			setSignaturePending(true)
			const signature = await personalSignMessage(web3, process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + response_nonce.data.data)

			// login with our own API
			const response = await axios.post('/api/auth/login/signature', { signature, address })
			const isValidSignature = response.status === 200

			if (isValidSignature) {
				const accessToken = response?.data?.access
				const accessInterface = await clientAccessToken(accessToken)
				await accessInterface.setAccessToken(accessToken)
			}

			revalidate()
			mixpanel.track('Login success - wallet signature')

			if (!context?.user) context.getUserFromCookies()
			context.setLoginModalOpen(false)
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}
			//TODO: update this in notion
			captureException(error, {
				tags: {
					login_signature_flow: 'modalLogin.js',
				},
			})
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
										<input name="email" placeholder="Email" type="email" className="border-2 dark:border-gray-800 dark:bg-gray-800 w-full text-black dark:text-gray-300 rounded-lg p-3 focus:outline-none focus-visible:ring-1" autoFocus />

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
