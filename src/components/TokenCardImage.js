import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { BlurhashCanvas } from 'react-blurhash'

const TokenCardImage = ({ nft }) => {
	useEffect(() => {
		if (!nft?.mime_type?.startsWith('model') || window.customElements.get('model-viewer')) return
		import('@google/model-viewer')
	}, [nft?.mime_type])

	const aRef = useRef()
	const [hasLoadedImage, setHasLoadedImage] = useState(false)
	const [hasLoadedAnimation, setHasLoadedAnimation] = useState(false)
	const [imgWidth, setImgWidth] = useState(null)

	useEffect(() => {
		setImgWidth(aRef?.current?.clientWidth)
	}, [aRef?.current])

	const getImageUrl = (img_url, token_aspect_ratio) => {
		if (img_url && img_url.includes('https://lh3.googleusercontent.com')) {
			if (token_aspect_ratio && token_aspect_ratio > 1) img_url = img_url.split('=')[0] + '=h660'
			else img_url = img_url.split('=')[0] + '=w660'
		}

		return img_url
	}

	return (
		<div
			className="flex-1  cursor-pointer overflow-hidden hover:opacity-90 transition-all"
			ref={aRef}
			style={{
				height: imgWidth,
				backgroundColor: nft.token_background_color ? `#${nft.token_background_color}` : 'black',
			}}
		>
			{nft.mime_type?.startsWith('model') && <model-viewer src={nft.source_url} class="object-cover w-full h-full" autoplay auto-rotate camera-controls ar ar-modes="scene-viewer quick-look" interaction-prompt="none" />}
			{nft.blurhash && !hasLoadedImage && !hasLoadedAnimation && <BlurhashCanvas className="object-cover w-full h-full" hash={nft.blurhash} width={400} height={300} punch={2} />}
			{nft.token_img_url && !(nft.token_has_video && hasLoadedAnimation) && <img src={getImageUrl(nft.token_img_url, nft.token_aspect_ratio)} className="object-cover w-full h-full" onLoad={() => setHasLoadedImage(true)} />}
			{nft.token_has_video && nft.animation_preview_url && (
				<ReactPlayer
					url={nft?.animation_preview_url}
					playing={true}
					loop
					muted={true}
					onReady={() => setHasLoadedAnimation(true)}
					width={imgWidth}
					height={imgWidth}
					playsinline
					// Disable downloading & right click
					config={{
						file: {
							attributes: {
								onContextMenu: e => e.preventDefault(),
								controlsList: 'nodownload',
								style: { objectFit: 'cover', width: '100%', height: '100%' },
							},
						},
					}}
				/>
			)}
			{!nft.token_img_url && !nft.animation_preview_url && (nft.token_has_video || (!nft.token_img_url && nft.token_animation_url)) && (
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
		</div>
	)
}

export default TokenCardImage
