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
import GhostButton from './UI/Buttons/GhostButton'

const This = () => {
	return (
		<div>
			<div className="mb-4">
				{comments.length > 0 ? (
					comments.map(comment => (
						<Comment
							comment={comment}
							key={comment.comment_id}
							closeModal={closeModal}
							modalRef={modalRef}
							deleteComment={deleteComment}
							nftOwnerId={ownerCount > 0 ? null : nftOwnerId}
							nftCreatorId={nftCreatorId}
						/>
					))
				) : (
					<div className="my-2 mb-3 p-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-xl">
						No comments yet.
					</div>
				)}
			</div>
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
						mentions:
							'dark:bg-gray-700 border dark:border-gray-800 rounded-lg flex-grow md:mr-2 w-full md:w-auto mb-2 md:mb-0',
						mentions__input:
							'focus:outline-none focus-visible:ring-1 dark:text-gray-300',
						mentions__suggestions__list:
							'rounded-lg border border-transparent dark:border-gray-800 bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 overflow-hidden',
					}}
					allowSuggestionsAboveCursor
					allowSpaceInQuery
					style={mentionsStyle}
					maxLength={240}
				>
					<Mention
						renderSuggestion={s => (
							<div className="flex items-center">
								<img src={s.img_url} className="h-6 w-6 mr-2 rounded-full" />
								<span className="dark:text-gray-300">{s.display}</span>
								{s.username && (
									<span className="text-gray-400 ml-2">@{s.username}</span>
								)}
							</div>
						)}
						displayTransform={(id, display) => `${display}`}
						trigger="@"
						data={handleDebouncedSearchQuery}
						className="border-2 border-transparent bg-purple-200 dark:bg-gray-800  rounded -ml-1.5 px-1"
						appendSpaceOnAdd
					/>
				</MentionsInput>
				<GhostButton
					loading={isSubmitting}
					onClick={!user ? handleLoggedOutComment : createComment}
					disabled={
						isSubmitting ||
						!commentText ||
						commentText === '' ||
						commentText.trim() === '' ||
						context.disableComments
					}
					className="rounded-lg w-full md:w-auto"
				>
					Post
				</GhostButton>
			</div>
		</div>
	)
}

export default This
