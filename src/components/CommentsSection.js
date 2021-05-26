import { useEffect, useState, useContext, useCallback, createRef } from 'react'
import { DEFAULT_PROFILE_PIC, MENTIONS_STYLE } from '@/lib/constants'
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
import { XIcon } from '@heroicons/react/solid'

export default function CommentsSection({ item, closeModal, modalRef, commentCount }) {
	const context = useContext(AppContext)
	const { user } = context
	let refArray = []

	const { nft_id: nftId, owner_id: nftOwnerId, creator_id: nftCreatorId, owner_count: ownerCount } = item

	const [comments, setComments] = useState([])
	const [commentText, setCommentText] = useState('')
	const [parentComment, setParentComment] = useState(null)
	const [siblingComment, setSiblingComment] = useState(null)
	const [replyActive, setReplyActive] = useState(false)
	const [loadingComments, setLoadingComments] = useState(true)
	const [hasMoreComments, setHasMoreComments] = useState(false)
	const [loadingMoreComments, setLoadingMoreComments] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [mentionAdded, setMentionAdded] = useState(false)
	const [likedByUserList, setLikedByUserList] = useState(false)
	const [localFocus, setLocalFocus] = useState(false)

	const handleSearchQuery = (mentionSearchText, callback) => {
		if (!mentionSearchText) return
		return backend
			.get(`/v1/search?q=${mentionSearchText}&limit=5&nft_id=${nftId}`)
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
			.then(res => {
				callback(res)
				if (parentComment || siblingComment) {
					res.find(r => {
						if (r.username === mentionSearchText) {
							let list = document.querySelector('div.st-mentions-input ul')
							if (list) {
								setMentionAdded(true)
								list.style.display = 'none'
							}
						}
					})
				}
			})
	}

	const handleDebouncedSearchQuery = useCallback(AwesomeDebouncePromise(handleSearchQuery, 300), [])

	const refreshComments = async () => {
		const commentsData = await backend.get(`/v2/comments/${nftId}${hasMoreComments ? '' : '?limit=10'}`)
		setComments(commentsData.data.data.comments)
		setHasMoreComments(commentsData.data.data.has_more)
		setLoadingComments(false)
	}

	const handleGetMoreComments = async () => {
		setLoadingMoreComments(true)
		await refreshComments(nftId)
		setLoadingMoreComments(false)
		setHasMoreComments(false)
	}

	const handleReply = comment => {
		setLocalFocus(true)
		setParentComment(null)
		setSiblingComment(null)

		if (comment.parent_id) {
			setParentComment(comments.find(com => com.comment_id === comment.parent_id))
			setSiblingComment(comment)
		} else {
			setParentComment(comment)
		}

		setReplyActive(true)
	}

	const createComment = async () => {
		setIsSubmitting(true)

		await axios
			.post('/api/createcomment', { nftId, message: commentText, parent_id: parentComment?.comment_id })
			.then(() => {
				refreshComments(false)
				storeCommentInContext()
				parentComment ? mixpanel.track('Reply created') : mixpanel.track('Comment created')
			})
			.catch(err => {
				if (err.response.data.code === 429) return context.setThrottleMessage(err.response.data.message)

				throw err
			})

		setCommentText('')
		setLocalFocus(false)
		setParentComment(null)
		setSiblingComment(null)
		setIsSubmitting(false)
	}

	const deleteComment = async commentId => {
		await axios.post('/api/deletecomment', { commentId })
		removeCommentFromContext()
		mixpanel.track('Comment deleted')
		await refreshComments(false)
	}

	const handleLoggedOutComment = () => {
		setLocalFocus(false)
		setCommentText('')
		setParentComment(null)
		setSiblingComment(null)
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

	useEffect(() => {
		setHasMoreComments(false)
		setLoadingComments(true)
		setLoadingMoreComments(false)
		refreshComments()
		return () => setComments(null)
	}, [nftId])

	useEffect(() => {
		if (parentComment && replyActive) {
			siblingComment ? setCommentText('@' + (siblingComment.username || siblingComment.name || `[${formatAddressShort(siblingComment.address)}](${siblingComment.address})`)) : setCommentText('@' + (parentComment.username || parentComment.name || `[${formatAddressShort(parentComment.address)}](${parentComment.address})`))
			refArray[0]?.current?.focus()
			setReplyActive(false)
		}
	}, [refArray])

	useEffect(() => {
		let link = document.querySelector('div.st-mentions-input li')
		link?.click()
		setMentionAdded(false)
	}, [mentionAdded])

	const suggestion = s => {
		return (
			<div className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-1">
				<img src={s.img_url} className="h-6 w-6 mr-2 rounded-full" />
				<span className="dark:text-gray-300">{s.display}</span>
				{s.username && <span className="text-gray-400 ml-2">@{s.username}</span>}
			</div>
		)
	}

	const commentItem = comment => {
		return <Comment key={comment.comment_id} comment={comment} modalRef={modalRef} closeModal={closeModal} deleteComment={deleteComment} nftOwnerId={ownerCount > 0 ? null : nftOwnerId} nftCreatorId={nftCreatorId} handleReply={handleReply} openLikedByModal={setLikedByUserList} />
	}

	const onInputFocus = isReply => {
		context.setCommentInputFocused(true)

		if (!isReply && (parentComment || siblingComment)) {
			setParentComment(null)
			setSiblingComment(null)
			setCommentText('')
		}
	}

	const inputItem = isReply => {
		const newInputRef = createRef()
		refArray.push(newInputRef)
		return (
			<div className={`${isReply ? 'md:ml-10 ' : ''} my-2 flex ${isReply ? '' : 'md:flex-row items-center'} flex-col`}>
				<MentionsInput
					value={(isReply && parentComment) || parentComment === null ? commentText : ''}
					inputRef={isReply ? newInputRef : null}
					onChange={e => setCommentText(e.target.value)}
					onFocus={() => onInputFocus(isReply)}
					onBlur={() => context.setCommentInputFocused(false)}
					disabled={context.disableComments}
					style={MENTIONS_STYLE}
					placeholder="Your comment..."
					classNames={{
						mentions: 'st-mentions-input dark:bg-gray-700 border dark:border-gray-800 rounded-lg flex-grow md:mr-2 w-full md:w-auto mb-2 md:mb-0',
						mentions__input: 'focus:outline-none focus-visible:ring-1 dark:text-gray-300',
						mentions__suggestions__list: 'rounded-lg border border-transparent dark:border-gray-800 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-400 overflow-hidden',
					}}
					allowSuggestionsAboveCursor
					allowSpaceInQuery
					maxLength={240}
				>
					<Mention trigger="@" renderSuggestion={parentComment ? null : s => suggestion(s)} displayTransform={(_, display) => `${display}`} data={parentComment ? handleSearchQuery : handleDebouncedSearchQuery} className="border-2 border-transparent bg-purple-200 dark:bg-gray-800  rounded -ml-1.5 px-1" appendSpaceOnAdd />
				</MentionsInput>
				<div className="flex items-center justify-between mt-2 w-full md:w-auto space-x-4">
					{isReply && (
						<button onClick={() => setLocalFocus(false) && setCommentText('') && setParentComment(null) && setSiblingComment(null)} className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
							<XIcon className="w-4 h-4 text-gray-800 dark:text-gray-500" />
						</button>
					)}
					<GhostButton loading={isSubmitting} onClick={!user ? handleLoggedOutComment : createComment} disabled={isSubmitting || !commentText || commentText === '' || commentText.trim() === '' || context.disableComments} className="flex-1 md:flex-initial rounded-lg">
						Post
					</GhostButton>
				</div>
			</div>
		)
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
					<div>
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
							<div className="mb-4">
								{comments?.length > 0 ? (
									comments?.map(comment => (
										<div key={comment.comment_id}>
											{commentItem(comment)}
											{parentComment?.comment_id === comment?.comment_id && siblingComment === null && localFocus && inputItem(true)}
											{comment.replies?.length > 0 && (
												<div className="ml-10">
													{comment.replies?.map(comment => (
														<div key={comment.comment_id}>
															{commentItem(comment)}
															{parentComment?.comment_id === comment?.parent_id && comment?.comment_id === siblingComment?.comment_id && localFocus && inputItem(true)}
														</div>
													))}
												</div>
											)}
										</div>
									))
								) : (
									<div className="my-2 mb-3 p-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-xl">No comments yet.</div>
								)}
							</div>
							{inputItem(false)}
						</div>
					</div>
				)}
			</div>
			{likedByUserList && <ModalUserList onRedirect={closeModal} isOpen={likedByUserList} title="Comment Likes" closeModal={() => setLikedByUserList(null)} users={likedByUserList} emptyMessage="No one has liked this yet!" />}
		</div>
	)
}
