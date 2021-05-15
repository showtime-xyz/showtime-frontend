import { useContext, useState, useRef } from 'react'
import mixpanel from 'mixpanel-browser'
import 'croppie/croppie.css'
import Croppie from 'croppie'
import AppContext from '@/context/app-context'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'

export default function Modal({ isOpen, setEditModalOpen }) {
	const context = useContext(AppContext)

	const [image, setImage] = useState('')
	const [croppie, setCroppie] = useState(null)
	const [saveInProgress, setSaveInProgress] = useState(false)

	const formRef = useRef()

	const handleImage = image => {
		setImage(image)
		const el = document.getElementById('image-helper')
		if (el) {
			const croppieInstance = new Croppie(el, {
				enableExif: true,
				viewport: {
					height: 250,
					width: 250,
					type: 'circle',
				},
				boundary: {
					height: 280,
					width: formRef.width,
				},
				enableOrientation: true,
			})
			croppieInstance.bind({
				url: image,
			})
			setCroppie(croppieInstance)
		}
	}

	const handleRemovePhoto = () => {
		setSaveInProgress(true)
		axios
			.post('/api/profile/avatar')
			.then(res => res.data)
			.then(({ data: emptyUrl }) => {
				context.setMyProfile({ ...context.myProfile, img_url: emptyUrl })
				setEditModalOpen(false)
				setSaveInProgress(false)
			})
	}

	const submitPhoto = () => {
		try {
			if (croppie !== null) {
				croppie
					.result({
						type: 'base64',
						size: {
							width: 300,
							height: 300,
						},
						format: 'jpeg',
						circle: false,
					})
					.then(blobString => {
						// Post changes to the API
						axios
							.post('/api/profile/avatar', { image: blobString })
							.then(res => res.data)
							.then(({ data: url }) => {
								context.setMyProfile({ ...context.myProfile, img_url: url })

								setEditModalOpen(false)

								if (croppie) croppie.destroy()
								setCroppie(null)
								setImage('')
								setSaveInProgress(false)
							})
					})
			}
		} catch (e) {
			setSaveInProgress(false)
		}
	}

	const handleSubmit = () => {
		mixpanel.track('Save photo edit')
		setSaveInProgress(true)
		submitPhoto()
	}

	const onChangePicture = e => {
		if (e.target.files[0]) {
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				handleImage(reader.result)
			})
			reader.readAsDataURL(e.target.files[0])
		}
	}

	const hiddenFileInput = useRef(null)

	const handleClick = () => {
		hiddenFileInput.current.click()
	}

	const clearForm = () => {
		if (!saveInProgress) {
			if (croppie) {
				try {
					croppie.destroy()
				} catch (e) {
					console.error(e)
				}
			}
			setCroppie(null)
			setImage('')
		}
	}

	return (
		<>
			{isOpen && (
				<ScrollableModal
					closeModal={() => {
						if (!saveInProgress) {
							clearForm()
							setEditModalOpen(false)
						}
					}}
					contentWidth="30rem"
				>
					<div className="p-4">
						<div ref={formRef}>
							<CloseButton
								cleanupFunction={clearForm}
								setEditModalOpen={setEditModalOpen}
							/>
							<div className="text-3xl border-b-2 pb-2">Edit Photo</div>
							<div className="mt-4 mb-4">
								{image === '' && (
									<div>
										<div
											className="border-2 border-transparent text-white bg-stpink hover:border-stpink hover:bg-transparent hover:text-stpink transition text-center mt-16  px-4 py-3  rounded-full cursor-pointer"
											onClick={handleClick}
										>
											Upload a photo
										</div>
										<div className="text-center text-xs mb-16 mt-4 text-gray-700">
											Accepts JPEG, PNG, and GIF (non-animated)
										</div>

										<input
											ref={hiddenFileInput}
											className="hidden"
											id="profilePic"
											type="file"
											onChange={onChangePicture}
										/>
									</div>
								)}

								<div className="w-full">
									<div id="image-helper"></div>
								</div>

								{image !== '' && (
									<div
										className="text-sm text-center cursor-pointer"
										onClick={clearForm}
									>
										Clear
									</div>
								)}
							</div>

							<div className="border-t-2 pt-4 flex flex-row items-center">
								<div>
									<button
										type="button"
										className="border-2 text-gray-800 border-gray-800 hover:border-gray-500 hover:text-gray-500 px-4 py-2 rounded-full outline-none"
										onClick={() => {
											if (!saveInProgress) {
												setEditModalOpen(false)
												clearForm()
											}
										}}
									>
										Cancel
									</button>
								</div>

								{context.myProfile.img_url && (
									<div
										className="text-sm ml-4 cursor-pointer"
										onClick={handleRemovePhoto}
									>
										Remove
									</div>
								)}
								<div className="flex-grow"></div>
								<div>
									<button
										onClick={handleSubmit}
										className={`bg-green-500 hover:bg-green-400 border-2 border-green-500 hover:border-green-400 text-white transition px-4 py-2 rounded-full float-right w-24 ${
											image === '' ? 'opacity-60 cursor-not-allowed' : ''
										}`}
										disabled={image === '' || saveInProgress}
									>
										{saveInProgress ? (
											<div className="flex items-center justify-center">
												<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
											</div>
										) : (
											'Save'
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
