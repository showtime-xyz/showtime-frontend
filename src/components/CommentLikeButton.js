import { useContext } from 'react'
//import { useRouter } from "next/router";
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import axios from '@/lib/axios'

const CommentLikeButton = ({ comment }) => {
	const context = useContext(AppContext)
	const { isMobile } = context

	const handleCommentLike = async comment_id => {
		context.setMyCommentLikes([...context.myCommentLikes, comment_id])

		context.setMyCommentLikeCounts({
			...context.myCommentLikeCounts,
			[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) + 1,
		})

		// Post changes to the API
		try {
			await axios
				.post(`/api/likecomment/${comment_id}`)
				.then(() => {
					mixpanel.track('Liked comment')
				})
				.catch(err => {
					if (err.response.data.code === 429) {
						context.setMyCommentLikes(context.myCommentLikes.filter(item => !(item === comment_id)))

						context.setMyCommentLikeCounts({
							...context.myCommentLikeCounts,
							[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) - 0,
						})
						return context.setThrottleMessage(err.response.data.message)
					}
					console.error(err)
				})
		} catch (err) {
			console.error(err)
		}
	}

	const handleCommentUnlike = async comment_id => {
		context.setMyCommentLikes(context.myCommentLikes.filter(item => !(item === comment_id)))
		context.setMyCommentLikeCounts({
			...context.myCommentLikeCounts,
			[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) - 1,
		})
		// Post changes to the API
		await axios.post(`/api/unlikecomment/${comment_id}`)
		mixpanel.track('Unliked comment')
	}

	const like_count = context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.commment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count
	const liked = context.myCommentLikes?.includes(comment.comment_id)

	const handleLoggedOutCommentLike = () => {
		mixpanel.track('Liked comment but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Tippy content="Sign in to like" disabled={context.user || isMobile}>
			<button disabled={context.disableLikes} onClick={() => (context.user ? (liked ? handleCommentUnlike(comment.comment_id) : handleCommentLike(comment.comment_id)) : handleLoggedOutCommentLike())}>
				<div className={`flex flex-row items-center rounded-md py-1 hover:text-stred ${context.disableLikes ? 'hover:text-gray-500 text-gray-500' : ''}`}>
					<div className={`flex ${liked ? 'text-stred' : ''}`}>
						<FontAwesomeIcon className="!w-4 !h-4" icon={liked ? faHeartSolid : faHeartOutline} />
					</div>
					{like_count ? <div className="ml-1 text-xs whitespace-nowrap">{Number(like_count < 0 ? 0 : like_count).toLocaleString()}</div> : null}
				</div>
			</button>
		</Tippy>
	)
}

export default CommentLikeButton
