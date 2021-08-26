import { useEffect, useRef, useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import mixpanel from 'mixpanel-browser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import backend from '@/lib/backend'
import useKeyPress from '@/hooks/useKeyPress'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import LoadingSpinner from './LoadingSpinner'
import SearchIcon from './Icons/SearchIcon'
import XIcon from './Icons/XIcon'

const handleSearchQuery = AwesomeDebouncePromise(async (searchText, setSearchResults, setIsLoading) => {
	setIsLoading(true)

	setSearchResults(await backend.get(`/v1/search?q=${searchText}`).then(res => res?.data?.data))

	setIsLoading(false)
}, 500)

//TODO: Refactor this component to use HeadlessUI's Listbox Component
const SearchBar = ({ propagateSearchState }) => {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [searchInputFocused, setSearchInputFocused] = useState(false)
	const [searchResults, setSearchResults] = useState([])
	const [showSearchResults, setShowSearchResults] = useState(false)
	const [isMobileSearchOverlayOpen, toggleMobileSearchOverlay] = useState(false)
	const [searchText, setSearchText] = useState('')
	const [activeSelectedSearchResult, setActiveSelectedSearchResult] = useState(null)

	const dropdownRef = useRef(null)
	const searchInputContainerRef = useRef(null)

	const downPress = useKeyPress('ArrowDown')
	const upPress = useKeyPress('ArrowUp')
	const enterPress = useKeyPress('Enter')

	useEffect(() => {
		propagateSearchState(isMobileSearchOverlayOpen)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobileSearchOverlayOpen])

	useEffect(() => {
		if (upPress) {
			mixpanel.track('Up Search - keyboard')
			if (activeSelectedSearchResult === null) setActiveSelectedSearchResult(searchResults.length - 1 >= 0 ? searchResults.length - 1 : null)
			else setActiveSelectedSearchResult(activeSelectedSearchResult - 1 >= 0 ? activeSelectedSearchResult - 1 : null)
		}
		if (downPress) {
			mixpanel.track('Down search - keyboard')
			if (activeSelectedSearchResult === null) setActiveSelectedSearchResult(searchResults.length - 1 >= 0 ? 0 : null)
			else setActiveSelectedSearchResult(activeSelectedSearchResult + 1 < searchResults.length ? activeSelectedSearchResult + 1 : null)
		}
		if (enterPress && activeSelectedSearchResult !== null && searchResults.length > 0) {
			setShowSearchResults(false)
			setSearchText('')
			toggleMobileSearchOverlay(false)
			const searchResult = searchResults[activeSelectedSearchResult]
			router.push(`/${searchResult?.username || searchResult.address0}`)
		}
	}, [downPress, upPress, enterPress])

	useOnClickOutside(dropdownRef, () => setShowSearchResults(false), searchInputContainerRef)

	return (
		<>
			{/* Start desktop-only menu */}
			<div className="hidden flex-col relative w-full max-w-3xl md:flex pr-1">
				<div className="flex relative w-full" ref={searchInputContainerRef}>
					<div className="absolute left-2.5 top-2 transform translate-y-px pointer-events-none z-1">
						<SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					</div>
					<input
						className="flex placeholder-gray-500 dark:placeholder-gray-400 dark:text-gray-300 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150 px-2 pl-8 py-2 rounded-full focus:outline-none text-sm w-full"
						type="text"
						placeholder="Search by name or wallet address"
						value={searchText}
						onFocus={() => {
							setShowSearchResults(true)
							setSearchInputFocused(true)
						}}
						onBlur={() => setSearchInputFocused(false)}
						onChange={e => {
							setShowSearchResults(true)
							setSearchText(e.currentTarget.value)
							setActiveSelectedSearchResult(null)
							handleSearchQuery(e.currentTarget.value, setSearchResults, setIsLoading)
						}}
					/>
				</div>
				{searchText.length > 0 && showSearchResults && (
					<div className="flex flex-col max-h-[80vh] overflow-y-scroll absolute top-10 inset-x-0 border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow" ref={dropdownRef}>
						{isLoading ? (
							<div className="flex justify-center w-full p-4">
								<LoadingSpinner />
							</div>
						) : (
							<>
								{searchResults.map((searchResult, index) => (
									<Link href="/[profile]" as={`/${searchResult?.username || searchResult.address0}`} key={searchResult.id}>
										<div
											className={`flex items-center w-full p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${activeSelectedSearchResult === index ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} ${index === 0 ? 'rounded-t-lg' : ''} ${index === searchResults.length - 1 ? 'rounded-b-lg' : ''}`}
											key={index}
											onClick={() => {
												setShowSearchResults(false)
												setSearchText('')
												mixpanel.track('Clicked Search result')
											}}
										>
											<img className="w-6 h-6 mr-2 rounded-full" src={searchResult?.img_url ? searchResult?.img_url : DEFAULT_PROFILE_PIC} />
											<div className="truncate dark:text-gray-300">{searchResult?.name || searchResult.address0}</div>
											{searchResult?.username ? <div className="text-sm pl-1 truncate text-gray-400">@{searchResult?.username}</div> : null}
										</div>
									</Link>
								))}
								{searchResults.length === 0 && <div className="flex w-full p-4 dark:text-gray-400">No matching people</div>}
							</>
						)}
					</div>
				)}
			</div>
			{/* Start mobile-only menu */}
			<div className={`flex md:hidden ${isMobileSearchOverlayOpen ? 'hidden' : ''}`}>
				<button onClick={() => toggleMobileSearchOverlay(true)} className="focus:outline-none">
					<SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
				</button>
			</div>
			{/* Start overlay menu */}
			{isMobileSearchOverlayOpen && (
				<div className="visible flex flex-col bg-transparent flex-1 z-1">
					<div className="flex items-center">
						<div className="flex relative w-full" ref={searchInputContainerRef}>
							<div className="flex absolute z-1 left-4 top-[12px] transform -translate-y-2.5 -translate-x-1 mr-3 text-black dark:text-gray-200 focus:-mt-px" isFocused={searchInputFocused}>
								<SearchIcon className="w-4 h-4" />
							</div>
							<input
								className="text-sm flex placeholder-gray-500 dark:placeholder-gray-400 dark:text-gray-300 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-150 py-1.5 -my-1.5 px-1 rounded-full w-full pl-10 focus-visible:ring-1 ring-gray-300 dark:ring-gray-800 focus:outline-none"
								type="text"
								placeholder="Search by name or wallet address"
								value={searchText}
								onFocus={() => {
									setShowSearchResults(true)
									setSearchInputFocused(true)
								}}
								onBlur={() => setSearchInputFocused(false)}
								onChange={e => {
									setShowSearchResults(true)
									setSearchText(e.currentTarget.value)
									setActiveSelectedSearchResult(null)
									handleSearchQuery(e.currentTarget.value, setSearchResults, setIsLoading)
								}}
							/>
						</div>
						<button className="ml-2 flex items-center justify-center focus:outline-none" isFocused={searchInputFocused} onClick={() => toggleMobileSearchOverlay(false)}>
							<XIcon className="w-6 h-6 text-gray-800 dark:text-gray-300" />
						</button>
					</div>
					{searchText.length > 0 && showSearchResults && (
						<div className="flex flex-col mt-4 max-h-[80vh] overflow-y-scroll absolute top-10 sm:top-14 left-16 right-4 border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow" ref={dropdownRef}>
							{isLoading ? (
								<div className="flex justify-center w-full p-4">
									<LoadingSpinner />
								</div>
							) : (
								<>
									{searchResults.map((searchResult, index) => (
										<Link href="/[profile]" as={`/${searchResult?.username || searchResult.address0}`} key={searchResult.profile_id}>
											<div
												className={`flex items-center w-full p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${activeSelectedSearchResult === index ? 'bg-gray-800' : 'dark:bg-gray-900'} ${index === 0 ? 'rounded-t-lg' : ''} ${index === searchResults.length - 1 ? 'rounded-b-lg' : ''}`}
												key={index}
												onClick={() => {
													setShowSearchResults(false)
													setSearchText('')
													toggleMobileSearchOverlay(false)
												}}
											>
												<img className="w-6 h-6 mr-2 rounded-full" src={searchResult?.img_url ? searchResult?.img_url : DEFAULT_PROFILE_PIC} />
												<div className="truncate flex-0 dark:text-gray-300">{searchResult?.name || searchResult.address0}</div>
												{searchResult?.username ? <div className="flex-1 text-sm pl-1 truncate text-gray-400 dark:text-gray-500">@{searchResult?.username}</div> : null}
											</div>
										</Link>
									))}
									{searchResults.length === 0 && <div className="flex w-full p-4 dark:text-gray-400">No matching people</div>}
								</>
							)}
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default SearchBar
