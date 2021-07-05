import { useState } from 'react'
import Link from 'next/link'
import ModalUserList from './ModalUserList'
import ProfileHovercard from './ProfileHovercard'

export default function UsersWhoLiked({ users, closeModal }) {
	const [modalIsOpen, setModalIsOpen] = useState(false)

	return (
		<div className="text-xs md:text-sm mt-3 text-gray-400">
			{users.length === 1 && (
				<>
					Liked by{' '}
					<ProfileHovercard user={users[0]?.profile_id} initialProfile={users[0]}>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</span>
						</Link>
					</ProfileHovercard>
				</>
			)}
			{users.length === 2 && (
				<>
					Liked by{' '}
					<ProfileHovercard user={users[0]?.profile_id} initialProfile={users[0]}>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</span>
						</Link>
					</ProfileHovercard>{' '}
					and{' '}
					<ProfileHovercard user={users[1]?.profile_id} initialProfile={users[1]}>
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</span>
						</Link>
					</ProfileHovercard>
				</>
			)}
			{users.length === 3 && (
				<>
					Liked by{' '}
					<ProfileHovercard user={users[0]?.profile_id} initialProfile={users[0]}>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</span>
						</Link>
					</ProfileHovercard>
					,{' '}
					<ProfileHovercard user={users[1]?.profile_id} initialProfile={users[1]}>
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</span>
						</Link>
					</ProfileHovercard>{' '}
					and{' '}
					<ProfileHovercard user={users[2]?.profile_id} initialProfile={users[2]}>
						<Link href="/[profile]" as={`/${users[2]?.username || users[2].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[2].name}
							</span>
						</Link>
					</ProfileHovercard>
				</>
			)}
			{users.length > 3 && (
				<>
					Liked by{' '}
					<ProfileHovercard user={users[0]?.profile_id} initialProfile={users[0]}>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</span>
						</Link>
					</ProfileHovercard>
					,{' '}
					<ProfileHovercard user={users[1]?.profile_id} initialProfile={users[1]}>
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</span>
						</Link>
					</ProfileHovercard>{' '}
					and{' '}
					<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setModalIsOpen(true)}>
						{Number(users.length - 2).toLocaleString()} others
					</span>
					<ModalUserList isOpen={modalIsOpen} title="Liked By" users={users} closeModal={() => setModalIsOpen(false)} emptyMessage="No likes yet." onRedirect={closeModal} />
				</>
			)}
		</div>
	)
}
