import { useContext } from 'react'
import AppContext from '@/context/app-context'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '@/lib/utilities'
import { useTheme } from 'next-themes'

const ProfileFollowersPill = ({ isFollowed, isMyProfile, followingMe, hasEmailAddress, handleUnfollow, handleFollow, handleLoggedOutFollow, editAccount, editPhoto, addWallet, addEmail, logout }) => {
	const { theme, themes, setTheme } = useTheme()
	const context = useContext(AppContext)

	return (
		<div className="text-center text-gray-900">
			<div className="flex-1 flex flex-row items-center relative">
				{!isMyProfile ? (
					<div className={`w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none transition-all ${isFollowed ? 'bg-white dark:hover:bg-transparent dark:hover:border-gray-500 text-gray-600 dark:hover:text-gray-500 border dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800' : 'bg-black dark:bg-gray-700 text-white dark:text-gray-300 border border-white dark:border-gray-700 md:border-black'}  `} onClick={context.user ? (isFollowed ? handleUnfollow : context.disableFollows ? null : handleFollow) : handleLoggedOutFollow}>
						{isFollowed ? 'Following' : followingMe ? 'Follow Back' : 'Follow'}
					</div>
				) : (
					<Menu as="div" className="relative inline-block text-left">
						{({ open }) => (
							<>
								<Menu.Button className="w-32 py-2 rounded-full text-sm cursor-pointer shadow-md md:shadow-none transition-all bg-white dark:bg-gray-900 text-black dark:text-gray-300 border border-white md:border-gray-700 focus:outline-none focus-visible:ring-1">Edit Profile</Menu.Button>

								<Transition show={open} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
									<Menu.Items static className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-800 focus:outline-none focus-visible:ring-1">
										<div className="py-1">
											<Menu.Item>
												{({ active }) => (
													<button onClick={editAccount} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm')}>
														Edit Info
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button onClick={editPhoto} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm')}>
														{context.myProfile && context.myProfile.img_url && !context.myProfile.img_url.includes('opensea-profile') ? 'Edit Photo' : 'Add Photo'}
													</button>
												)}
											</Menu.Item>
										</div>
										<div className="py-1">
											<Menu.Item>
												{({ active }) => (
													<button onClick={addWallet} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm')}>
														Add Wallet
													</button>
												)}
											</Menu.Item>
											{hasEmailAddress ? null : (
												<Menu.Item>
													{({ active }) => (
														<button onClick={addEmail} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm')}>
															Add Email
														</button>
													)}
												</Menu.Item>
											)}
										</div>
										<div className="py-1">
											<Menu.Item disabled>
												<div className="flex items-center justify-between w-full text-left px-4 py-2 text-sm">
													<label className="dark:text-gray-500" htmlFor="theme">
														Theme
													</label>
													<select value={theme} onChange={e => setTheme(e.target.value)} id="theme" name="theme" className="form-select border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-500 capitalize pl-2 py-1 text-base focus:outline-none focus:border-gray-800 focus:ring-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-800 sm:text-sm rounded-md">
														{themes.map(theme => (
															<option className="capitalize" value={theme} key={theme}>
																{theme}
															</option>
														))}
													</select>
												</div>
											</Menu.Item>
										</div>
										<div className="py-1">
											<Menu.Item>
												{({ active }) => (
													<button onClick={logout} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm')}>
														Log Out
													</button>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							</>
						)}
					</Menu>
				)}
			</div>
		</div>
	)
}

export default ProfileFollowersPill
