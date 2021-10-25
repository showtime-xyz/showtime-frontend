import { useContext, useState, useEffect } from 'react'
import mixpanel from 'mixpanel-browser'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import CloseButton from './CloseButton'
import { ethers } from 'ethers'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'
import GreenButton from '@/components/UI/Buttons/GreenButton'
import getWeb3Modal from '@/lib/web3Modal'
import { useTheme } from 'next-themes'
import { personalSignMessage } from '@/lib/utilities'

export default function Modal({ isOpen, setWalletModalOpen, walletAddresses }) {
	const context = useContext(AppContext)
	const { resolvedTheme } = useTheme()
	const [signaturePending, setSignaturePending] = useState(false)
	const [step, setStep] = useState(1)

	const [addressDetected, setAddressDetected] = useState(null)
	const [showInstructions, setShowInstructions] = useState(false)
	const [myWeb3Modal, setMyWeb3Modal] = useState(null)
	const [myProvider, setMyProvider] = useState(null)

	const connect = async () => {
		const web3 = new ethers.providers.Web3Provider(myProvider)
		setAddressDetected(await web3.getSigner().getAddress())

		try {
			myProvider.on('accountsChanged', async accounts => setAddressDetected(accounts[0]))
		} catch {
			//Coinbase wallet
		}
	}

	useEffect(() => {
		if (isOpen && myProvider) connect()

		return function cleanup() {
			if (myProvider && myProvider.close) myProvider.close()
		}
	}, [myProvider, isOpen])

	useEffect(() => {
		if (isOpen) setMyWeb3Modal(getWeb3Modal({ theme: resolvedTheme }))

		return function cleanup() {
			if (!myWeb3Modal) return

			myWeb3Modal.clearCachedProvider()
			myWeb3Modal.off()
		}
	}, [isOpen])

	const tryAgain = async () => {
		if (myProvider && myProvider.close) {
			await myProvider.close()

			// If the cached provider is not cleared,
			// WalletConnect will default to the existing session
			// and does not allow to re-scan the QR code with a new wallet.
			// Depending on your use case you may want or want not his behavir.
			await myWeb3Modal.clearCachedProvider()
			setMyProvider(null)
		}

		onConnect()
	}

	const onConnect = async () => {
		try {
			const provider = await myWeb3Modal.connect()
			setMyProvider(provider)

			context.setWeb3(new ethers.providers.Web3Provider(provider))
		} catch {
			setStep(1)
		}
	}

	const signMessage = async () => {
		const response_nonce = await backend.get(`/v1/getnonce?address=${addressDetected.toLowerCase()}`)

		const web3 = new ethers.providers.Web3Provider(myProvider)

		try {
			setSignaturePending(true)
			const signature = await personalSignMessage(web3, process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + ' ' + response_nonce.data.data)
			setSignaturePending(false)
			setStep(3)

			// login with our own API
			await axios
				.put('/api/auth/wallet/eth', { signature, addressDetected })
				.then(res => {
					setStep(4)
					return res.data
				})
				.then(async () => {
					// get our likes, follows, profile
					try {
						const my_info_data = await axios.get('/api/profile').then(res => res.data)
						context.setMyLikes(my_info_data.data.likes_nft)
						context.setMyFollows(my_info_data.data.follows)
						context.setMyProfile(my_info_data.data.profile)
					} catch (error) {
						console.error(error)
					}

					//router.push(`/${redirect}`)
					setWalletModalOpen(false)
					setStep(1)
					mixpanel.track('User added new Wallet')
				})
		} catch (err) {
			//throw new Error("You need to sign the message to be able to log in.");
			//console.log(err);
		} finally {
			setSignaturePending(false)
		}
	}

	const handleModalClose = () => {
		setWalletModalOpen(false)
		setStep(1)
		if (myWeb3Modal) {
			myWeb3Modal.clearCachedProvider()
			myWeb3Modal.off()
		}
		setSignaturePending(false)
		setShowInstructions(false)
	}

	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={handleModalClose} contentWidth="30rem">
					<div className="p-4">
						<CloseButton setEditModalOpen={handleModalClose} />
						<div className="dark:text-gray-300 text-2xl border-b-2 dark:border-gray-800 pb-2">{step == 1 ? 'Add Wallet' : step == 4 ? 'Success!' : signaturePending ? 'Almost there!' : walletAddresses.map(item => item.address.toLowerCase()).includes(addressDetected?.toLowerCase()) ? 'Switch Wallet' : 'Confirm Wallet'}</div>
						{step == 1 ? (
							<>
								<div className="my-4 py-4 dark:text-gray-400">Add one or more wallets to showcase all your NFTs in one place.</div>

								<div className="my-4 py-4 dark:text-gray-400">If you previously signed in with the wallet you are adding, your other profile will get merged into this profile.</div>
							</>
						) : step == 4 ? (
							<div className="text-center py-32 px-10 dark:text-gray-400">Successfully added the wallet to your profile</div>
						) : step == 3 ? null : (
							<div>
								{addressDetected ? (
									signaturePending ? null : (
										<>
											<div className="mt-4 dark:text-gray-400">Your wallet provider is giving us a wallet with the address:</div>
											<div className="mb-4 text-base text-indigo-500 dark:text-indigo-600">
												<pre>{addressDetected}</pre>
											</div>
											<>
												{walletAddresses.map(item => item.address.toLowerCase()).includes(addressDetected?.toLowerCase()) ? (
													<>
														<div className="py-4">
															<span>
																<span className="text-red-500 dark:text-red-700">This wallet is already on your Showtime profile. Please switch to a different wallet in your provider's menu.</span>{' '}
															</span>
														</div>
														<div className="py-4 ">
															<div className="dark:text-gray-400">For MetaMask:</div>
															<div className="text-gray-500">Switch wallets by clicking on the MetaMask icon in the toolbar, then clicking the circle icon on the top right (the account switcher). If you get a warning "Your current account is not connected," make sure to click "Connect."</div>
														</div>
														<div className="py-4">
															<div className="dark:text-gray-400">For WalletConnect:</div>
															<div className="text-gray-500">
																<a
																	href="#"
																	onClick={() => {
																		tryAgain()
																	}}
																	className="text-indigo-500 dark:text-indigo-600"
																>
																	Click here
																</a>{' '}
																to start over and pick a new wallet.
															</div>
														</div>
													</>
												) : (
													<>
														<div className="py-4 dark:text-gray-400">Please confirm this is the correct wallet and click "Sign to finish" below.</div>
														{showInstructions ? (
															<>
																<div className="py-4 text-base">
																	<span className="text-gray-400">
																		For MetaMask: <br />
																	</span>{' '}
																	<div className="text-gray-500">Switch wallets by clicking on the MetaMask icon in the toolbar, then clicking the circle icon on the top right (the account switcher). If you get a warning "Your current account is not connected," make sure to click "Connect."</div>
																</div>
																<div className="py-4 text-base">
																	<span className="text-gray-400">
																		For Wallet Connect: <br />
																	</span>
																	<div className="text-gray-500">
																		<a
																			href="#"
																			onClick={() => {
																				tryAgain()
																			}}
																			className="text-indigo-500"
																		>
																			Click here
																		</a>{' '}
																		to start over and pick a new wallet.
																	</div>
																</div>
															</>
														) : (
															<div className="pt-4 pb-2 text-base dark:text-gray-400">
																Wrong wallet?{' '}
																<a
																	href="#"
																	onClick={() => {
																		setShowInstructions(true)
																	}}
																	className="text-indigo-500 dark:text-indigo-600"
																>
																	Learn how to switch
																</a>
															</div>
														)}
													</>
												)}
											</>
										</>
									)
								) : (
									<div className="my-16 text-center dark:text-gray-400">Select a wallet provider...</div>
								)}
							</div>
						)}

						{signaturePending ? (
							<div className="text-center py-40 px-10 dark:text-gray-400">Please sign the message we're sending to your wallet...</div>
						) : step == 3 ? (
							<div className="text-center py-40 px-10 dark:text-gray-400">Adding wallet and any history, please wait...</div>
						) : walletAddresses.map(item => item.address.toLowerCase()).includes(addressDetected?.toLowerCase()) && step != 1 ? null : (
							<>
								<div className="mt-4 mb-0 pt-4 text-center border-t-2 dark:border-gray-800">
									{step == 1 ? (
										<button
											className="border-2 border-transparent text-white dark:text-gray-900 bg-stpink hover:border-stpink hover:bg-transparent hover:text-stpink dark:hover:text-stpink transition py-2 px-4 rounded-full"
											onClick={() => {
												setStep(2)
												onConnect()
											}}
										>
											Select wallet to add
										</button>
									) : step == 4 ? null : step == 3 ? null : addressDetected ? (
										walletAddresses.map(item => item.address.toLowerCase()).includes(addressDetected?.toLowerCase()) ? null : (
											<GreenButton className="float-none" onClick={signMessage}>
												Sign to finish
											</GreenButton>
										)
									) : null}
								</div>
							</>
						)}
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
