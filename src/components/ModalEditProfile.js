import { useContext, useState, useEffect, Fragment } from 'react'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useRouter } from 'next/router'
import mixpanel from 'mixpanel-browser'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import { SORT_FIELDS } from '@/lib/constants'
import ScrollableModal from './ScrollableModal'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, PlusCircleIcon, SelectorIcon } from '@heroicons/react/solid'
import { classNames } from '@/lib/utilities'
import axios from '@/lib/axios'
import Dropdown from './UI/Dropdown'
import GreenButton from './UI/Buttons/GreenButton'
import GhostButton from './UI/Buttons/GhostButton'
import CloseButton from './CloseButton'

const handleUsernameLookup = async (value, context, setCustomURLError) => {
	const username = value ? value.trim() : null
	let validUsername
	try {
		if (username === null || username.toLowerCase() === context.myProfile?.username?.toLowerCase()) {
			validUsername = true
		} else {
			const result = await backend.get(`/v1/username_available?username=${username}`, {
				method: 'get',
			})
			validUsername = result?.data?.data
		}
	} catch {
		validUsername = false
	}
	setCustomURLError(
		validUsername
			? {
					isError: false,
					message: username === null ? '' : 'Username is available',
			  }
			: { isError: true, message: 'Username is not available' }
	)
	return validUsername
}
const handleDebouncedUsernameLookup = AwesomeDebouncePromise(handleUsernameLookup, 400)

export default function Modal({ isOpen, setEditModalOpen }) {
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)
	const SHOWTIME_PROD_URL = 'tryshowtime.com/'
	const context = useContext(AppContext)
	const [nameValue, setNameValue] = useState(null)
	const [customURLValue, setCustomURLValue] = useState('')

	const [socialLinks, setSocialLinks] = useState()
	const [socialLinkOptions, setSocialLinkOptions] = useState([])

	const [customURLError, setCustomURLError] = useState({
		isError: false,
		message: '',
	})
	const [bioValue, setBioValue] = useState(null)
	const [websiteValue, setWebsiteValue] = useState(null)
	const [defaultListId, setDefaultListId] = useState('')
	const [defaultCreatedSortId, setDefaultCreatedSortId] = useState(1)
	const [defaultOwnedSortId, setDefaultOwnedSortId] = useState(1)

	useEffect(() => {
		if (context.myProfile) {
			setNameValue(context.myProfile.name)
			setCustomURLValue(context.myProfile.username)
			setBioValue(context.myProfile.bio)
			setWebsiteValue(context.myProfile.website_url)
			setDefaultListId(context.myProfile.default_list_id || '')
			setDefaultCreatedSortId(context.myProfile.default_created_sort_id || 1)
			setDefaultOwnedSortId(context.myProfile.default_owned_sort_id || 1)
			setSocialLinks(context.myProfile.links)
		}
	}, [context.myProfile, isOpen])

	const handleSubmit = async event => {
		event.preventDefault()
		setSubmitting(true)
		mixpanel.track('Save profile edit')

		const username = customURLValue ? customURLValue.trim() : null

		if (username?.toLowerCase() != context.myProfile.username?.toLowerCase()) {
			const validUsername = await handleUsernameLookup(customURLValue, context, setCustomURLError)
			if (!validUsername) {
				return
			}
		}

		// Post changes to the API
		await axios.post('/api/profile', {
			name: nameValue?.trim() ? nameValue.trim() : null, // handle names with all whitespaces
			bio: bioValue?.trim() ? bioValue.trim() : null,
			username: username?.trim() ? username.trim() : null,
			website_url: websiteValue?.trim() ? websiteValue.trim() : null,
			links: socialLinks
				.filter(sl => sl.user_input?.trim())
				.map(sl => ({
					type_id: sl.type_id,
					user_input: sl.user_input?.trim() ? sl.user_input.trim() : null,
				})),
			default_list_id: defaultListId ? defaultListId : '',
			default_created_sort_id: defaultCreatedSortId,
			default_owned_sort_id: defaultOwnedSortId,
		})

		// Update state to immediately show changes
		context.setMyProfile({
			...context.myProfile,
			name: nameValue?.trim() ? nameValue.trim() : null, // handle names with all whitespaces
			bio: bioValue?.trim() ? bioValue.trim() : null,
			username: username?.trim() ? username.trim() : null,
			website_url: websiteValue?.trim() ? websiteValue.trim() : null,
			links: socialLinks
				.filter(sl => sl.user_input?.trim())
				.map(sl => ({
					...sl,
					user_input: sl.user_input?.trim(),
				})),
			default_list_id: defaultListId ? defaultListId : '',
			default_created_sort_id: defaultCreatedSortId,
			default_owned_sort_id: defaultOwnedSortId,
		})
		setSubmitting(false)
		setEditModalOpen(false)
		const wallet_addresses = context.myProfile?.wallet_addresses
		// confirm saved correctly
		router.push(`/${username || (wallet_addresses && wallet_addresses[0]) || ''}`)
	}

	const tab_list = [
		{
			label: 'Select...',
			value: '',
		},
		{
			label: 'Created',
			value: 1,
		},
		{
			label: 'Owned',
			value: 2,
		},
		{
			label: 'Liked',
			value: 3,
		},
	]

	const sortingOptionsList = [
		//{ label: "Select...", key: "" },
		...Object.keys(SORT_FIELDS).map(key => SORT_FIELDS[key]),
	]

	useEffect(() => {
		const getSocialLinkOptions = async () => {
			const optionsJson = await axios.get('/api/getsociallinkoptions').then(res => res.data)

			setSocialLinkOptions(
				optionsJson
					? optionsJson.map(opt => ({
							type_id: opt.id,
							icon_url: opt.icon_url,
							name: opt.name,
							prefix: opt.prefix,
					  }))
					: []
			)
		}
		getSocialLinkOptions()
	}, [])

	const emptySelectedAddSocialLink = {
		//icon_url: "/icons/twitter.png",
		type_id: -1,
		name: 'Select website...',
	}
	const [selectedAddSocialLink] = useState(emptySelectedAddSocialLink)

	const handleRemoveSocialLink = id => {
		setSocialLinks(socialLinks.filter(socialLink => socialLink.type_id !== id))
	}

	const filteredSocialLinkOptions = () => {
		return socialLinkOptions.filter(option => !socialLinks.map(sl => sl.type_id).includes(option.type_id))
	}

	const handleSocialSelected = event => setSocialLinks([...socialLinks, { ...event, user_input: '' }])

	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={() => setEditModalOpen(false)} contentWidth="60rem">
					<form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
						<div className="text-3xl border-b-2 dark:border-gray-800 pb-2 flex justify-between items-start">
							<div className="dark:text-gray-300">Edit Info</div>
							<CloseButton setEditModalOpen={setEditModalOpen} />
						</div>

						<div className="flex flex-col md:flex-row">
							<div className="flex-1 my-4 ">
								<div className="text-xl text-indigo-500 dark:text-indigo-400 mb-3">Profile</div>

								<div className="py-2">
									<label htmlFor="name" className="block text-sm text-gray-700 dark:text-gray-500">
										Name
									</label>
									<input
										name="name"
										placeholder="Your display name"
										value={nameValue ? nameValue : ''}
										onChange={e => {
											const value = e.target.value
											setNameValue(value)
										}}
										type="text"
										maxLength="50"
										className="mt-1 dark:text-gray-300 relative w-full border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-800 sm:text-sm"
									/>
									<label htmlFor="customURL" className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-500 sm:pt-2">
										Username
									</label>
									<div className="mt-1 ">
										<div className="max-w-lg flex rounded-md shadow-sm">
											<span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 bg-gray-100 text-gray-700 dark:text-gray-500 sm:text-sm">{SHOWTIME_PROD_URL}</span>
											<input
												type="text"
												name="customURL"
												id="customURL"
												autoComplete="username"
												className="pl-2 dark:text-gray-300 border flex-1 block w-full focus:outline-none focus:ring focus:ring-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-800"
												value={customURLValue ? customURLValue : ''}
												onChange={e => {
													const value = e.target.value
													const urlRegex = /^[a-zA-Z0-9_]*$/
													if (urlRegex.test(value)) {
														setCustomURLValue(value)
														handleDebouncedUsernameLookup(value, context, setCustomURLError)
													}
												}}
												maxLength={30}
											/>
										</div>
									</div>
								</div>
								<div className={`text-xs text-right ${customURLError.message ? 'visible' : 'invisible'} ${customURLError.isError ? 'text-red-500' : 'text-green-400'}`}>&nbsp;{customURLError.message}</div>
								<label htmlFor="bio" className="block text-sm text-gray-700 dark:text-gray-500">
									About Me (optional)
								</label>
								<textarea
									name="bio"
									placeholder=""
									value={bioValue ? bioValue : ''}
									onChange={e => {
										setBioValue(e.target.value)
									}}
									type="text"
									maxLength="300"
									rows={3}
									className="mt-1 dark:text-gray-300 relative w-full border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-700 sm:text-sm"
								></textarea>

								<div className="text-right text-gray-500 dark:text-gray-600 text-xs">300 character limit</div>
							</div>
							<div className="w-6 flex-shrink" />
							{/* second row */}
							<div className="flex-1 my-4 md:pr-4">
								<div>
									<div className="text-xl text-indigo-500 dark:text-indigo-400 mb-3">Links</div>

									<div className="py-2">
										{socialLinks &&
											socialLinks.map(linkObj => (
												<div key={linkObj.name} className="mb-4 pb-2">
													<div className="flex items-center justify-between">
														<label htmlFor={linkObj.name} className="text-sm font-medium text-gray-700 dark:text-gray-500 flex flex-row">
															<img className="h-5 w-5 mr-1" src={linkObj.icon_url} />
															{linkObj.name}
														</label>
														<span className="text-xs ml-2 text-gray-400 dark:text-gray-600 hover:text-red-400 cursor-pointer" onClick={() => handleRemoveSocialLink(linkObj.type_id)}>
															Remove
														</span>
													</div>
													<div className="mt-1">
														<div className="max-w-lg flex rounded-md shadow-sm">
															<span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-500 sm:text-sm">{linkObj.prefix}</span>
															<input
																type="text"
																name={linkObj.name}
																id={linkObj.name}
																className="pl-2 dark:text-gray-300 border flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-700 focus:outline-none focus:ring"
																value={linkObj.user_input ? linkObj.user_input : ''}
																onChange={e => {
																	const value = e.target.value

																	setSocialLinks(
																		socialLinks.map(link => {
																			if (link.name === linkObj.name) {
																				return { ...link, user_input: value }
																			}
																			return link
																		})
																	)
																}}
																autoComplete="false"
																maxLength={50}
															/>
														</div>
													</div>
												</div>
											))}
										<div className="flex items-center">
											<div className="flex-1">
												<Listbox value={selectedAddSocialLink} onChange={handleSocialSelected}>
													{({ open }) => (
														<>
															<Listbox.Label className="block text-sm text-gray-700 dark:text-gray-500">Add Link</Listbox.Label>
															<div className="flex flex-row items-center">
																<PlusCircleIcon className="w-5 h-5 mr-2 dark:text-gray-400" />
																<div className="flex items-center flex-grow">
																	<div className="mt-1 relative flex-1">
																		<Listbox.Button className="bg-white dark:bg-gray-700 relative w-full border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-700 sm:text-sm">
																			<span className="flex items-center">
																				{selectedAddSocialLink.icon_url && <img src={selectedAddSocialLink.icon_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />}
																				<span className={`${selectedAddSocialLink.icon_url ? 'ml-3' : null} block truncate dark:text-gray-400`}>{selectedAddSocialLink.name}</span>
																				<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																					<SelectorIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
																				</span>
																			</span>
																		</Listbox.Button>

																		<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
																			<Listbox.Options static className="z-10 absolute mt-1 w-full border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
																				{filteredSocialLinkOptions().map(opt => (
																					<Listbox.Option key={opt.type_id} className={({ active }) => classNames(active ? 'text-white dark:text-gray-300 bg-indigo-600 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-400', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={opt}>
																						{({ active }) => (
																							<>
																								<div className="flex items-center">
																									<img src={opt.icon_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
																									<span className="ml-3 block truncate">{opt.name}</span>
																								</div>

																								{opt === selectedAddSocialLink ? (
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
																</div>
															</div>
														</>
													)}
												</Listbox>
											</div>
										</div>
									</div>
									<div className="mb-4 pt-3 md:pb-14">
										<label htmlFor="websiteValue" className="text-gray-700 dark:text-gray-500 text-sm">
											Other Website
										</label>
										<input name="websiteValue" placeholder="Your URL" value={websiteValue ? websiteValue : ''} onChange={e => setWebsiteValue(e.target.value)} type="url" className="mt-1 dark:text-gray-300 relative w-full border border-gray-300 dark:border-gray-800 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-700 sm:text-sm" />
									</div>
								</div>
							</div>
							{/* Third column */}
							<div className="flex-1 my-4 md:pl-2">
								<div>
									<div className="text-xl text-indigo-500 dark:text-indigo-400 mt-2 pt-2 md:mt-0 md:pt-0 mb-3">Page Settings</div>
									<div className="py-2 mb-2">
										<Dropdown label="Default NFT List" options={tab_list} value={defaultListId} onChange={setDefaultListId} />
									</div>
									<div className="py-2 mb-2">
										<Dropdown label="Sort Created By" options={sortingOptionsList} value={defaultCreatedSortId} onChange={setDefaultCreatedSortId} />
									</div>
									<div className="py-2 mb-16">
										<Dropdown label="Sort Owned By" options={sortingOptionsList} value={defaultOwnedSortId} onChange={value => setDefaultOwnedSortId(value)} />
									</div>
								</div>
							</div>
						</div>

						{/* Submit section */}
						<div>
							<div className="border-t-2 dark:border-gray-800 pt-4">
								<GreenButton type="submit" loading={submitting}>
									Save changes
								</GreenButton>
								<GhostButton
									onClick={() => {
										setEditModalOpen(false)
										setNameValue(context.myProfile.name)
									}}
									disabled={submitting}
								>
									Cancel
								</GhostButton>
							</div>
						</div>
					</form>
				</ScrollableModal>
			)}
		</>
	)
}
