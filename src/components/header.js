import { useContext, useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import mixpanel from 'mixpanel-browser'
import SearchBar from './SearchBar'
import AppContext from '@/context/app-context'
import ModalLogin from './ModalLogin'
import NotificationsBtn from './NotificationsBtn'
import CappedWidth from './CappedWidth'

const Header = () => {
	const context = useContext(AppContext)
	const [isSearchBarOpen, setSearchBarOpen] = useState(false)

	console.log({ isSearchBarOpen })

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
								<Link href="/[profile]" as={`/${context.myProfile.username || context.user.publicAddress}`}>
									<a className="dark:text-gray-200 text-base flex flex-row items-center hover:text-stpink" onClick={() => mixpanel.track('Profile button click')}>
										<>
											<div className={context.windowSize ? (context.windowSize.width < 350 ? 'hidden' : null) : null}>
												<img alt="profile pic" src={context.myProfile ? (context.myProfile.img_url ? context.myProfile.img_url : DEFAULT_PROFILE_PIC) : DEFAULT_PROFILE_PIC} className="mr-2 rounded-full h-8 w-8 min-w-[1.875rem]" />
											</div>
											<div
												className="text-sm sm:text-base truncate"
												style={{
													maxWidth: context.gridWidth < 500 ? 100 : 200,
												}}
											>
												{context.myProfile ? (context.myProfile.name ? context.myProfile.name : 'Profile') : 'Profile'}
											</div>
										</>
									</a>
								</Link>
							) : (
								<>
									<div
										className="flex text-sm md:text-base dark:text-gray-200 hover:text-stpink dark:hover:text-stpink cursor-pointer hover:border-stpink dark:hover:border-stpink text-center"
										onClick={() => {
											context.setLoginModalOpen(!context.loginModalOpen)
										}}
									>
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
