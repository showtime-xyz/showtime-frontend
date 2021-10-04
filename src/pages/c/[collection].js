import { useState, useEffect, useContext, Fragment } from 'react'
import Head from 'next/head'
import Layout from '@/components/layout'
import TokenGridV4 from '@/components/TokenGridV4'
import { useRouter } from 'next/router'
import backend from '@/lib/backend'
import backendscripts from '@/lib/backend-scripts'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import { GridTabs, GridTab } from '@/components/GridTabs'
import CappedWidth from '@/components/CappedWidth'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from '@/lib/utilities'

export async function getServerSideProps(context) {
	const { collection } = context.query

	// Get list of collections
	const response_collection_list = await backend.get('/v1/collection_list')
	const collection_list = [
		{
			name: 'All leading collections',
			value: 'all',
			order_by: 'visitor_count',
			order_direction: 'desc',
			img_url: '/logo_sm.png',
		},
		...response_collection_list.data.data,
	]

	const selected_collection = collection_list.filter(item => item.value === collection).length > 0 ? collection_list.filter(item => item.value === collection)[0] : null

	console.log(collection_list)

	return {
		props: {
			collection_list,
			collection,
			selected_collection,
		}, // will be passed to the page component as props
	}
}

export default function Collection({ collection_list, collection, selected_collection }) {
	const context = useContext(AppContext)
	const { isMobile } = context
	const [sortBy, setSortby] = useState('random')

	const [pageTitle, setPageTitle] = useState(selected_collection ? (selected_collection.name === 'All leading collections' ? 'Discover' : `Discover ${selected_collection.name}`) : `Discover ${collection}`)

	const router = useRouter()

	const [isChanging, setIsChanging] = useState(true)

	const [collectionItems, setCollectionItems] = useState([])
	const [currentCollectionName, setCurrentCollectionName] = useState(selected_collection ? (selected_collection.name === 'All leading collections' ? null : selected_collection.name) : collection ? collection.replace(/-/g, ' ') : collection)
	const [randomNumber, setRandomNumber] = useState(1)

	const onChange = async c => {
		mixpanel.track('Collection filter dropdown select', {
			collection: c['value'],
		})

		router.push('/c/[collection]', `/c/${c['value']}`, {
			shallow: true,
		})
	}

	useEffect(() => {
		let isSubscribed = true

		const selectedValue = collection_list.filter(c => c.value == router.query.collection)[0]

		setSelected(selectedValue)

		if (router.query.collection == 'all') {
			setPageTitle('Discover')
			setCurrentCollectionName(null)
		} else {
			setPageTitle(selectedValue ? selectedValue.name : router.query.collection.replace(/-/g, ' '))
			setCurrentCollectionName(selectedValue ? selectedValue.name : router.query.collection.replace(/-/g, ' '))
		}

		const getCollectionItems = async collection_name => {
			setIsChanging(true)
			const response_collection_items = await backend.get(`/v2/collection?limit=150&order_by=${sortBy}&collection=${collection_name}`)

			mixpanel.track('Discover page view', {
				collection: collection_name,
				sortby: sortBy,
			})

			if (sortBy == 'random') {
				// Resetting the cache for random items - for next load
				backendscripts.get(`/api/v2/collection?limit=150&recache=1&order_by=${sortBy}&collection=${collection_name}`)
			}

			if (isSubscribed) {
				setCollectionItems(response_collection_items.data.data)
			}
			setIsChanging(false)
		}

		getCollectionItems(router.query.collection)

		return () => (isSubscribed = false)
	}, [router.query.collection, sortBy, randomNumber, collection_list])

	const [selected, setSelected] = useState()

	const FilterTabs = (
		<GridTabs>
			<GridTab
				label="Random"
				isActive={sortBy === 'random'}
				onClickTab={() => {
					if (sortBy === 'random') {
						// Rerun the random tab
						setRandomNumber(Math.random())
						mixpanel.track('Random button re-clicked')
					} else {
						setSortby('random')
						mixpanel.track('Random button clicked')
					}
				}}
			/>
			<GridTab
				label={!isMobile ? 'Last Sold' : 'Sold'}
				isActive={sortBy === 'sold'}
				onClickTab={() => {
					setSortby('sold')
					mixpanel.track('Recently sold button clicked')
				}}
			/>
			<GridTab
				label="Newest"
				isActive={sortBy === 'newest'}
				onClickTab={() => {
					setSortby('newest')
					mixpanel.track('Newest button clicked')
				}}
			/>
			{!isMobile && (
				<GridTab
					label="Oldest"
					isActive={sortBy === 'oldest'}
					onClickTab={() => {
						setSortby('oldest')
						mixpanel.track('Oldest button clicked')
					}}
				/>
			)}
			<GridTab
				label="Trending"
				isActive={sortBy === 'trending'}
				onClickTab={() => {
					setSortby('trending')
					mixpanel.track('Trending button clicked')
				}}
			/>
		</GridTabs>
	)

	return (
		<Layout key={collection}>
			<Head>
				<title>{pageTitle} | Showtime</title>

				<meta name="description" content="Discover and showcase crypto art" />
				<meta property="og:type" content="website" />
				<meta name="og:description" content="Discover and showcase crypto art" />

				<meta property="og:image" content={selected_collection ? selected_collection.img_url : 'https://tryshowtime.com/banner.png'} />

				<meta name="og:title" content={`Showtime | ${pageTitle}`} />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={`Showtime | ${pageTitle}`} />
				<meta name="twitter:description" content="Discover and showcase crypto art" />

				<meta name="twitter:image" content={selected_collection ? selected_collection.img_url : 'https://tryshowtime.com/banner.png'} />
			</Head>

			<div className="py-12 sm:py-14 px-8 sm:px-10 text-left bg-gradient-to-r from-green-400 to-blue-400">
				<CappedWidth>
					<div className="flex flex-row mx-3 text-white">
						<div className="flex-1">
							<div className="text-xl sm:text-2xl dark:text-black">Discover</div>
							<div className="text-3xl sm:text-6xl capitalize font-afro dark:text-black">{currentCollectionName ? currentCollectionName : 'Leading NFT'}</div>
							<div className="text-3xl sm:text-6xl dark:text-black">{currentCollectionName ? 'Collection.' : 'Collections.'}</div>
						</div>
					</div>
				</CappedWidth>
			</div>
			<CappedWidth>
				<div className=" flex-1 -mt-4 mx-3 lg:w-2/3 lg:pr-6 xl:w-1/2 ">
					<div className="border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 py-6 text-center flex flex-col md:flex-row items-center">
						<div className="flex-1 mb-3 md:mb-0 dark:text-gray-300">Select a collection to browse: </div>
						<div className="flex-1 text-left">
							<Listbox value={selected} onChange={onChange}>
								{({ open }) => (
									<>
										<div className="mt-1 relative z-10 w-64">
											<Listbox.Button className="relative w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-700 sm:text-sm">
												<span className="flex items-center">
													{selected ? (
														<>
															<img src={selected.img_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
															<span className="ml-3 block truncate dark:text-gray-300">{selected.name}</span>
														</>
													) : (
														<span>&nbsp;</span>
													)}
												</span>
												<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
													<SelectorIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
												</span>
											</Listbox.Button>

											<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
												<Listbox.Options static className="absolute mt-1 w-full border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
													{collection_list.map(c => (
														<Listbox.Option key={c.value} className={({ active }) => classNames(active ? 'text-white dark:text-gray-300 bg-indigo-600 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-400', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={c}>
															{({ selected, active }) => (
																<>
																	<div className="flex items-center">
																		<img src={c.img_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
																		<span
																			className={classNames(
																				selected
																					? 'font-normal' // "font-semibold"
																					: 'font-normal',
																				'ml-3 block truncate'
																			)}
																		>
																			{c.name}
																		</span>
																	</div>

																	{selected ? (
																		<span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
																			<CheckIcon className="h-5 w-5" aria-hidden="true" />
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
						</div>
					</div>
				</div>

				<div className="mx-auto relative mt-12 overflow-hidden">{FilterTabs}</div>

				<div className="m-auto relative min-h-screen md:mx-3 pb-12">
					<TokenGridV4 items={collectionItems} isLoading={isChanging} extraColumn key={`grid_${router.query.collection}_${sortBy}_${randomNumber}_${isChanging}`} />
				</div>
			</CappedWidth>
		</Layout>
	)
}
