import { formatAddressShort, copyToClipBoard } from '@/lib/utilities'
import CopyIcon from './Icons/CopyIcon'
import ChevronDown from './Icons/ChevronDown'
import { Popover, Transition } from '@headlessui/react'
import EthereumIcon from './Icons/EthereumIcon'
import TezosIcon from './Icons/TezosIcon'
import Link from 'next/link'

export const AddressCollection = ({ addresses, isMyProfile = false }) => {
	const firstAddress = addresses[0]

	if (!firstAddress) return

	return (
		<Popover className="relative">
			<div className="flex md:ml-1 space-x-2">
				<AddressButton {...firstAddress} />
				{(addresses.length > 1 || isMyProfile) && (
					<>
						<Popover.Button className={({ open }) => `border rounded-full px-3 py-1 text-sm flex items-center space-x-2 text-gray-800 dark:text-gray-400 font-medium ${open ? 'bg-gray-100 dark:bg-gray-800 border-transparent' : 'dark:border-gray-700'}`}>
							{addresses.length > 1 && <span>+{addresses.length - 1} more</span>}
							<ChevronDown className="w-4 h-4" />
						</Popover.Button>
						<Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
							<Popover.Panel className="absolute z-20 top-10 right-0 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 shadow rounded-xl">
								<div className="space-y-3">
									{addresses
										.filter((a, i) => i !== 0)
										.map(({ address, ens_domain }) => (
											<div key={address} className="flex items-center space-x-4">
												{address.startsWith('tz') ? <TezosIcon className="w-6 h-auto text-gray-500 dark:text-gray-600" /> : <EthereumIcon className="w-6 h-auto text-gray-500 dark:text-gray-600" />}
												<AddressButton address={address} ens_domain={ens_domain} />
											</div>
										))}
								</div>
								{isMyProfile && (
									<>
										{addresses.length > 1 && <hr className="my-4 w-full dark:border-gray-800" />}
										<Link href="/wallet">
											<a className="block text-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-400 px-4 py-3 rounded-2xl w-full font-medium transition">Manage Wallets</a>
										</Link>
									</>
								)}
							</Popover.Panel>
						</Transition>
					</>
				)}
			</div>
		</Popover>
	)
}

const AddressButton = ({ address, ens_domain }) => {
	return (
		<span className="border dark:border-gray-700 rounded-full px-3 py-1 text-sm flex items-center space-x-2 text-gray-800 dark:text-gray-400">
			<span className="font-medium whitespace-nowrap">{formatAddressShort(ens_domain || address)}</span>
			<button onClick={() => copyToClipBoard(ens_domain || address)} className="p-1 -m-1 rounded-full">
				<CopyIcon className="w-4 h-4" />
			</button>
		</span>
	)
}

export default AddressButton
