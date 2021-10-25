import { useContext } from 'react'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import _ from 'lodash'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import Tippy from '@tippyjs/react'
import axios from '@/lib/axios'

const CommentLikeButton = ({ comment, openLikedByModal }) => {
	const context = useContext(AppContext)
	const { isMobile } = context

	const handleCommentLike = async comment_id => {
		context.setMyCommentLikes([...context.myCommentLikes, comment_id])

		context.setMyCommentLikeCounts({
			...context.myCommentLikeCounts,
			[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) + 1,
		})

		// Post changes to the API
		await axios
			.post(`/api/likecomment/${comment_id}`)
			.then(() => mixpanel.track('Liked comment'))
			.catch(err => {
				if (err.response.data.code === 429) {
					context.setMyCommentLikes(context.myCommentLikes.filter(item => !(item === comment_id)))

					context.setMyCommentLikeCounts({
						...context.myCommentLikeCounts,
						[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) - 0,
					})
					return context.setThrottleMessage(err.response.data.message)
				}

				throw err
			})
	}

	const handleCommentUnlike = async comment_id => {
		context.setMyCommentLikes(context.myCommentLikes.filter(item => !(item === comment_id)))
		context.setMyCommentLikeCounts({
			...context.myCommentLikeCounts,
			[comment_id]: (context.myCommentLikeCounts && !_.isNil(context.myCommentLikeCounts[comment?.comment_id]) ? context.myCommentLikeCounts[comment?.comment_id] : comment.like_count) - 1,
		})
		// Post changes to the API
		await axios.post(`/api/unlikecomment/${comment_id}`).then(() => mixpanel.track('Unliked comment'))
	}

	const like_count = context.myCommentLikeCounts?.[comment.comment_id] ?? comment.like_count
	const liked = context.myCommentLikes?.includes(comment.comment_id)

	const handleLoggedOutCommentLike = () => {
		mixpanel.track('Liked comment but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Tippy content="Sign in to like" disabled={context.user || isMobile}>
			<div className="flex items-center">
				<button disabled={context.disableLikes} onClick={() => (context.user ? (liked ? handleCommentUnlike(comment.comment_id) : handleCommentLike(comment.comment_id)) : handleLoggedOutCommentLike())}>
					<div className={`flex flex-row items-center rounded-md py-1 hover:text-stred ${context.disableLikes ? 'hover:text-gray-500 text-gray-500' : 'text-gray-500 dark:text-gray-600 dark:hover:text-stred'}`}>
						<div className={`flex ${liked ? 'text-stred' : ''}`}>{liked ? <HeartIconSolid className="w-4 h-4" /> : <HeartIconOutline className="w-4 h-4" />}</div>
					</div>
				</button>
				{like_count ? (
					<button onClick={() => openLikedByModal(_.isEmpty(comment.likers) ? [context.myProfile] : comment.likers)}>
						<div className="ml-1 text-xs whitespace-nowrap text-gray-600 dark:text-gray-500 tabular-nums">{Number(like_count < 0 ? 0 : like_count).toLocaleString()}</div>
					</button>
				) : null}
			</div>
		</Tippy>
	)
}

export default CommentLikeButton
