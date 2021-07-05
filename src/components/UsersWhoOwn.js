import { useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import ModalUserList from './ModalUserList'
import ProfileHovercard from './ProfileHovercard'

const UserImagesList = ({ users }) => {
	const displayedUsers = users.slice(0, 5)

	return (
		<div className="flex mb-2">
			{displayedUsers.map(u => (
				<ProfileHovercard user={u?.profile_id} initialProfile={u} key={u.username || u.wallet_address}>
					<Link href="/[profile]" as={`/${u.username || u.wallet_address}`}>
						<a className="rounded-full mr-2">
							<img src={u.img_url || DEFAULT_PROFILE_PIC} className="w-12 h-12 rounded-full" />
						</a>
					</Link>
				</ProfileHovercard>
			))}
		</div>
	)
}

export default function UsersWhoOwn({ users, ownerCount, closeModal }) {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	return (
		<div className="text-xs md:text-sm mt-3 text-gray-400">
			{users.length === 1 && (
				<div className="flex flex-col">
					<UserImagesList users={users} />
					<div>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</a>
						</Link>
					</div>
				</div>
			)}
			{users.length === 2 && (
				<div className="flex flex-col">
					<UserImagesList users={users} />
					<div>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</a>
						</Link>
					</div>
				</div>
			)}
			{users.length === 3 && (
				<div className="flex flex-col">
					<UserImagesList users={users} />
					<div>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</a>
						</Link>
						,{' '}
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href="/[profile]" as={`/${users[2]?.username || users[2].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[2].name}
							</a>
						</Link>
					</div>
				</div>
			)}
			{users.length > 3 && (
				<div className="flex flex-col">
					<UserImagesList users={users} />
					<div>
						<Link href="/[profile]" as={`/${users[0]?.username || users[0].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[0].name}
							</a>
						</Link>
						,{' '}
						<Link href="/[profile]" as={`/${users[1]?.username || users[1].wallet_address}`}>
							<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={closeModal}>
								{users[1].name}
							</a>
						</Link>{' '}
						and{' '}
						<span className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setModalIsOpen(true)}>
							{Number(ownerCount - 2).toLocaleString()} others
						</span>
						<ModalUserList isOpen={modalIsOpen} title="Owned By" users={users.slice(0, 500)} closeModal={() => setModalIsOpen(false)} emptyMessage="Nobody owns this yet." onRedirect={closeModal} />
					</div>
				</div>
			)}
		</div>
	)
}
