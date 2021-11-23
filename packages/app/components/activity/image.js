import { useState, useEffect, useRef, useContext } from 'react'
// import ReactPlayer from 'react-player'

import LikeButton from 'app/components/buttons/like'
import CommentButton from 'app/components/buttons/comment'
import { mixpanel } from 'app/lib/mixpanel'
import { AppContext } from 'app/context/app-context'
import { View, Text, Pressable, Image } from 'design-system'
import { useComponentSize } from 'app/hooks/use-component-size'

// import OrbitIcon from './Icons/OrbitIcon'

export default function ActivityImage({
	nft,
	index,
	numberOfImages,
	openModal,
	spacingIndex,
	bottomRow,
	roundAllCorners,
	totalNumberOfImages,
	cardWidth,
}) {
	// useEffect(() => {
	// 	if (!nft?.mime_type?.startsWith('model') || window.customElements.get('model-viewer')) return
	// 	import('@google/model-viewer')
	// }, [nft?.mime_type])

	const { isMobile } = useContext(AppContext)
	const [isHovering, setIsHovering] = useState(false)
	const [showModel, setShowModel] = useState(false)
	const { width } = useComponentSize()

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
			if (token_aspect_ratio && token_aspect_ratio > 1) img_url = img_url.split('=')[0] + '=h1328'
			else img_url = img_url.split('=')[0] + '=w1328'
		}

		return img_url
	}

	// Automatically load models that have no preview image. We don't account for video here because currently token_animation_url is a glb file.
	useEffect(() => {
		if (!nft || !nft.mime_type?.startsWith('model')) return
		if (nft.token_img_url || nft.token_img_original_url) return

		setShowModel(true)
	}, [nft])

	return (
		<Pressable
			tw={`relative cursor-pointer overflow-hidden hover:opacity-90 transition-all ${
				spacingIndex !== numberOfImages - 1 ? 'mr-1' : ''
			}
				${bottomRow && spacingIndex === 0 ? 'sm:rounded-bl-lg' : null}
				${bottomRow && spacingIndex === 1 ? 'sm:rounded-br-lg' : null}
				${roundAllCorners && index === 0 ? 'sm:rounded-tl-lg' : null}
				${
					roundAllCorners &&
					((index === 0 && (totalNumberOfImages === 1 || totalNumberOfImages === 3)) ||
						(index === 1 && (totalNumberOfImages === 2 || totalNumberOfImages === 4)))
						? 'sm:rounded-tr-lg'
						: null
				}
				${roundAllCorners && totalNumberOfImages === 1 ? 'sm:rounded-bl-lg sm:rounded-br-lg' : null}`}
			sx={{
				height: width,
				backgroundColor: nft.token_background_color ? `#${nft.token_background_color}` : 'black',
			}}
			onPress={() => {
				openModal(index)
				mixpanel.track('Activity - Click on NFT image, open modal')
			}}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{nft.mime_type && (
				<>
					{nft.mime_type?.startsWith('model') && showModel && (
						<model-viewer
							src={nft.source_url}
							class="object-cover w-full h-full"
							autoplay
							camera-controls
							auto-rotate
							ar
							ar-modes="scene-viewer quick-look"
							interaction-prompt="none"
							onPress={event => event.stopPropagation()}
						/>
					)}
					{nft.mime_type?.startsWith('model') && !showModel && (
						<Image
							source={{
								uri:
									numberOfImages === 1
										? getImageUrlLarge(
												nft.still_preview_url ? nft.still_preview_url : nft.token_img_url,
												nft.token_aspect_ratio
										  )
										: getImageUrl(
												nft.still_preview_url ? nft.still_preview_url : nft.token_img_url,
												nft.token_aspect_ratio
										  ),
							}}
							tw="w-[100vw] h-[100vw]"
							style={{
								objectFit: 'cover',
							}}
						/>
					)}
					{nft.mime_type?.startsWith('image') && (
						<Image
							source={{
								uri:
									numberOfImages === 1
										? getImageUrlLarge(
												nft.still_preview_url ? nft.still_preview_url : nft.token_img_url,
												nft.token_aspect_ratio
										  )
										: getImageUrl(
												nft.still_preview_url ? nft.still_preview_url : nft.token_img_url,
												nft.token_aspect_ratio
										  ),
							}}
							tw="w-[100vw] h-[100vw]"
							style={{
								objectFit: 'cover',
							}}
						/>
					)}
					{/* {nft.mime_type?.startsWith('video') && (
						<ReactPlayer
							url={nft.animation_preview_url ? nft.animation_preview_url : nft?.source_url ? nft?.source_url : nft?.token_animation_url}
							playing={true}
							loop
							muted={true}
							width={imgWidth > window.innerWidth ? window.innerWidth : imgWidth > cardWidth ? cardWidth : imgWidth}
							height={imgWidth}
							style={{
								maxWidth: imgWidth > window.innerWidth ? window.innerWidth : imgWidth > cardWidth ? cardWidth : imgWidth,
								justifyContent: 'center',
								alignItems: 'center',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							playsinline
							// Disable downloading & right click
							config={{
								file: {
									attributes: {
										onContextMenu: e => e.preventDefault(),
										controlsList: 'nodownload',
										style: numberOfImages > 1 ? { objectFit: 'cover', width: '100%', height: '100%' } : { width: '100%', height: '100%' },
									},
								},
							}}
						/>
					)} */}
				</>
			)}

			{!nft.mime_type && (
				<>
					{nft.token_img_url &&
						!(
							(nft.token_has_video && !nft.mime_type?.startsWith('model')) ||
							(nft.token_animation_url && !nft.token_img_url)
						) && (
							<Image
								source={{
									uri:
										numberOfImages === 1
											? getImageUrlLarge(nft.token_img_url, nft.token_aspect_ratio)
											: getImageUrl(nft.token_img_url, nft.token_aspect_ratio),
								}}
								tw="object-cover w-full h-full"
							/>
						)}

					{/* {!nft.mime_type?.startsWith('model') && (nft.token_has_video || (nft.token_animation_url && !nft.token_img_url) || nft.animation_preview_url || nft.mime_type?.startsWith('video')) && (
						<ReactPlayer
							url={nft.animation_preview_url ? nft.animation_preview_url : nft?.source_url ? nft?.source_url : nft?.token_animation_url}
							playing={true}
							loop
							muted={true}
							width={imgWidth > window.innerWidth ? window.innerWidth : imgWidth > cardWidth ? cardWidth : imgWidth}
							height={imgWidth}
							style={{
								maxWidth: imgWidth > window.innerWidth ? window.innerWidth : imgWidth > cardWidth ? cardWidth : imgWidth,
								justifyContent: 'center',
								alignItems: 'center',
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
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
					)} */}
				</>
			)}

			{totalNumberOfImages > 1 && !isMobile && (
				<View tw="flex-row">
					<LikeButton item={nft} />
					<View tw="w-3" />
					<CommentButton
						item={nft}
						handleComment={() => {
							mixpanel.track('Open NFT modal via hover comment button')
							openModal(index)
						}}
					/>
				</View>
			)}

			{nft.mime_type?.startsWith('model') && (
				<View
					tw={`p-2.5 ${
						showModel ? '' : 'opacity-80 hover:opacity-100 cursor-pointer'
					} absolute top-1 right-1`}
					onPress={event => {
						event.stopPropagation()
						if (showModel) return
						mixpanel.track('Load 3d model from feed')
						setShowModel(true)
					}}
				>
					<View tw="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
						{/* <OrbitIcon tw="w-4 h-4" /> */}
						<Text tw="font-semibold">3D</Text>
					</View>
				</View>
			)}
		</Pressable>
	)
}
