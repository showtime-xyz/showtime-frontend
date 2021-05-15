import { useRef, useState, useContext } from 'react'
import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { formatDistanceToNowStrict, subSeconds } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import useDetectOutsideClick from '@/hooks/useDetectOutsideClick'
import AppContext from '@/context/app-context'
import reactStringReplace from 'react-string-replace'
import { formatAddressShort } from '@/lib/utilities'

export default function Comment({
	comment,
	closeModal,
	modalRef,
	deleteComment,
	nftOwnerId,
	nftCreatorId,
	nestedReply,
	isReply,
}) {
	const context = useContext(AppContext)
	const { myProfile } = context
	const dropdownRef = useRef(null)

	const commentWithMentions = reactStringReplace(
		comment.text,
		/(@\[.+?\]\(\w+\))/g,
		(match, i) => {
			const [, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/)
			return (
				<Link href="/[profile]" as={`/${urlParam}`} key={match + i}>
					<a className="text-indigo-500 hover:text-indigo-400">{name}</a>
				</Link>
			)
		}
	)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false, modalRef)
	const toggleDropdown = () => {
		setIsActive(!isActive)
	}

	const userWroteComment =
		myProfile && myProfile.profile_id && myProfile.profile_id === comment.commenter_profile_id

	const isOwnerOfNFT = nftOwnerId && nftOwnerId === myProfile?.profile_id
	const isCreatorOfNFT = nftCreatorId && nftCreatorId === myProfile?.profile_id

	return (
		<div className="p-2 my-1 flex rounded-xl hover:bg-gray-100 transition-all relative">
			<div className="mr-3 mt-1">
				<Link
					href="/[profile]"
					as={comment.username ? `/${comment.username}` : `/${comment.address}`}
				>
					<img
						alt={comment.username || comment.name || 'Unnamed'}
						src={comment.img_url ? comment.img_url : DEFAULT_PROFILE_PIC}
						className="rounded-full cursor-pointer h-8 w-8"
						onClick={closeModal}
					/>
				</Link>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex items-center justify-between">
					<div className="flex flex-col sm:flex-row">
						<Link
							href="/[profile]"
							as={comment.username ? `/${comment.username}` : `/${comment.address}`}
						>
							<a
								className="hover:text-stpink cursor-pointer text-sm truncate"
								onClick={closeModal}
							>
								{comment.name || formatAddressShort(comment.address)}
							</a>
						</Link>
						{comment.username && (
							<Link
								href="/[profile]"
								as={
									comment.username
										? `/${comment.username}`
										: `/${comment.address}`
								}
							>
								<a
									className="hover:text-stpink cursor-pointer text-xs text-gray-400 sm:ml-1 truncate"
									onClick={closeModal}
								>
									@{comment.username}
								</a>
							</Link>
						)}
					</div>
					<div className="flex-grow"></div>
					<div
						className={`text-gray-400 text-xs flex-0 sm:mb-0 ${
							comment.username ? '-mt-4' : '-mt-1'
						}  sm:mt-0`}
					>
						{formatDistanceToNowStrict(subSeconds(new Date(`${comment.added}Z`), 1), {
							addSuffix: true,
						})}
					</div>
					{(isOwnerOfNFT || userWroteComment || isCreatorOfNFT) && (
						<div
							className={`flex items-center justify-center  relative ${
								comment.username ? '-mt-4' : '-mt-1'
							} sm:mt-0`}
						>
							<div
								onClick={toggleDropdown}
								className="ml-3 mr-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-all"
							>
								<FontAwesomeIcon className="w-4 h-4" icon={faEllipsisH} />
							</div>
							<div
								ref={dropdownRef}
								className={`absolute text-center top-6 right-0 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-sm transform z-1 ${
									isActive
										? 'visible opacity-1 translate-y-2'
										: 'invisible opacity-0'
								}`}
							>
								<div
									className="py-1 px-4 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap"
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
				<div className="text-gray-500 text-sm leading-5 break-words">
					{commentWithMentions}
				</div>
				{!isReply ? (
					<div>
						<div
							onClick={() => nestedReply(comment)}
							className="flex justify-end text-gray-400 text-xs flex-0 sm:mb-0 cursor-pointer -mt-2"
						>
							reply
						</div>
					</div>
				) : (
					<div className="my-1" />
				)}
			</div>
		</div>
	)
}
