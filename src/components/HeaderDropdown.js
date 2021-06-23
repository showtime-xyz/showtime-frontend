import AppContext from '@/context/app-context'
import useAuth from '@/hooks/useAuth'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { classNames, formatAddressShort } from '@/lib/utilities'
import { Menu, Transition } from '@headlessui/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { Fragment } from 'react'
import ModalAddEmail from './ModalAddEmail'
import Dropdown from './UI/Dropdown'

// Next.js' Link component doesn't appropiately forward all props, so we need to wrap it in order to use it on our menu
const NextLink = ({ href, children, ...rest }) => (
	<Link href={href}>
		<a {...rest}>{children}</a>
	</Link>
)

const HeaderDropdown = () => {
	const { user } = useAuth()
	const { myProfile, logOut } = useContext(AppContext)
	const { theme, themes, setTheme } = useTheme()
	const [hasEmailAddress, setHasEmailAddress] = useState(false)
	const [emailModalOpen, setEmailModalOpen] = useState(false)

	useEffect(() => {
		if (!myProfile) return

		setHasEmailAddress(myProfile.wallet_addresses_v2.length !== myProfile.wallet_addresses_excluding_email_v2.length)
	}, [myProfile])

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalAddEmail isOpen={emailModalOpen} setEmailModalOpen={setEmailModalOpen} setHasEmailAddress={setHasEmailAddress} />
				</>
			) : null}
			<DesktopMenu {...{ myProfile, user, hasEmailAddress, setEmailModalOpen, themes, theme, setTheme, logOut }} />
			{/* <MobileMenu {...{ myProfile, user, hasEmailAddress, setEmailModalOpen, themes, theme, setTheme, logOut }} /> */}
		</>
	)
}

const DesktopMenu = ({ myProfile, user, hasEmailAddress, setEmailModalOpen, themes, theme, setTheme, logOut }) => (
	<Menu as="div" className="ml-3 relative">
		{({ open }) => (
			<>
				<div>
					<Menu.Button className="max-w-xs bg-transparent flex items-center text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-stpink group">
						<span className="sr-only">Open user menu</span>
						<img className="h-8 w-8 rounded-full mr-2" src={myProfile?.img_url || DEFAULT_PROFILE_PIC} alt={myProfile?.name || myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'} />
						<span className="hidden md:inline text-sm sm:text-base truncate dark:text-gray-200 group-hover:text-stpink dark:group-hover:text-stpink transition font-medium">{myProfile?.name || myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'}</span>
					</Menu.Button>
				</div>
				<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
					<Menu.Items static className="origin-top-right absolute right-0 mt-2 rounded-2xl shadow-lg py-1 px-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 divide-y divide-gray-100 dark:divide-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 min-w-[10rem]">
						<div className="py-1">
							<Menu.Item as={NextLink} href={`/${myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || myProfile.wallet_addresses_excluding_email_v2?.[0]?.address || user.publicAddress}`}>
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
									<button onClick={logOut} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block rounded-lg w-full text-left pr-6 pl-2 py-2 text-sm font-semibold transition')}>
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
)

// const MobileMenu = ({ myProfile, user, hasEmailAddress, setEmailModalOpen, themes, theme, setTheme, logOut }) => {
// 	return (
// 		<Disclosure as="div" className="ml-3 relative md:hidden">
// 			<Disclosure.Button className="max-w-xs bg-transparent flex items-center text-sm rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-stpink group">
// 				<span className="sr-only">Open user menu</span>
// 				<img className="h-8 w-8 rounded-full mr-2" src={myProfile?.img_url || DEFAULT_PROFILE_PIC} alt={myProfile?.name || myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'} />
// 				<span className="hidden md:inline text-sm sm:text-base truncate dark:text-gray-200 group-hover:text-stpink dark:group-hover:text-stpink transition">{myProfile?.name || myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'}</span>
// 			</Disclosure.Button>
// 			<Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
// 				<Disclosure.Panel static className="origin-top-right absolute top-0 mt-2 rounded-2xl shadow-lg py-1 px-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 divide-y divide-gray-100 dark:divide-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 w-screen">
// 					<div className="py-1">
// 						<div as={NextLink} href={`/${myProfile?.username || myProfile.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || myProfile.wallet_addresses_excluding_email_v2?.[0]?.address || user.publicAddress}`}>
// 							{({ active }) => <a className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')}>Your Profile</a>}
// 						</div>
// 						<div as={NextLink} href="/wallet">
// 							{({ active }) => <a className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')}>Wallets</a>}
// 						</div>
// 					</div>
// 					{!hasEmailAddress && (
// 						<div className="py-1 pt-4">
// 							<div>
// 								{({ active }) => (
// 									<button onClick={() => setEmailModalOpen(true)} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block rounded-lg w-full text-left pr-6 pl-2 py-2 text-sm font-semibold transition')}>
// 										Add Email
// 									</button>
// 								)}
// 							</div>
// 						</div>
// 					)}
// 					<div className="py-1 pt-4">
// 						<div>
// 							<div className="w-full space-y-2">
// 								<Dropdown label="Theme" options={themes.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} value={theme} onChange={setTheme} />
// 							</div>
// 						</div>
// 					</div>
// 					<div className="py-1 pt-4">
// 						<div>
// 							{({ active }) => (
// 								<button onClick={logOut} className={classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'text-gray-700 dark:text-gray-500', 'block rounded-lg w-full text-left pr-6 pl-2 py-2 text-sm font-semibold transition')}>
// 									Sign Out
// 								</button>
// 							)}
// 						</div>
// 					</div>
// 				</Disclosure.Panel>
// 			</Transition>
// 		</Disclosure>
// 	)
// }

export default HeaderDropdown
