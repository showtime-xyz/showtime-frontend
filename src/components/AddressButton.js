import { useState } from 'react'
import { formatAddressShort, copyToClipBoard } from '@/lib/utilities'
import Tippy from '@tippyjs/react'

const AddressButton = ({ address, ens_domain }) => {
	console.log(ens_domain)
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
