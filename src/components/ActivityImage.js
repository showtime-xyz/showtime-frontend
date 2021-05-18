import { useState, useEffect, useRef, useContext } from 'react'
import ReactPlayer from 'react-player'
import mixpanel from 'mixpanel-browser'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import AppContext from '@/context/app-context'

export default function ActivityImage({ nft, index, numberOfImages, openModal, spacingIndex, bottomRow, roundAllCorners, totalNumberOfImages }) {
	const aRef = useRef()
	const { isMobile, windowSize } = useContext(AppContext)
	const [imgWidth, setImgWidth] = useState(null)
	const [isHovering, setIsHovering] = useState(false)
	useEffect(() => {
		setImgWidth(aRef?.current?.clientWidth)
	}, [aRef?.current?.clientWidth])

	useEffect(() => {
		setImgWidth(aRef?.current?.clientWidth)
	}, [])

	useEffect(() => {
		setImgWidth(aRef?.current?.clientWidth)
	}, [windowSize])

	const getImageUrl = (img_url, token_aspect_ratio) => {
		if (img_url && img_url.includes('https://lh3.googleusercontent.com')) {
			if (token_aspect_ratio && token_aspect_ratio > 1) {
				img_url = img_url.split('=')[0] + '=h660'
			} else {
				img_url = img_url.split('=')[0] + '=w660'
			}
		}
		return img_url
	}

	const getImageUrlLarge = (img_url, token_aspect_ratio) => {
		if (img_url && img_url.includes('https://lh3.googleusercontent.com')) {
			if (token_aspect_ratio && token_aspect_ratio > 1) {
				img_url = img_url.split('=')[0] + '=h1328'
			} else {
				img_url = img_url.split('=')[0] + '=w1328'
			}
		}
		return img_url
	}

	return (
		<div
			className={`flex-1 relative cursor-pointer overflow-hidden hover:opacity-90  transition-all ${spacingIndex !== numberOfImages - 1 ? 'mr-1' : ''} ${bottomRow && spacingIndex === 0 ? 'sm:rounded-bl-lg' : null} ${bottomRow && spacingIndex === 1 ? 'sm:rounded-br-lg' : null} ${roundAllCorners && index === 0 ? 'sm:rounded-tl-lg' : null} ${roundAllCorners && (index === 1 || totalNumberOfImages === 1 || totalNumberOfImages === 3) ? 'sm:rounded-tr-lg' : null} ${roundAllCorners && totalNumberOfImages === 1 ? 'sm:rounded-bl-lg sm:rounded-br-lg' : null}`}
			ref={aRef}
			style={{
				height: imgWidth,
				backgroundColor: nft.token_background_color ? `#${nft.token_background_color}` : 'black',
			}}
			onClick={() => {
				openModal(index)
				mixpanel.track('Activity - Click on NFT image, open modal')
			}}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{nft.token_img_url && !(nft.token_has_video && numberOfImages === 1) && <img src={numberOfImages === 1 ? getImageUrlLarge(nft.token_img_url, nft.token_aspect_ratio) : getImageUrl(nft.token_img_url, nft.token_aspect_ratio)} className="object-cover w-full h-full" />}
			{nft.token_has_video && (!nft.token_img_url || numberOfImages === 1) && (
				<ReactPlayer
					url={nft?.token_animation_url}
					playing={true}
					loop
					muted={true}
					width={imgWidth}
					height={imgWidth}
					playsinline
					// Disable downloading & right click
					config={{
						file: {
							attributes: {
								onContextMenu: e => e.preventDefault(),
								controlsList: 'nodownload',
							},
						},
					}}
				/>
			)}
			{totalNumberOfImages > 1 && !isMobile && (
				<div className={`absolute flex bottom-1 right-0 py-1 px-2 bg-white bg-opacity-95 shadow-md rounded-xl transform scale-90 ${isHovering ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-1'} transition-all`} onClick={e => e.stopPropagation()}>
					<LikeButton item={nft} />
					<div className="w-3" />
					<CommentButton
						item={nft}
						handleComment={() => {
							mixpanel.track('Open NFT modal via hover comment button')
							openModal(index)
						}}
					/>
				</div>
			)}
		</div>
	)
}
