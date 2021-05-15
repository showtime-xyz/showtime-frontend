import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons'
import ModalFeedback from './ModalFeedback'
function Footer() {
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalFeedback
						isOpen={isFeedbackModalOpen}
						closeModal={() => setIsFeedbackModalOpen(false)}
					/>
				</>
			) : null}
			<footer className="text-center mt-12 bg-black">
				<div className="text-sm my-8 py-4 text-center text-gray-500">
					<div className="flex flex-row">
						<div className="flex-grow"></div>
						<div className="px-1">
							<a
								href="mailto:help@tryshowtime.com"
								target="_blank"
								className="hover:text-gray-300 transition-all"
								rel="noreferrer"
							>
								<FontAwesomeIcon className="w-5 h-5" icon={faEnvelope} />
							</a>
						</div>
						<div className="px-1">
							<a
								href="https://twitter.com/tryShowtime"
								target="_blank"
								className="hover:text-gray-300 transition-all"
								rel="noreferrer"
							>
								<FontAwesomeIcon className="w-5 h-5" icon={faTwitter} />
							</a>
						</div>
						<div className="px-1">
							<a
								href="https://www.instagram.com/tryshowtime/"
								target="_blank"
								className="hover:text-gray-300 transition-all"
								rel="noreferrer"
							>
								<FontAwesomeIcon className="w-5 h-5" icon={faInstagram} />
							</a>
						</div>
						<div className="px-1">
							<a
								href="https://discord.gg/FBSxXrcnsm"
								target="_blank"
								className="hover:text-gray-300 transition-all"
								rel="noreferrer"
							>
								<FontAwesomeIcon className="w-5 h-5" icon={faDiscord} />
							</a>
						</div>

						<div className="flex-grow"></div>
					</div>
					<div>
						<a
							href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
							target="_blank"
							className="hover:text-gray-300"
							rel="noreferrer"
						>
							Terms &amp; Conditions
						</a>
						{'  ·  '}
						<span
							className="cursor-pointer hover:text-gray-300 "
							onClick={() => setIsFeedbackModalOpen(true)}
						>
							Feedback
						</span>
					</div>
					<div>© {new Date().getFullYear()} Showtime Technologies, Inc.</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
