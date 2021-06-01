import { useRef, useState, useContext } from 'react'
import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { formatDistanceToNowStrict, subSeconds } from 'date-fns'
import useDetectOutsideClick from '@/hooks/useDetectOutsideClick'
import AppContext from '@/context/app-context'
import reactStringReplace from 'react-string-replace'
import { formatAddressShort } from '@/lib/utilities'
import CommentLikeButton from './CommentLikeButton'
import { DotsHorizontalIcon, ReplyIcon } from '@heroicons/react/solid'

export default function Comment({ comment, closeModal, modalRef, deleteComment, nftOwnerId, nftCreatorId, openLikedByModal, handleReply }) {
	const context = useContext(AppContext)
	const { myProfile } = context
	const dropdownRef = useRef(null)
	const commentWithMentions = reactStringReplace(comment.text, /(@\[.+?\]\(\w+\))/g, (match, i) => {
		const [, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/)
		return (
			<Link href="/[profile]" as={`/${urlParam}`} key={match + i}>
				<a className="text-indigo-500 hover:text-indigo-400">{name}</a>
			</Link>
		)
	})

	const [isDeleting, setIsDeleting] = useState(false)
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false, modalRef)
	const toggleDropdown = () => setIsActive(isActive => !isActive)

	const userWroteComment = myProfile && myProfile.profile_id && myProfile.profile_id === comment.commenter_profile_id

	const isOwnerOfNFT = nftOwnerId && nftOwnerId === myProfile?.profile_id
	const isCreatorOfNFT = nftCreatorId && nftCreatorId === myProfile?.profile_id

	return (
		<div className="p-2 my-1 flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
			<div className="mr-3 mt-1">
				<Link href="/[profile]" as={comment.username ? `/${comment.username}` : `/${comment.address}`}>
					<img alt={comment.username || comment.name || 'Unnamed'} src={comment.img_url ? comment.img_url : DEFAULT_PROFILE_PIC} className="rounded-full cursor-pointer h-8 w-8" onClick={closeModal} />
				</Link>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex items-center justify-between">
					<div className="flex flex-col sm:flex-row">
						<Link href="/[profile]" as={comment.username ? `/${comment.username}` : `/${comment.address}`}>
							<a className="dark:text-gray-300 hover:text-stpink dark:hover:text-stpink cursor-pointer text-sm truncate" onClick={closeModal}>
								{comment.name || formatAddressShort(comment.address)}
							</a>
						</Link>
						{comment.username && (
							<Link href="/[profile]" as={comment.username ? `/${comment.username}` : `/${comment.address}`}>
								<a className="hover:text-stpink cursor-pointer text-xs text-gray-400 sm:ml-1 truncate" onClick={closeModal}>
									@{comment.username}
								</a>
							</Link>
						)}
					</div>
					<div className="flex-grow"></div>
					<div className={`text-gray-400 dark:text-gray-500 text-xs flex-0 sm:mb-0 ${comment.username ? '-mt-4' : '-mt-1'}  sm:mt-0`}>
						{formatDistanceToNowStrict(subSeconds(new Date(`${comment.added}Z`), 1), {
							addSuffix: true,
						})}
					</div>
					{(isOwnerOfNFT || userWroteComment || isCreatorOfNFT) && (
						<div className={`flex items-center justify-center  relative ${comment.username ? '-mt-4' : '-mt-1'} sm:mt-0`}>
							<div onClick={toggleDropdown} className="ml-3 mr-1 cursor-pointer text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-500 transition">
								<DotsHorizontalIcon className="w-5 h-5" />
							</div>
							<div ref={dropdownRef} className={`absolute text-center top-6 right-0 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-2 shadow-lg rounded-xl transition-all text-sm transform z-1 ${isActive ? 'visible opacity-1 translate-y-2' : 'invisible opacity-0'}`}>
								<div
									className="py-1 px-4 dark:text-gray-400 hover:text-stpink dark:hover:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-lg cursor-pointer whitespace-nowrap"
									onClick={async () => {
										setIsDeleting(true)
										await deleteComment(comment.comment_id)
										setIsActive(false)
										setIsDeleting(false)
									}}
								>
									{isDeleting ? (
										<div className="flex items-center justify-center">
											<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
										</div>
									) : (
										'Delete'
									)}
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="text-gray-500 text-sm leading-5 break-words">{commentWithMentions}</div>
				<div className="flex justify-end">
					<div className="flex items-center">
						<div onClick={() => handleReply(comment)} className="flex items-center justify-end text-gray-400 text-xs sm:mb-0 cursor-pointer mr-2">
							<ReplyIcon className="w-3 h-3" />
							<span className="ml-1">reply</span>
						</div>
						<CommentLikeButton comment={comment} openLikedByModal={openLikedByModal} />
					</div>
				</div>
			</div>
		</div>
	)
}
