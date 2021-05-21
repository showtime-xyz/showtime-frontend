import { useContext, useEffect, useRef, useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import mixpanel from 'mixpanel-browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AppContext from '@/context/app-context'
import backend from '@/lib/backend'
import useKeyPress from '@/hooks/useKeyPress'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import LoadingSpinner from './LoadingSpinner'

const handleSearchQuery = AwesomeDebouncePromise(async (searchText, setSearchResults, setIsLoading) => {
	setIsLoading(true)

	setSearchResults(await backend.get(`/v1/search?q=${searchText}`).then(res => res?.data?.data))

	setIsLoading(false)
}, 500)

//TODO: Refactor this component to use HeadlessUI's Listbox Component
const SearchBar = () => {
	const router = useRouter()
	const context = useContext(AppContext)

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
			<div className="hidden flex-col relative ml-6 pr-6 w-full max-w-3xl md:flex">
				<div className="flex relative w-full" ref={searchInputContainerRef}>
					<div className="flex absolute left-4 top-1/2 transform -translate-y-2 mb-px w-3.5 h-3.5 mr-3 text-black dark:text-gray-200 focus:-mt-px">
						<FontAwesomeIcon icon={faSearch} />
					</div>
					<input
						className="flex dark:bg-gray-800 border dark:border-gray-800 py-1.5 px-4 rounded-full w-full pl-10 focus:-mt-px focus:ring-1 ring-gray-300 dark:ring-gray-800 focus:outline-none"
						type="search"
						placeholder={context.gridWidth < 400 ? 'Search by name' : 'Search by name or wallet address'}
						value={searchText}
						onFocus={() => {
							setShowSearchResults(true)
							setSearchInputFocused(true)
						}}
						onBlur={() => {
							setSearchInputFocused(false)
						}}
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
											className={`flex items-center w-full p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${activeSelectedSearchResult === index ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} ${index === 0 ? 'rounded-t-lg' : ''} ${index === searchResults.length - 1 ? 'rounded-b-lg' : ''}`}
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
			<div className="flex justify-end md:hidden relative w-full sm:ml-4 sm:justify-start ml-1">
				<button className="flex items-center justify-center w-3.5 h-3.5 text-black dark:text-white hover:text-stpink dark:hover:text-stpink p-4" onClick={() => toggleMobileSearchOverlay(true)}>
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</div>

			{/* Start overlay menu */}
			{isMobileSearchOverlayOpen && (
				<div className="flex flex-col absolute md:h-16 bg-white dark:bg-gray-900 md:p-3 w-full left-0 md:top-0 z-1 top-12 pt-1 pb-2 px-4 shadow">
					<div className="flex items-center">
						<button className="flex items-center justify-center w-3.5 h-3.5 mr-4 text-black dark:text-gray-300 border-2 border-black dark:border-gray-300 rounded-full p-4 focus:-m-px hover:border-stpink hover:text-stpink" isFocused={searchInputFocused} onClick={() => toggleMobileSearchOverlay(false)}>
							<FontAwesomeIcon icon={faTimes} />
						</button>
						<div className="flex relative w-full" ref={searchInputContainerRef}>
							<div className="flex absolute left-4 top-1/2 transform -translate-y-2 mb-px w-3.5 h-3.5 mr-3 text-black dark:text-gray-200 focus:-mt-px" isFocused={searchInputFocused}>
								<FontAwesomeIcon icon={faSearch} />
							</div>
							<input
								className="flex dark:bg-gray-800 border dark:border-gray-800 py-1.5 px-4 rounded-full w-full pl-10 focus:-mt-px focus:ring-1 ring-gray-300 dark:ring-gray-800 focus:outline-none"
								type="search"
								placeholder={context.gridWidth < 400 ? 'Search by name' : 'Search by name or wallet address'}
								value={searchText}
								onFocus={() => {
									setShowSearchResults(true)
									setSearchInputFocused(true)
								}}
								onBlur={() => {
									setSearchInputFocused(false)
								}}
								onChange={e => {
									setShowSearchResults(true)
									setSearchText(e.currentTarget.value)
									setActiveSelectedSearchResult(null)
									handleSearchQuery(e.currentTarget.value, setSearchResults, setIsLoading)
								}}
							/>
						</div>
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
