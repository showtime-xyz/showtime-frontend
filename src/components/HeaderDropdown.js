import AppContext from '@/context/app-context'
import useAuth from '@/hooks/useAuth'
import useProfile from '@/hooks/useProfile'
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
	const { profile: myProfile, loading: profileLoading } = useProfile()
	const { logOut } = useContext(AppContext)
	const { theme, themes, setTheme } = useTheme()
	const [hasEmailAddress, setHasEmailAddress] = useState(false)
	const [emailModalOpen, setEmailModalOpen] = useState(false)

	useEffect(() => {
		if (profileLoading) return

		setHasEmailAddress((myProfile?.wallet_addresses_v2 || []).length !== (myProfile?.wallet_addresses_excluding_email_v2 || []).length)
	}, [profileLoading, myProfile])

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalAddEmail isOpen={emailModalOpen} setEmailModalOpen={setEmailModalOpen} setHasEmailAddress={setHasEmailAddress} />
				</>
			) : null}
			<Menu as="div" className="ml-5 md:relative">
				{({ open }) => (
					<>
						<div>
							<Menu.Button className={({ open }) => `max-w-xs ${open ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter hover:backdrop-blur-lg hover:backdrop-saturate-150'} p-1 -m-1 md:py-1 md:pl-2.5 md:pr-1 md:-my-1 md:-ml-2.5 md:-mr-1 flex items-center text-sm rounded-full focus:outline-none group`}>
								<span className="sr-only">Open user menu</span>
								<span className="hidden md:inline truncate dark:text-gray-200 transition font-medium">{myProfile?.name || myProfile?.username || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile?.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'}</span>
								<img className="h-8 w-8 rounded-full md:ml-2" src={myProfile?.img_url || DEFAULT_PROFILE_PIC} alt={myProfile?.name || myProfile?.username || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(myProfile?.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Profile'} />
							</Menu.Button>
						</div>
						<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
							<Menu.Items static className="origin-top-right absolute right-0 mt-2 focus:outline-none w-full md:w-auto px-4 md:px-0">
								<Menu.Item>
									<button className="bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90 w-[120vw] h-screen fixed z-10 -ml-10 focus:outline-none md:hidden" />
								</Menu.Item>
								<div className="mt-0.5 md:mt-0 rounded-2xl shadow-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 divide-y divide-gray-100 dark:divide-gray-800 relative z-20 min-w-[10rem] w-full md:w-auto py-1 px-2">
									<div className="py-1">
										<Menu.Item as={NextLink} className={({ active }) => classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')} href={`/${myProfile?.username || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.address || user.publicAddress}`}>
											Your Profile
										</Menu.Item>
										<Menu.Item as={NextLink} className={({ active }) => classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'block rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition')} href="/wallet">
											Wallets
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
								</div>
							</Menu.Items>
						</Transition>
					</>
				)}
			</Menu>
		</>
	)
}

export default HeaderDropdown
