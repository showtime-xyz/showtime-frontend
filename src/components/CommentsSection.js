import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import AppContext from '@/context/app-context'
import backend from '@/lib/backend'
import mixpanel from 'mixpanel-browser'
import Comment from './Comment'
import { Mention, MentionsInput } from 'react-mentions'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { formatAddressShort } from '@/lib/utilities'
import axios from '@/lib/axios'

// TODO: Convert to classes and include it into the MentionsInput component
const mentionsStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 10,
  },

  '&multiLine': {
    control: {
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '2px solid transparent',
      borderRadius: 10,
    },
    input: {
      padding: 9,
      border: '2px solid #d1d5da',
      borderRadius: 8,
      '&focused': {
        border: '2px solid black',
      },
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
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
      borderRadius: 10,
      overflow: 'hidden',
    },
    item: {
      padding: '5px 15px',
      // borderBottom: "1px solid rgba(0,0,0,0.15)",
      '&focused': {
        backgroundColor: '#dddeff',
      },
    },
  },
}

export default function CommentsSection({ item, closeModal, modalRef, commentCount }) {
  const {
    nft_id: nftId,
    owner_id: nftOwnerId,
    creator_id: nftCreatorId,
    owner_count: ownerCount,
  } = item
  const context = useContext(AppContext)
  const { user } = context
  const [loadingComments, setLoadingComments] = useState(true)
  const [loadingMoreComments, setLoadingMoreComments] = useState(true)
  const [hasMoreComments, setHasMoreComments] = useState(false)
  const [comments, setComments] = useState()
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parentComment, setParentComment] = useState(null)

  const commentInputRef = useRef(null)

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
    const commentsData = await backend.get(
      `/v2/comments/${nftId}${hasMoreComments ? '' : '?limit=10'}`
    )
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

  const handleGetMoreComments = async () => {
    setLoadingMoreComments(true)
    await refreshComments(nftId)
    setLoadingMoreComments(false)
    setHasMoreComments(false)
  }

  const nestedReply = comment => {
    setParentComment(comment)
    setCommentText('@' + (comment.username || comment.name) + ' ')
    commentInputRef.current.focus()
  }

  const createComment = async () => {
    let endpoint
    let payload
    setIsSubmitting(true)
    if (parentComment) {
      //endpoint = '/api/createreply'
      endpoint = '/api/createcomment'
      payload = {
        nftId,
        message: commentText,
        parent_id: parentComment.comment_id,
      }
    } else {
      endpoint = '/api/createcomment'
      payload = { nftId, message: commentText }
    }
    // post new comment
    try {
      await axios
        .post(endpoint, payload)
        .then(() => {
          // pull new comments
          refreshComments(false)
          storeCommentInContext()
          parentComment ? mixpanel.track('Reply created') : mixpanel.track('Comment created')
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
    setParentComment(null)
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

  return (
    <div className="w-full">
      {/* Comments */}
      <div>
        <div className="md:text-lg py-4" id="CommentsSectionScroll">
          Comments
        </div>
        {loadingComments ? (
          <div className="text-center my-4">
            <div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
          </div>
        ) : (
          <>
            <div className="py-2 px-4 border-2 border-gray-300 rounded-xl">
              {hasMoreComments && (
                <div className="flex flex-row items-center my-2 justify-center">
                  {!loadingMoreComments ? (
                    <div
                      className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer transition-all"
                      onClick={handleGetMoreComments}
                    >
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
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.comment_id}>
                      <Comment
                        comment={comment}
                        key={comment.comment_id}
                        closeModal={closeModal}
                        modalRef={modalRef}
                        deleteComment={deleteComment}
                        nftOwnerId={ownerCount > 0 ? null : nftOwnerId}
                        nftCreatorId={nftCreatorId}
                        nestedReply={nestedReply}
                        isReply={false}
                      />
                      {comment.replies?.length > 0 ? (
                        <div className="ml-10">
                          {comment.replies?.map(comment => (
                            <Comment
                              comment={comment}
                              key={comment.comment_id}
                              closeModal={closeModal}
                              modalRef={modalRef}
                              deleteComment={deleteComment}
                              nftOwnerId={ownerCount > 0 ? null : nftOwnerId}
                              nftCreatorId={nftCreatorId}
                              nestedReply={nestedReply}
                              isReply={true}
                            />
                          ))}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="my-2 mb-3 p-3 bg-gray-100 rounded-xl">No comments yet.</div>
                )}
              </div>
              {/* New Comment */}
              <div className="my-2 flex items-stretch flex-col md:flex-row">
                <MentionsInput
                  value={commentText}
                  onChange={e => {
                    setCommentText(e.target.value)
                  }}
                  inputRef={commentInputRef}
                  onFocus={() => context.setCommentInputFocused(true)}
                  onBlur={() => context.setCommentInputFocused(false)}
                  disabled={context.disableComments}
                  placeholder="Your comment..."
                  className="flex-grow md:mr-2"
                  allowSuggestionsAboveCursor
                  allowSpaceInQuery
                  style={mentionsStyle}
                  maxLength={240}
                >
                  <Mention
                    renderSuggestion={s => (
                      <div className="flex items-center">
                        <img src={s.img_url} className="h-6 w-6 mr-2 rounded-full" />
                        <span className="">{s.display}</span>
                        {s.username && <span className="text-gray-400 ml-2">@{s.username}</span>}
                      </div>
                    )}
                    displayTransform={(id, display) => `${display}`}
                    trigger="@"
                    data={handleDebouncedSearchQuery}
                    className="bg-purple-200 rounded -ml-1 sm:ml-0"
                    appendSpaceOnAdd
                  />
                </MentionsInput>
                <button
                  onClick={!user ? handleLoggedOutComment : createComment}
                  disabled={
                    isSubmitting ||
                    !commentText ||
                    commentText === '' ||
                    commentText.trim() === '' ||
                    context.disableComments
                  }
                  className="px-4 py-3 bg-black rounded-xl mt-4 md:mt-0 justify-center text-white flex items-center cursor-pointer hover:bg-stpink transition-all disabled:bg-gray-700"
                >
                  {isSubmitting ? (
                    <div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
