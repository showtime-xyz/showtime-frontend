import Layout from '@/components/layout'
import AppContext from '@/context/app-context'
import { classNames } from '@/lib/utilities'
import { Fragment, useContext, useEffect, useState } from 'react'
import { DAppClient, PermissionScope, SigningType } from '@airgap/beacon-sdk'
import ModalAddWallet from '@/components/ModalAddWallet'
import axios from '@/lib/axios'
import backend from '@/lib/backend'
import { Menu, Transition } from '@headlessui/react'
import ModalAddEmail from '@/components/ModalAddEmail'

let dAppClient
if (typeof window !== 'undefined') dAppClient = new DAppClient({ name: 'Showtime' })

const Wallet = () => {
	const { myProfile, user, setLoginModalOpen } = useContext(AppContext)
	const [walletModalOpen, setWalletModalOpen] = useState(false)
	const [emailModalOpen, setEmailModalOpen] = useState(false)
	const [hasEmailAddress, setHasEmailAddress] = useState(false)

	useEffect(() => {
		if (!myProfile) return

		setHasEmailAddress(myProfile.wallet_addresses_v2.length !== myProfile.wallet_addresses_excluding_email_v2.length)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myProfile?.wallet_addresses_v2])

	const loginWithTezos = async () => {
		const activeAccount = await dAppClient.getActiveAccount()
		let tezosAddr, tezosPk

		if (activeAccount) [tezosAddr, tezosPk] = [activeAccount.address, activeAccount.publicKey]
		else [tezosAddr, tezosPk] = await dAppClient.requestPermissions({ scopes: [PermissionScope.SIGN] }).then(permissions => [permissions.address, permissions.publicKey])

		const {
			data: { data: nonce },
		} = await backend.get(`/v1/getnonce?address=${tezosAddr}`)

		const { signature } = await dAppClient.requestSignPayload({ signingType: SigningType.RAW, payload: process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + nonce })
		await axios.put('/api/auth/wallet/tz', { address: tezosAddr, signature, publicKey: tezosPk })

		dAppClient.clearActiveAccount()
	}

	//TODO: Revalidate state instead of this when we switch away from context
	const [walletAddresses, setWalletAddresses] = useState(null)

	useEffect(() => {
		setWalletAddresses(myProfile?.wallet_addresses_excluding_email_v2)
	}, [myProfile?.wallet_addresses_excluding_email_v2])

	const unlinkAddress = async address => {
		if (address.toLowerCase() === user.publicAddress) return

		await axios.delete('/api/auth/wallet', { address })

		setWalletAddresses(walletAddresses => walletAddresses.filter(({ address: stateAddr }) => stateAddr !== address))
	}

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalAddWallet isOpen={walletModalOpen} setWalletModalOpen={setWalletModalOpen} walletAddresses={myProfile?.wallet_addresses_v2} />
					<ModalAddEmail isOpen={emailModalOpen} setEmailModalOpen={setEmailModalOpen} setHasEmailAddress={setHasEmailAddress} />
				</>
			) : null}
			<Layout>
				<div className="flex-1 flex items-center justify-center">
					{myProfile ? (
						<div className="flex flex-col">
							<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
								<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
									<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
										<div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
											<div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
												<div className="ml-4 mt-2">
													<h3 className="text-lg leading-6 font-medium text-gray-900">Wallets</h3>
												</div>
												<div className="ml-4 mt-2 flex-shrink-0">
													<Menu as="div" className="relative inline-block text-left">
														{({ open }) => (
															<>
																<div>
																	<Menu.Button className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Connect Wallet</Menu.Button>
																</div>

																<Transition show={open} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
																	<Menu.Items static className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
																		<div className="py-1">
																			<Menu.Item>
																				{({ active }) => (
																					<button onClick={() => setWalletModalOpen(true)} className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm')}>
																						Link Ethereum wallet
																					</button>
																				)}
																			</Menu.Item>
																			<Menu.Item>
																				{({ active }) => (
																					<button onClick={loginWithTezos} className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm')}>
																						Link Tezos wallet
																					</button>
																				)}
																			</Menu.Item>
																			{!hasEmailAddress && (
																				<Menu.Item>
																					{({ active }) => (
																						<button onClick={() => setEmailModalOpen(true)} className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm')}>
																							Link Email Address
																						</button>
																					)}
																				</Menu.Item>
																			)}
																		</div>
																	</Menu.Items>
																</Transition>
															</>
														)}
													</Menu>
												</div>
											</div>
										</div>
										<table className="min-w-full divide-y divide-gray-200">
											<tbody>
												{walletAddresses?.map(({ address, ens_domain }, i) => (
													<tr key={address} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ens_domain || address}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{address.startsWith('tz') ? 'Tezos' : 'Ethereum'}</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															{address.toLowerCase() === user.publicAddress ? (
																<span className="text-gray-600">Active</span>
															) : (
																<button onClick={() => unlinkAddress(address)} className="text-red-600 hover:text-red-900 transition">
																	Unlink
																</button>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-white shadow sm:rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg leading-6 font-medium text-gray-900">Log in to manage your wallets</h3>
								<div className="mt-2 max-w-xl text-sm text-gray-500">
									<p>Once you're logged in, you'll be able to connect and disconnect your Ethereum and Tezos wallets.</p>
								</div>
								<div className="mt-5">
									<button onClick={() => setLoginModalOpen(true)} type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-stpink bg-stpink bg-opacity-20 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stpink sm:text-sm transition">
										Sign in to Showtime
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</Layout>
		</>
	)
}

export default Wallet
