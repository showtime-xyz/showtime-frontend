import mixpanel from 'mixpanel-browser'
import copy from 'copy-to-clipboard'
import Tippy from '@tippyjs/react'
import { useState, useContext } from 'react'
import AppContext from '@/context/app-context'
import ShareIcon from './Icons/ShareIcon'

const ShareButton = ({ url, type }) => {
	const [isCopied, setIsCopied] = useState(false)
	const context = useContext(AppContext)

	const share = () => {
		if (!context.isMobile || !navigator.canShare?.({ url })) return copyToClipboard()

		navigator.share({ url }).then(() => mixpanel.track('Share link click', { type: type }))
	}

	const copyToClipboard = () => {
		copy(url)
		setIsCopied(true)

		mixpanel.track('Copy link click', { type: type })
		setTimeout(() => setIsCopied(false), 1000)
	}

	return (
		<Tippy disabled={context.isMobile} content={isCopied ? 'Copied link' : 'Copy link'} hideOnClick={false}>
			<button className="inline-flex rounded-lg group focus:outline-none focus-visible:ring-1" onClick={share}>
				<ShareIcon className="h-5 w-5 text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200 group-hover:text-gray-600 transition" />
			</button>
		</Tippy>
	)
}

export default ShareButton
