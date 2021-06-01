import { useContext } from 'react'
import AppContext from '@/context/app-context'

const ProfileFollowersPill = ({ isFollowed, isMyProfile, followingMe, handleUnfollow, handleFollow, handleLoggedOutFollow, editAccount }) => {
	const context = useContext(AppContext)

	return (
		<div className="text-center text-gray-900">
			<div className="flex-1 flex flex-row items-center relative">
				{!isMyProfile ? (
					<div className={`w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none transition-all ${isFollowed ? 'bg-white dark:hover:bg-transparent dark:hover:border-gray-500 text-gray-600 dark:hover:text-gray-500 border dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800' : 'bg-black dark:bg-gray-700 text-white dark:text-gray-300 border border-white dark:border-gray-700 md:border-black'}  `} onClick={context.user ? (isFollowed ? handleUnfollow : context.disableFollows ? null : handleFollow) : handleLoggedOutFollow}>
						{isFollowed ? 'Following' : followingMe ? 'Follow Back' : 'Follow'}
					</div>
				) : (
					<div className="relative inline-block text-left">
						<button onClick={editAccount} className="w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none transition bg-white dark:bg-gray-900 text-black dark:text-gray-300 border border-white md:border-gray-700 focus:outline-none focus-visible:ring-1">
							Edit Profile
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProfileFollowersPill
