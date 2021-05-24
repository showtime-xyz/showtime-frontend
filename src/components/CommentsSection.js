import { useEffect, useState, useContext, useCallback } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import AppContext from '@/context/app-context'
import backend from '@/lib/backend'
import mixpanel from 'mixpanel-browser'
import Comment from './Comment'
import { Mention, MentionsInput } from 'react-mentions'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { formatAddressShort } from '@/lib/utilities'
import axios from '@/lib/axios'
import ModalUserList from './ModalUserList'
import GhostButton from './UI/Buttons/GhostButton'

// TODO: Convert to classes and include it into the MentionsInput component
const mentionsStyle = {
	control: {
		fontSize: 14,
		borderRadius: 10,
	},

	'&multiLine': {
		control: {
			minHeight: 63,
		},
		highlighter: {
			padding: 9,
			borderRadius: 10,
		},
		input: {
			padding: 9,
			borderRadius: 8,
		},
	},

	'&singleLine': {
		display: 'inline-block',
		width: 180,

		highlighter: {
			padding: 1,
			border: '2px inset transparent',
		},
		input: {
			padding: 1,
			border: '2px inset',
			borderRadius: 10,
		},
	},

	suggestions: {
		background: 'transparent',
		list: {
			background: null,
			fontSize: 14,
			borderRadius: 10,
			overflow: 'hidden',
		},
	},
}

export default function CommentsSection({ item, closeModal, modalRef, commentCount }) {
	const { nft_id: nftId, owner_id: nftOwnerId, creator_id: nftCreatorId, owner_count: ownerCount } = item
	const context = useContext(AppContext)
	const { user } = context
	const [loadingComments, setLoadingComments] = useState(true)
	const [loadingMoreComments, setLoadingMoreComments] = useState(true)
	const [hasMoreComments, setHasMoreComments] = useState(false)
	const [comments, setComments] = useState()
	const [commentText, setCommentText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [focused, setFocused] = useState(false)
	const [likedByUserList, setLikedByUserList] = useState(false)

	const handleSearchQuery = (mentionSearchText, callback) => {
		if (!mentionSearchText) return
		return backend
			.get(`/v1/search?q=${mentionSearchText}&limit=5&nft_id=${nftId}`, {
				method: 'get',
			})
			.then(res => res?.data?.data || [])
			.then(res =>
				res.map(r => ({
					username: r.username,
					id: r.username || r.address0,
					address: r.address0,
					display: r.name || formatAddressShort(r.address0),
					img_url: r.img_url || DEFAULT_PROFILE_PIC,
				}))
			)
			.then(callback)
	}

	const handleDebouncedSearchQuery = useCallback(AwesomeDebouncePromise(handleSearchQuery, 300), [])

	const refreshComments = async () => {
		const commentsData = await backend.get(`/v2/comments/${nftId}${hasMoreComments ? '' : '?limit=10'}`)
		setComments(commentsData.data.data.comments)
		setHasMoreComments(commentsData.data.data.has_more)
		setLoadingComments(false)
	}

	useEffect(() => {
		setHasMoreComments(false)
		setLoadingComments(true)
		setLoadingMoreComments(false)
		refreshComments()
		return () => setComments(null)
	}, [nftId])

	useEffect(() => {
		context.setCommentInputFocused(focused)
	}, [focused])

	const handleGetMoreComments = async () => {
		setLoadingMoreComments(true)
		await refreshComments(nftId)
		setLoadingMoreComments(false)
		setHasMoreComments(false)
	}

	const createComment = async () => {
		setIsSubmitting(true)
		// post new comment
		try {
			await axios
				.post('/api/createcomment', { nftId, message: commentText })
				.then(() => {
					// pull new comments
					refreshComments(false)
					storeCommentInContext()
					mixpanel.track('Comment created')
				})
				.catch(err => {
					if (err.response.data.code === 429) {
						return context.setThrottleMessage(err.response.data.message)
					}
					console.error(err)
				})
		} catch (err) {
			console.error(err)
		}

		// clear state
		setCommentText('')
		setIsSubmitting(false)
	}

	const deleteComment = async commentId => {
		// post new comment
		await axios.post('/api/deletecomment', { commentId })

		removeCommentFromContext()
		mixpanel.track('Comment deleted')
		// pull new comments
		await refreshComments(false)
	}

	const handleLoggedOutComment = () => {
		context.setLoginModalOpen(true)
		mixpanel.track('Commented but logged out')
	}

	const storeCommentInContext = async () => {
		const myCommentCounts = context.myCommentCounts
		const newAmountOfMyComments = ((myCommentCounts && myCommentCounts[nftId]) || commentCount) + 1

		context.setMyCommentCounts({
			...context.myCommentCounts,
			[nftId]: newAmountOfMyComments,
		})
		if (newAmountOfMyComments === 1) {
			context.setMyComments([...context.myComments, nftId])
		}
	}

	const removeCommentFromContext = async () => {
		const myCommentCounts = context.myCommentCounts
		const newAmountOfMyComments = ((myCommentCounts && myCommentCounts[nftId]) || commentCount) - 1
		context.setMyCommentCounts({
			...context.myCommentCounts,
			[nftId]: newAmountOfMyComments,
		})
		if (newAmountOfMyComments === 0) {
			context.setMyComments(context.myComments.filter(item => !(item === nftId)))
		}
	}

	const closeLikedByModal = () => {
		setLikedByUserList(null)
	}

	return (
		<div className="w-full">
			{/* Comments */}
			<div id="CommentsSectionScroll">
				{loadingComments ? (
					<div className="text-center my-4">
						<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
					</div>
				) : (
					<>
						<div className="py-2 px-4 border-2 border-gray-300 dark:border-gray-800 rounded-xl">
							{hasMoreComments && (
								<div className="flex flex-row items-center my-2 justify-center">
									{!loadingMoreComments ? (
										<div className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 dark:border-gray-800 rounded-full dark:text-gray-600 hover:text-stpink dark:hover:text-stpink hover:border-stpink cursor-pointer transition-all" onClick={handleGetMoreComments}>
											<div className="mr-2 text-sm">Show Earlier Comments</div>
										</div>
									) : (
										<div className="p-1">
											<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
										</div>
									)}
								</div>
							)}
							<div className="mb-4">{comments.length > 0 ? comments.map(comment => <Comment comment={comment} key={comment.comment_id} closeModal={closeModal} modalRef={modalRef} deleteComment={deleteComment} nftOwnerId={ownerCount > 0 ? null : nftOwnerId} nftCreatorId={nftCreatorId} openLikedByModal={setLikedByUserList} />) : <div className="my-2 mb-3 p-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-xl">No comments yet.</div>}</div>
							{/* New Comment */}
							<div className="my-2 flex items-center flex-col md:flex-row">
								<MentionsInput
									value={commentText}
									onChange={e => setCommentText(e.target.value)}
									onFocus={() => setFocused(true)}
									onBlur={() => setFocused(false)}
									disabled={context.disableComments}
									placeholder="Your comment..."
									classNames={{
										mentions: 'dark:bg-gray-700 border dark:border-gray-800 rounded-lg flex-grow md:mr-2 w-full md:w-auto mb-2 md:mb-0',
										mentions__input: 'focus:outline-none focus-visible:ring-1 dark:text-gray-300',
										mentions__suggestions__list: 'rounded-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden',
									}}
									allowSuggestionsAboveCursor
									allowSpaceInQuery
									style={mentionsStyle}
									maxLength={240}
								>
									<Mention
										renderSuggestion={s => (
											<div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-1">
												<img src={s.img_url} className="h-6 w-6 mr-2 rounded-full" />
												<span className="dark:text-gray-300">{s.display}</span>
												{s.username && <span className="text-gray-400 ml-2">@{s.username}</span>}
											</div>
										)}
										displayTransform={(id, display) => `${display}`}
										trigger="@"
										data={handleDebouncedSearchQuery}
										className="border-2 border-transparent bg-purple-200 dark:bg-gray-800 rounded -ml-1"
										appendSpaceOnAdd
									/>
								</MentionsInput>
								<GhostButton loading={isSubmitting} onClick={!user ? handleLoggedOutComment : createComment} disabled={isSubmitting || !commentText || commentText === '' || commentText.trim() === '' || context.disableComments} className="rounded-lg w-full md:w-auto">
									Post
								</GhostButton>
							</div>
						</div>
					</>
				)}
			</div>
			{likedByUserList && <ModalUserList onRedirect={closeModal} isOpen={likedByUserList} title="Comment Likes" closeModal={closeLikedByModal} users={likedByUserList} emptyMessage="No one has liked this yet!" />}
		</div>
	)
}
