import { Fragment, useContext, useEffect, useState } from 'react'
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
import ModalAddEmail from './ModalAddEmail'
import HomeIcon from './Icons/HomeIcon'
import StarIcon from './Icons/StarIcon'
import TrendIcon from './Icons/TrendIcon'
import { useRouter } from 'next/router'
import WalletIcon from './Icons/WalletIcon'
import Image from 'next/image'
import showtimeLogo from '../../public/img/logo.png'
import Dropdown from './UI/Dropdown'

console.log(showtimeLogo)

// Next.js' Link component doesn't appropiately forward all props, so we need to wrap it in order to use it on our menu
const NextLink = ({ href, children, ...rest }) => (
	<Link href={href}>
		<a {...rest}>{children}</a>
	</Link>
)

const Header = () => {
	const { asPath } = useRouter()
	const context = useContext(AppContext)
	const { theme, themes, setTheme } = useTheme()
	const [isSearchBarOpen, setSearchBarOpen] = useState(false)
	const [emailModalOpen, setEmailModalOpen] = useState(false)
	const [hasEmailAddress, setHasEmailAddress] = useState(false)

	useEffect(() => {
		if (!context.myProfile) return

		setHasEmailAddress(context.myProfile.wallet_addresses_v2.length !== context.myProfile.wallet_addresses_excluding_email_v2.length)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.myProfile?.wallet_addresses_v2, context.myProfile?.wallet_addresses_excluding_email_v2])

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalLogin isOpen={context.loginModalOpen} setEditModalOpen={context.setLoginModalOpen} />
					<ModalAddEmail isOpen={emailModalOpen} setEmailModalOpen={setEmailModalOpen} setHasEmailAddress={setHasEmailAddress} />
				</>
			) : null}
			<header className="px-2 pt-3 sm:py-3 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg backdrop-saturate-150 w-full shadow-md dark:shadow-none sticky top-0 z-1">
				<CappedWidth>
					<div className="flex flex-row items-center justify-between px-2 md:px-3 space-x-5">
						<div className="flex-1 flex items-center space-x-2">
							<Link href="/">
								<a
									className="flex flex-shrink-0"
									onClick={async () => {
										mixpanel.track('Logo button click')
										await context.setToggleRefreshFeed(!context.toggleRefreshFeed)
									}}
								>
									<img src={showtimeLogo.src} alt="Showtime logo" className="rounded-lg overflow-hidden w-8 h-8" />
								</a>
							</Link>
							<SearchBar propagateSearchState={setSearchBarOpen} />
						</div>
						{/* Start desktop-only menu */}
						<div className="hidden flex-1 md:flex mr-6 items-center font-normal space-x-4">
							<Link href="/">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter backdrop-blur-lg backdrop-saturate-150'} rounded-full py-1 px-2`} onClick={() => mixpanel.track('Discover button click')}>
									<HomeIcon className="w-5 h-5" />
									<span>Feed</span>
								</a>
							</Link>
							<Link href="/c/spotlights">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/c/spotlights' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter backdrop-blur-lg backdrop-saturate-150'} rounded-full py-1 px-2`} onClick={() => mixpanel.track('Discover button click')}>
									<StarIcon className="w-5 h-5" />
									<span>Discover</span>
								</a>
							</Link>
							<Link href="/trending">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/trending' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter backdrop-blur-lg backdrop-saturate-150'} rounded-full py-1 px-2`} onClick={() => mixpanel.track('Trending button click')}>
									<TrendIcon className="w-5 h-5" />
									<span>Trending</span>
								</a>
							</Link>
						</div>
						{/* End desktop-only menu */}

						<div className={`flex items-center ${isSearchBarOpen ? 'hidden' : ''}`}>
							{context.user && context.myProfile !== undefined && (
								<div className="flex-shrink ml-5">
									<NotificationsBtn />
								</div>
							)}
							{context.user && context.myProfile !== undefined ? (
								<Menu as="div" className="ml-3 relative">
									{({ open }) => (
										<>
											<div>
												<Menu.Button className="max-w-xs bg-transparent flex items-center text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-stpink group">
													<span className="sr-only">Open user menu</span>
													<img className="h-8 w-8 rounded-full mr-2" src={context.myProfile?.img_url || DEFAULT_PROFILE_PIC} alt={context.myProfile?.name || context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'} />
													<span className="hidden md:inline text-sm sm:text-base truncate dark:text-gray-200 group-hover:text-stpink dark:group-hover:text-stpink transition">{context.myProfile?.name || context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'}</span>
												</Menu.Button>
											</div>
											<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
												<Menu.Items static className="origin-top-right absolute right-0 mt-2 rounded-2xl shadow-lg py-1 px-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 divide-y divide-gray-100 dark:divide-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 min-w-[10rem]">
													<div className="py-1">
														<Menu.Item as={NextLink} href={`/${context.myProfile?.username || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || context.myProfile.wallet_addresses_excluding_email_v2?.[0]?.address || context.user.publicAddress}`}>
															{({ active }) => <a className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')}>Your Profile</a>}
														</Menu.Item>
														<Menu.Item as={NextLink} href="/wallet">
															{({ active }) => <a className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')}>Wallets</a>}
														</Menu.Item>
													</div>
													{!hasEmailAddress && (
														<div className="py-1 pt-4">
															<Menu.Item>
																{({ active }) => (
																	<button onClick={() => setEmailModalOpen(true)} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block rounded-lg w-full text-left pr-6 pl-2 py-2 text-sm font-semibold transition')}>
																		Add Email
																	</button>
																)}
															</Menu.Item>
														</div>
													)}
													<div className="py-1 pt-4">
														<Menu.Item disabled>
															<div className="w-full space-y-2">
																<Dropdown label="Theme" options={themes.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} value={theme} onChange={setTheme} />
															</div>
														</Menu.Item>
													</div>
													<div className="py-1 pt-4">
														<Menu.Item>
															{({ active }) => (
																<button onClick={() => context.logOut()} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block rounded-lg w-full text-left pr-6 pl-2 py-2 text-sm font-semibold transition')}>
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
								<>
									<div className="flex items-center space-x-2 text-sm md:text-base dark:text-gray-200 hover:text-stpink dark:hover:text-stpink cursor-pointer hover:border-stpink dark:hover:border-stpink" onClick={() => context.setLoginModalOpen(!context.loginModalOpen)}>
										<WalletIcon className="w-5 h-5" />
										<span>Sign&nbsp;in</span>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Start mobile-only menu */}
					<div className="mt-4 md:hidden">
						<div className="flex-1 flex justify-around font-normal -mx-2">
							<Link href="/">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 ${asPath == '/' ? 'border-gray-800' : 'border-transparent hover:border-gray-400'}`} onClick={() => mixpanel.track('Discover button click')}>
									<HomeIcon className="w-5 h-5" />
									<span>Feed</span>
								</a>
							</Link>
							<Link href="/c/spotlights">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 ${asPath == '/c/spotlights' ? 'border-gray-800' : 'border-transparent hover:border-gray-400'}`} onClick={() => mixpanel.track('Discover button click')}>
									<StarIcon className="w-5 h-5" />
									<span>Discover</span>
								</a>
							</Link>
							<Link href="/trending">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 border-b-2 pb-3 ${asPath == '/trending' ? 'border-gray-800' : 'border-transparent hover:border-gray-400'}`} onClick={() => mixpanel.track('Trending button click')}>
									<TrendIcon className="w-5 h-5" />
									<span>Trending</span>
								</a>
							</Link>
						</div>
					</div>
					{/* End mobile-only menu */}
				</CappedWidth>
			</header>
		</>
	)
}

export default Header
