import { useContext } from 'react'
//import { useRouter } from "next/router";
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import CommentIcon from './Icons/CommentIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment as faCommentOutline } from '@fortawesome/free-regular-svg-icons'
import { faComment as faCommentSolid } from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'

const CommentButton = ({ item, handleComment }) => {
	const context = useContext(AppContext)
	const { isMobile } = context
	const comment_count = (context.myCommentCounts && context.myCommentCounts[item?.nft_id]) || item.comment_count
	const commented = context.myComments?.includes(item.nft_id)

	const handleLoggedOutComment = () => {
		mixpanel.track('Commented but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Tippy content="Sign in to comment" disabled={context.user || isMobile}>
			<button className="focus:outline-none focus-visible:ring-1" disabled={context.disableComments} onClick={context.user ? handleComment : handleLoggedOutComment}>
				<div className={`flex flex-row items-center rounded-lg py-1 dark:text-gray-300 hover:text-blue-500 ${context.disableComments ? 'hover:text-gray-500 text-gray-500' : ''}`}>
					<div className={`flex ${commented ? 'text-blue-500 dark:text-blue-600' : 'hover:text-blue-400 dark:hover:text-blue-400'}`}>
						<CommentIcon className="w-5 h-5" />
					</div>
					<div className="ml-1 whitespace-nowrap">{comment_count}</div>
				</div>
			</button>
		</Tippy>
	)
}

export default CommentButton
