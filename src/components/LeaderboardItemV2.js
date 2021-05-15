import { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import AppContext from '@/context/app-context'
import ModalTokenDetail from './ModalTokenDetail'
import useKeyPress from '@/hooks/useKeyPress'
//import ReactPlayer from "react-player";
import { formatAddressShort } from '@/lib/utilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThLarge } from '@fortawesome/free-solid-svg-icons'
import MiniFollowButton from '@/components/MiniFollowButton'
import mixpanel from 'mixpanel-browser'
import ActivityImages from './ActivityImages'

const LeaderboardItemV2 = ({ item, index }) => {
	const context = useContext(AppContext)
	const topItems = item?.top_items.slice(0, 4)
	const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null)
	const currentIndex = topItems?.findIndex(i => i.nft_id === currentlyOpenModal?.nft_id)
	const goToNext = () => {
		if (currentIndex < topItems.length - 1) {
			setCurrentlyOpenModal(topItems[currentIndex + 1])
		}
	}
	const goToPrevious = () => {
		if (currentIndex - 1 >= 0) {
			setCurrentlyOpenModal(topItems[currentIndex - 1])
		}
	}
	const leftPress = useKeyPress('ArrowLeft')
	const rightPress = useKeyPress('ArrowRight')
	const escPress = useKeyPress('Escape')
	useEffect(() => {
		if (escPress) {
			setCurrentlyOpenModal(null)
		}
		if (rightPress && currentlyOpenModal && !context.commentInputFocused) {
			mixpanel.track('Next NFT - keyboard')
			goToNext()
		}
		if (leftPress && currentlyOpenModal && !context.commentInputFocused) {
			mixpanel.track('Prior NFT - keyboard')
			goToPrevious()
		}
	}, [escPress, leftPress, rightPress])

	const [thumnailsOpen, setThumbnailsOpen] = useState(false)

	const handleOpenModal = index => {
		setCurrentlyOpenModal(topItems[index])
	}

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalTokenDetail
						isOpen={currentlyOpenModal}
						setEditModalOpen={setCurrentlyOpenModal}
						item={currentlyOpenModal}
						goToNext={goToNext}
						goToPrevious={goToPrevious}
						columns={context.columns}
						hasNext={!(currentIndex === topItems.length - 1)}
						hasPrevious={!(currentIndex === 0)}
					/>
				</>
			) : null}
			<div key={item.profile_id} className="border-b px-4 py-4">
				<div className="flex flex-row items-center">
					<div className="relative mr-1 w-16 flex-none">
						<Link href="/[profile]" as={`/${item?.username || item.address}`}>
							<a className="cursor-pointer">
								<img
									src={item?.img_url ? item?.img_url : DEFAULT_PROFILE_PIC}
									className="rounded-full h-12 w-12 hover:opacity-90"
								/>
							</a>
						</Link>
						<div className="absolute text-sm bottom-0 right-2 rounded-full bg-white text-center self-center h-6 w-6 font-medium pt-px border border-black border-opacity-10 text-gray-900">
							{index + 1}
						</div>
					</div>

					<div className="flex items-center flex-grow overflow-hidden pr-1">
						<Link href="/[profile]" as={`/${item?.username || item.address}`}>
							<a className="hover:text-stpink cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
								{item?.name || formatAddressShort(item.address) || 'Unnamed'}{' '}
							</a>
						</Link>
						{context.myProfile?.profile_id !== item?.profile_id && (
							<div className="ml-2">
								<MiniFollowButton profileId={item?.profile_id} />
							</div>
						)}
					</div>
					<div>
						<div
							onClick={() => {
								setThumbnailsOpen(!thumnailsOpen)
							}}
							className={`cursor-pointer rounded-full border  ${
								thumnailsOpen
									? 'border-stpink text-stpink'
									: 'border-gray-400 text-gray-700 hover:opacity-80 '
							} text-center px-2 py-1`}
						>
							<FontAwesomeIcon icon={faThLarge} />
						</div>
					</div>
				</div>

				{topItems?.length > 0 && thumnailsOpen ? (
					<div className="flex mt-4 max-w-full">
						<ActivityImages
							nfts={topItems}
							openModal={handleOpenModal}
							roundAllCorners
						/>
					</div>
				) : null}
			</div>
		</>
	)
}

export default LeaderboardItemV2
