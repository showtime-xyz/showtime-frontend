import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import { Magic } from 'magic-sdk'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'

const ModalAddEmail = ({ isOpen, setEmailModalOpen, setHasEmailAddress }) => {
	const [emailValue, setEmailValue] = useState(null)
	const [, setEmailError] = useState('')
	const handleSubmit = async event => {
		setEmailError('')
		event.preventDefault()

		const { elements } = event.target

		// the magic code
		try {
			const did = await new Magic(
				process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
			).auth.loginWithMagicLink({ email: elements.email.value })

			// Once we have the did from magic, login with our own API
			await axios.post(
				'/api/profile/email',
				{},
				{
					headers: { Authorization: `Bearer ${did}` },
				}
			)

			mixpanel.track('Add email success')
			setHasEmailAddress(true)
			setEmailModalOpen(false)
		} catch {
			/* handle errors */
		}
	}
	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={() => setEmailModalOpen(false)} contentWidth="30rem">
					<div className="p-4">
						<form onSubmit={handleSubmit}>
							<CloseButton setEditModalOpen={setEmailModalOpen} />
							<div className="text-3xl border-b-2 pb-2">Add Email</div>
							<div className="mt-8">
								Add your email for notifications & another way to sign in.
							</div>
							<div className="mt-8">
								<input
									name="email"
									placeholder="Email"
									value={emailValue ? emailValue : ''}
									autoFocus
									onChange={e => {
										setEmailValue(e.target.value)
									}}
									type="text"
									maxLength="50"
									className="w-full text-black p-4 rounded-lg border-2 border-gray-700 text-base"
								/>
								<div className="my-8">
									If you've previously logged in with that email, your old profile
									will get combined with this one.
								</div>
								<div className="border-t-2 pt-4">
									<button
										type="submit"
										className="bg-green-500 hover:bg-green-400 border-2 border-green-500 hover:border-green-400 text-white transition px-4 py-2 float-right rounded-full"
									>
										Get Verification Link
									</button>
									<button
										type="button"
										className="border-2 text-gray-800 border-gray-800 hover:border-gray-500 hover:text-gray-500 px-4 py-2 rounded-full transition"
										onClick={() => {
											setEmailModalOpen(false)
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						</form>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}

export default ModalAddEmail
