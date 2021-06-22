import { useState } from 'react'
import { formatAddressShort, copyToClipBoard } from '@/lib/utilities'
import Tippy from '@tippyjs/react'
import CopyIcon from './Icons/CopyIcon'
import ChevronDown from './Icons/ChevronDown'

export const AddressCollection = ({ addresses }) => {
	const firstAddress = addresses[0]

	if (!firstAddress) return

	return (
		<div className="flex ml-1 space-x-2">
			<span className="border dark:border-gray-700 rounded-full px-3 py-1 text-sm flex items-center space-x-2 text-gray-800 dark:text-gray-400">
				<span className="font-medium">{firstAddress.ens_domain ? firstAddress.ens_domain : formatAddressShort(firstAddress.address)}</span>
				<button onClick={() => copyToClipBoard(firstAddress.ens_domain ? firstAddress.ens_domain : firstAddress.address)} className="p-1 -m-1 rounded-full">
					<CopyIcon className="w-4 h-4" />
				</button>
			</span>
			{addresses.length > 1 && (
				<button className="border dark:border-gray-700 rounded-full px-3 py-1 text-sm flex items-center space-x-2 text-gray-800 dark:text-gray-400">
					<span>+{addresses.length - 1} more</span>
					<ChevronDown className="w-4 h-4" />
				</button>
			)}
		</div>
	)
}

const AddressButton = ({ address, ens_domain }) => {
	const [isCopied, setIsCopied] = useState(false)

	return (
		<Tippy content={isCopied ? 'Copied!' : 'Copy'} hideOnClick={false}>
			<div
				className="py-1 px-3 rounded-full mr-1 md:mr-2 hover:bg-opacity-20 bg-black dark:bg-gray-700 text-gray-800 dark:text-gray-400 transition-all text-xs mt-1 md:mt-0 bg-opacity-10 cursor-pointer"
				key={address}
				onClick={() => {
					setIsCopied(true)
					copyToClipBoard(ens_domain ? ens_domain : address)
					setTimeout(() => setIsCopied(false), 1000)
				}}
			>
				{ens_domain ? ens_domain : formatAddressShort(address)}
			</div>
		</Tippy>
	)
}

export default AddressButton
