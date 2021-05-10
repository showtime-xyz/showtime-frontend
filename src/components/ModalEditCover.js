import { useContext, useState, useRef } from 'react'
import mixpanel from 'mixpanel-browser'
import 'croppie/croppie.css'
import Croppie from 'croppie'
import AppContext from '@/context/app-context'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'

export default function ModalEditCover({ isOpen, setEditModalOpen }) {
	const context = useContext(AppContext)

	const [image, setImage] = useState('')
	const [croppie, setCroppie] = useState(null)
	const [saveInProgress, setSaveInProgress] = useState(false)

	const formRef = useRef()

	const handleImage = image => {
		setImage(image)
		const el = document.getElementById('image-helper')
		if (el && formRef.current?.clientWidth) {
			const croppieInstance = new Croppie(el, {
				enableExif: true,
				viewport: {
					height: formRef.current?.clientWidth / 5,
					width: formRef.current?.clientWidth,
					type: 'square',
				},
				boundary: {
					height: 280,
					width: formRef.current?.clientWidth,
				},
				enableOrientation: true,
			})
			croppieInstance.bind({
				url: image,
				zoom: 0,
			})
			setCroppie(croppieInstance)
		}
	}

	const handleRemovePhoto = () => {
		setSaveInProgress(true)
		axios
			.post('/api/profile/cover')
			.then(res => res.data)
			.then(({ data: emptyUrl }) => {
				context.setMyProfile({ ...context.myProfile, cover_url: emptyUrl })
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
							width: 2880,
							height: 576,
						},
						//size: "original",
						//quality: 0.75,
						format: 'jpeg',
						circle: false,
					})
					.then(blobString => {
						// Post changes to the API
						axios
							.post('/api/profile/cover', { image: blobString })
							.then(res => res.data)
							.then(({ data: url }) => {
								context.setMyProfile({ ...context.myProfile, cover_url: url })

								setEditModalOpen(false)
								setSaveInProgress(false)
								if (croppie) croppie.destroy()
								setCroppie(null)
								setImage('')
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

	const handleClickUpload = () => {
		hiddenFileInput.current.click()
	}

	return (
		<>
			{isOpen && (
				<ScrollableModal
					closeModal={() => {
						if (!saveInProgress) {
							setEditModalOpen(false)
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
					}}
					contentWidth="30rem"
				>
					<div className="p-4">
						<div ref={formRef}>
							<CloseButton setEditModalOpen={setEditModalOpen} />
							<div className="text-3xl border-b-2 pb-2">Edit Cover Image</div>
							<div className="mt-4 mb-4">
								{image === '' && (
									<div className="my-16">
										<div className="showtime-pink-button text-sm text-center px-4 py-3 rounded-full cursor-pointer" onClick={handleClickUpload}>
											Upload cover image
										</div>
										<div className="text-center text-xs mt-4 text-gray-700">Accepts JPEG, PNG, and GIF (non-animated)</div>

										<input ref={hiddenFileInput} className="hidden" id="profilePic" type="file" onChange={onChangePicture} />
									</div>
								)}

								<div className="w-full">
									<div id="image-helper"></div>
								</div>

								{image !== '' && (
									<div
										className="text-sm text-center cursor-pointer"
										onClick={() => {
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
										}}
									>
										Clear
									</div>
								)}
							</div>
							<div className="border-t-2 pt-4 flex flex-row items-center">
								<div>
									<button
										type="button"
										className="showtime-black-button-outline  px-4 py-2  rounded-full"
										onClick={() => {
											if (!saveInProgress) {
												setEditModalOpen(false)
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
										}}
									>
										Cancel
									</button>
								</div>

								{context.myProfile.cover_url && (
									<div className="text-sm ml-4 cursor-pointer" onClick={handleRemovePhoto}>
										Remove
									</div>
								)}
								<div className="flex-grow"></div>
								<div>
									<button
										onClick={handleSubmit}
										className="showtime-green-button  px-4 py-2  rounded-full float-right w-24"
										style={
											image === ''
												? {
														borderColor: '#35bb5b',
														borderWidth: 2,
														opacity: 0.6,
														cursor: 'not-allowed',
												  }
												: { borderColor: '#35bb5b', borderWidth: 2, opacity: 1 }
										}
										disabled={image === '' || saveInProgress}
									>
										{saveInProgress ? (
											<div className="flex items-center justify-center">
												<div className="loading-card-spinner-small" />
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
