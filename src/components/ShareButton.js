import mixpanel from 'mixpanel-browser'
import copy from 'copy-to-clipboard'
import Tippy from '@tippyjs/react'
import { useState } from 'react'

const ShareButton = ({ url, type }) => {
	const [isCopied, setIsCopied] = useState(false)

	const share = () => {
		if (!navigator.canShare?.({ url })) return copyToClipboard()

		navigator.share({ url }).then(() => mixpanel.track('Share link click', { type: type }))
	}

	const copyToClipboard = () => {
		copy(url)
		setIsCopied(true)

		mixpanel.track('Copy link click', { type: type })
		setTimeout(() => setIsCopied(false), 1000)
	}

	return (
		<Tippy content={isCopied ? 'Copied link' : 'Copy link'} hideOnClick={false}>
			<button className="inline-flex rounded-lg group" onClick={share}>
				<svg className="h-5 w-5 items-center flex text-gray-800 group-hover:text-gray-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
			</button>
		</Tippy>
	)
}

export default ShareButton
