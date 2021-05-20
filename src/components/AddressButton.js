import { useState } from 'react'
import { formatAddressShort, copyToClipBoard } from '@/lib/utilities'
import Tippy from '@tippyjs/react'

const AddressButton = ({ address }) => {
	const [isCopied, setIsCopied] = useState(false)

	return (
		<Tippy content={isCopied ? 'Copied!' : 'Copy address'} hideOnClick={false}>
			<div
				className="py-1 px-3 rounded-full mr-1 md:mr-2 hover:bg-opacity-20 bg-black dark:bg-gray-700 text-gray-800 dark:text-gray-400 transition-all text-xs mt-1 md:mt-0 bg-opacity-10 cursor-pointer"
				key={address}
				onClick={() => {
					setIsCopied(true)
					copyToClipBoard(address)
					setTimeout(() => setIsCopied(false), 1000)
				}}
			>
				{formatAddressShort(address)}
			</div>
		</Tippy>
	)
}

export default AddressButton
