import { useState } from 'react'
import Link from 'next/link'
import ModalUserList from './ModalUserList'

export default function UsersWhoLiked({ users, closeModal }) {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	return (
		<div className="text-xs md:text-sm mt-3 text-gray-400">
			{users.length === 1 && (
				<>
					Liked by{' '}
					<Link
						href="/[profile]"
						as={`/${users[0]?.username || users[0].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[0].name}
						</span>
					</Link>
				</>
			)}
			{users.length === 2 && (
				<>
					Liked by{' '}
					<Link
						href="/[profile]"
						as={`/${users[0]?.username || users[0].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[0].name}
						</span>
					</Link>{' '}
					and{' '}
					<Link
						href="/[profile]"
						as={`/${users[1]?.username || users[1].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[1].name}
						</span>
					</Link>
				</>
			)}
			{users.length === 3 && (
				<>
					Liked by{' '}
					<Link
						href="/[profile]"
						as={`/${users[0]?.username || users[0].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[0].name}
						</span>
					</Link>
					,{' '}
					<Link
						href="/[profile]"
						as={`/${users[1]?.username || users[1].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[1].name}
						</span>
					</Link>{' '}
					and{' '}
					<Link
						href="/[profile]"
						as={`/${users[2]?.username || users[2].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[2].name}
						</span>
					</Link>
				</>
			)}
			{users.length > 3 && (
				<>
					Liked by{' '}
					<Link
						href="/[profile]"
						as={`/${users[0]?.username || users[0].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[0].name}
						</span>
					</Link>
					,{' '}
					<Link
						href="/[profile]"
						as={`/${users[1]?.username || users[1].wallet_address}`}
					>
						<span
							className="text-black cursor-pointer hover:text-stpink"
							onClick={closeModal}
						>
							{users[1].name}
						</span>
					</Link>{' '}
					and{' '}
					<span
						className="text-black cursor-pointer hover:text-stpink"
						onClick={() => setModalIsOpen(true)}
					>
						{Number(users.length - 2).toLocaleString()} others
					</span>
					<ModalUserList
						isOpen={modalIsOpen}
						title="Liked By"
						users={users}
						closeModal={() => setModalIsOpen(false)}
						emptyMessage="No likes yet."
						onRedirect={closeModal}
					/>
				</>
			)}
		</div>
	)
}
