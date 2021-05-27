import { Fragment, useContext, useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import mixpanel from 'mixpanel-browser'
import SearchBar from './SearchBar'
import AppContext from '@/context/app-context'
import ModalLogin from './ModalLogin'
import NotificationsBtn from './NotificationsBtn'
import CappedWidth from './CappedWidth'
import { classNames, formatAddressShort } from '@/lib/utilities'
import { Menu, Transition } from '@headlessui/react'
import { useTheme } from 'next-themes'

// Next.js' Link component doesn't appropiately forward all props, so we need to wrap it in order to use it on our menu
const NextLink = ({ href, children, ...rest }) => (
	<Link href={href}>
		<a {...rest}>{children}</a>
	</Link>
)

const Header = () => {
	const context = useContext(AppContext)
	const { theme, themes, setTheme } = useTheme()
	const [isSearchBarOpen, setSearchBarOpen] = useState(false)

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalLogin isOpen={context.loginModalOpen} setEditModalOpen={context.setLoginModalOpen} />
				</>
			) : null}
			<header className="px-2 py-1 sm:py-2 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg backdrop-saturate-150 w-full shadow-md dark:shadow-none sticky top-0 z-1">
				<CappedWidth>
					<div className="flex flex-row items-center px-3">
						<div>
							<Link href="/">
								<a
									className="flex flex-row text-black dark:text-white hover:text-stpink dark:hover:text-stpink items-center text-left mr-auto"
									onClick={async () => {
										mixpanel.track('Logo button click')
										await context.setToggleRefreshFeed(!context.toggleRefreshFeed)
									}}
								>
									<div className="text-2xl py-2 font-normal font-afro">SHOWTIME</div>
								</a>
							</Link>
						</div>
						{/* Start desktop-only menu */}
						{!context.isMobile ? (
							<div className="flex-grow flex-1">
								<SearchBar propagateSearchState={setSearchBarOpen} />
							</div>
						) : (
							<div className="flex-grow"></div>
						)}
						<div className="hidden md:flex mr-6 items-center font-normal">
							<Link href="/c/[collection]" as="/c/spotlights">
								<a
									className="text-black dark:text-gray-200 hover:text-stpink dark:hover:text-stpink ml-6 text-sm md:text-base"
									onClick={() => {
										mixpanel.track('Discover button click')
									}}
								>
									Discover
								</a>
							</Link>
							<Link href="/trending">
								<a className="text-black dark:text-gray-200 hover:text-stpink dark:hover:text-stpink ml-6 text-sm md:text-base" onClick={() => mixpanel.track('Trending button click')}>
									Trending
								</a>
							</Link>
							{context.user && context.myProfile !== undefined && (
								<div className="flex-shrink ml-5">
									<NotificationsBtn />
								</div>
							)}
						</div>

						{/* End desktop-only menu */}
						<div>
							{context.user && context.myProfile !== undefined ? (
								<Menu as="div" className="ml-3 relative">
									{({ open }) => (
										<>
											<div>
												<Menu.Button className="max-w-xs bg-transparent flex items-center text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-stpink group">
													<span className="sr-only">Open user menu</span>
													<img className="h-8 w-8 rounded-full mr-2" src={context.myProfile?.img_url || DEFAULT_PROFILE_PIC} alt={context.myProfile?.name || context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'} />
													<span className="text-sm sm:text-base truncate dark:text-gray-200 group-hover:text-stpink dark:group-hover:text-stpink transition">{context.myProfile?.name || context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'}</span>
												</Menu.Button>
											</div>
											<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
												<Menu.Items static className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
													<div className="py-1">
														<Menu.Item as={NextLink} href={`/${context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address || context.user.publicAddress}`}>
															{({ active }) => <a className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm transition')}>Your Profile</a>}
														</Menu.Item>
													</div>
													<div className="py-1">
														<Menu.Item disabled>
															<div className="flex items-center justify-between w-full text-left px-4 py-2 text-sm space-x-2">
																<label className="text-gray-700 dark:text-gray-500" htmlFor="theme">
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
																<button onClick={() => context.logOut()} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block w-full text-left px-4 py-2 text-sm transition')}>
																	Sign Out
																</button>
															)}
														</Menu.Item>
													</div>
												</Menu.Items>
											</Transition>
										</>
									)}
								</Menu>
							) : (
								// <Link href="/[profile]" as={`/${context.myProfile.username ? context.myProfile.username : context.myProfile.wallet_addresses_excluding_email_v2 && context.myProfile.wallet_addresses_excluding_email_v2.length > 0 ? (context.myProfile.wallet_addresses_excluding_email_v2[0].ens_domain ? context.myProfile.wallet_addresses_excluding_email_v2[0].ens_domain : context.myProfile.wallet_addresses_excluding_email_v2[0].address) : context.user.publicAddress}`}>
								// 	<a className="dark:text-gray-200 text-base flex flex-row items-center hover:text-stpink" onClick={() => mixpanel.track('Profile button click')}>
								// 		<>
								// 			<div className={context.windowSize ? (context.windowSize.width < 350 ? 'hidden' : null) : null}>
								// 				<img alt="profile pic" src={context.myProfile ? (context.myProfile.img_url ? context.myProfile.img_url : DEFAULT_PROFILE_PIC) : DEFAULT_PROFILE_PIC} className="mr-2 rounded-full h-8 w-8 min-w-[1.875rem]" />
								// 			</div>
								// 			<div className="text-sm sm:text-base truncate" style={{ maxWidth: context.windowSize?.width < 500 ? 100 : 200 }}>
								// 				{context.myProfile ? (context.myProfile.name ? context.myProfile.name : context.myProfile.username ? context.myProfile.username : context.myProfile.wallet_addresses_excluding_email_v2 && context.myProfile.wallet_addresses_excluding_email_v2.length > 0 ? (context.myProfile.wallet_addresses_excluding_email_v2[0].ens_domain ? context.myProfile.wallet_addresses_excluding_email_v2[0].ens_domain : formatAddressShort(context.myProfile.wallet_addresses_excluding_email_v2[0].address)) : 'Profile') : 'Profile'}
								// 			</div>
								// 		</>
								// 	</a>
								// </Link>
								<>
									<div className="flex text-sm md:text-base dark:text-gray-200 hover:text-stpink dark:hover:text-stpink cursor-pointer hover:border-stpink dark:hover:border-stpink text-center" onClick={() => context.setLoginModalOpen(!context.loginModalOpen)}>
										Sign&nbsp;in
									</div>
								</>
							)}
						</div>
					</div>

					{/* Start mobile-only menu */}
					{context.isMobile && (
						<div className={`flex md:hidden justify-between items-center pb-1 px-3 ${isSearchBarOpen ? 'invisible' : ''}`}>
							<div>
								<Link href="/c/[collection]" as="/c/spotlights">
									<a
										className="text-black dark:text-white hover:text-stpink dark:hover:text-stpink mr-5 text-sm md:text-base"
										onClick={() => {
											mixpanel.track('Discover button click')
										}}
									>
										Discover
									</a>
								</Link>
								<Link href="/trending">
									<a
										className="text-black dark:text-white hover:text-stpink dark:hover:text-stpink mr-5 text-sm md:text-base"
										onClick={() => {
											mixpanel.track('Trending button click')
										}}
									>
										Trending
									</a>
								</Link>
							</div>
							<div className="flex-grow flex-1">
								<SearchBar propagateSearchState={setSearchBarOpen} />
							</div>
							{context.isMobile && context.user && context.myProfile !== undefined && (
								<div className="flex-shrink ml-4">
									<NotificationsBtn />
								</div>
							)}
						</div>
					)}
					{/* End mobile-only menu */}
				</CappedWidth>
			</header>
		</>
	)
}

export default Header
