import Layout from '@/components/layout'
import AppContext from '@/context/app-context'
import { formatAddressShort } from '@/lib/utilities'
import { CreditCardIcon } from '@heroicons/react/solid'
import { useContext } from 'react'
import { DAppClient, PermissionScope, SigningType } from '@airgap/beacon-sdk'
import axios from '@/lib/axios'
import backend from '@/lib/backend'

const dAppClient = new DAppClient({ name: 'Showtime' })

const Wallet = () => {
	const { myProfile, user, setLoginModalOpen } = useContext(AppContext)

	const loginWithTezos = async () => {
		const activeAccount = await dAppClient.getActiveAccount()
		let tezosAddr, tezosPk

		if (activeAccount) [tezosAddr, tezosPk] = [activeAccount.address, activeAccount.publicKey]
		else [tezosAddr, tezosPk] = await dAppClient.requestPermissions().then(permissions => [permissions.address, permissions.publicKey])

		const {
			data: { data: nonce },
		} = await backend.get(`/v1/getnonce?address=${tezosAddr}`)

		const { signature } = await dAppClient.requestSignPayload({ signingType: SigningType.RAW, payload: process.env.NEXT_PUBLIC_SIGNING_MESSAGE_ADD_WALLET + nonce })

		await axios.put('/api/auth/wallet/tz', { address: tezosAddr, signature, publicKey: tezosPk })
	}

	return (
		<Layout>
			<div className="flex-1 flex items-center justify-center">
				{myProfile ? (
					<div className="w-full h-full flex items-center justify-center -space-x-24">
						{myProfile.wallet_addresses_v2.map(({ address, ens_domain }) => (
							<div key={address} className={'bg-white overflow-hidden shadow rounded-lg transform hover:-translate-y-10 transition hover:z-10'}>
								<div className="p-5">
									<div className="flex items-center">
										<div className="ml-5 w-0 flex-1">
											<dl>
												<dt className="text-sm font-medium text-gray-500 truncate flex items-center space-x-2">
													<div className="flex-shrink-0">
														<CreditCardIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
													</div>
													<span>Ethereum {address.toLowerCase() === user.publicAddress && '(Current)'}</span>
												</dt>
												<dd>
													<div className="text-lg font-medium text-gray-900">{ens_domain || formatAddressShort(address)}</div>
												</dd>
											</dl>
										</div>
									</div>
								</div>
								<div className="bg-gray-50 px-5 py-3">
									<div className="text-sm">
										<a href="#" onClick={loginWithTezos} className="font-medium text-cyan-700 hover:text-cyan-900">
											Login with Tezos
										</a>
									</div>
								</div>
							</div>
						))}
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
	)
}

export default Wallet
