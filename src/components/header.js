import { useContext, useState } from 'react'
import Link from 'next/link'
import mixpanel from 'mixpanel-browser'
import SearchBar from './SearchBar'
import AppContext from '@/context/app-context'
import ModalLogin from './ModalLogin'
import NotificationsBtn from './NotificationsBtn'
import HomeIcon from './Icons/HomeIcon'
import StarIcon from './Icons/StarIcon'
import { useRouter } from 'next/router'
import WalletIcon from './Icons/WalletIcon'
import showtimeLogo from '../../public/img/logo.png'
import HeaderDropdown from './HeaderDropdown'
import useAuth from '@/hooks/useAuth'
import useProfile from '@/hooks/useProfile'
import FireIcon from './Icons/FireIcon'
import useFlags, { FLAGS } from '@/hooks/useFlags'
import MintModal from './UI/Modals/MintModal'
import Button from './UI/Buttons/Button'
import PlusIcon from './Icons/PlusIcon'
import MintingBanner from './MintingBanner'

const Header = () => {
	const { [FLAGS.hasMinting]: canMint } = useFlags()
	const { asPath } = useRouter()
	const context = useContext(AppContext)
	const { isAuthenticated } = useAuth()
	const { myProfile } = useProfile()
	const [mintModalOpen, setMintModalOpen] = useState(false)
	const [isSearchBarOpen, setSearchBarOpen] = useState(false)

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalLogin isOpen={context.loginModalOpen} setEditModalOpen={context.setLoginModalOpen} />
					<MintModal open={mintModalOpen} onClose={() => setMintModalOpen(false)} />
				</>
			) : null}
			<MintingBanner />
			<header className="px-4 pt-3 sm:py-3 bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 backdrop-filter backdrop-blur-lg backdrop-saturate-150 w-full shadow-md dark:shadow-none sticky top-0 z-1">
				<div className="max-w-screen-2xl 2xl:max-w-none 2xl:px-10 sm:px-3 mx-auto w-full">
					<div className="flex items-center justify-between">
						<div className="flex-1 flex items-center space-x-4 md:space-x-2">
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
						<div className="hidden flex-1 md:flex md:items-center md:justify-center mr-6 md:mr-0 items-center font-normal space-x-2">
							<Link href="/">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter hover:backdrop-blur-lg hover:backdrop-saturate-150'} rounded-xl py-2 -my-1 px-3 -mx-1`} onClick={() => mixpanel.track('Discover button click')}>
									<HomeIcon className="w-5 h-5" />
									<span className="font-bold">Feed</span>
								</a>
							</Link>
							<Link href="/c/spotlights">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/c/spotlights' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter hover:backdrop-blur-lg hover:backdrop-saturate-150'} rounded-xl py-2 -my-1 px-3 -mx-1`} onClick={() => mixpanel.track('Discover button click')}>
									<StarIcon className="w-5 h-5" />
									<span className="font-bold">Discover</span>
								</a>
							</Link>
							<Link href="/trending">
								<a className={`text-black dark:text-gray-200 text-sm md:text-base flex items-center space-x-2 ${asPath == '/trending' ? 'bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150' : 'hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:backdrop-filter hover:backdrop-blur-lg hover:backdrop-saturate-150'} rounded-xl py-2 -my-1 px-3 -mx-1`} onClick={() => mixpanel.track('Trending button click')}>
									<FireIcon className="w-5 h-5" />
									<span className="font-bold">Trending</span>
								</a>
							</Link>
						</div>
						{/* End desktop-only menu */}

						<div className={`flex-1 flex items-center justify-end ${isSearchBarOpen ? 'hidden' : ''}`}>
							{isAuthenticated && myProfile && (
								<div className="flex-shrink ml-5">
									<NotificationsBtn />
								</div>
							)}
							<div className={`ml-5 ${canMint ? '' : 'hidden md:block'}`}>
								<Button onClick={() => setMintModalOpen(true)} style="gradient" className="!p-2.5 md:!px-4 md:!py-2 !rounded-xl !md:rounded-2xl">
									<span className="hidden md:inline">Create</span>
									<PlusIcon className="w-4 h-4 md:hidden" />
								</Button>
							</div>
							{isAuthenticated && myProfile ? (
								<HeaderDropdown />
							) : (
								<div className="flex items-center space-x-2 text-sm md:text-base dark:text-gray-200 hover:text-stpink dark:hover:text-stpink cursor-pointer hover:border-stpink dark:hover:border-stpink" onClick={() => context.setLoginModalOpen(!context.loginModalOpen)}>
									<WalletIcon className="w-5 h-5" />
									<span>Sign&nbsp;in</span>
								</div>
							)}
						</div>
					</div>

					{/* Start mobile-only menu */}
					<div className="overflow-hidden">
						<div className="-mx-4 mt-4 md:hidden">
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
										<FireIcon className="w-5 h-5" />
										<span>Trending</span>
									</a>
								</Link>
							</div>
						</div>
					</div>
					{/* End mobile-only menu */}
				</div>
			</header>
		</>
	)
}

export default Header
