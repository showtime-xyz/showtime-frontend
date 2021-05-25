import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'

export default function ActivityImage({ nft, onLoad }) {
	const aRef = useRef()
	const [imgWidth, setImgWidth] = useState(null)

	useEffect(() => {
		setImgWidth(aRef?.current?.clientWidth)
	}, [aRef?.current])

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

	return (
		<div
			className="flex-1  cursor-pointer overflow-hidden hover:opacity-90 transition-all"
			ref={aRef}
			style={{
				height: imgWidth,
				backgroundColor: nft.token_background_color ? `#${nft.token_background_color}` : 'black',
			}}
		>
			{nft.token_img_url && <img src={getImageUrl(nft.token_img_url, nft.token_aspect_ratio)} className="object-cover w-full h-full" onLoad={onLoad} />}
			{!nft.token_img_url && (nft.token_has_video || (!nft.token_img_url && nft.token_animation_url)) && (
				<ReactPlayer
					url={nft?.token_animation_url}
					playing={true}
					loop
					muted={true}
					width={imgWidth}
					height={imgWidth}
					playsinline
					onReady={onLoad}
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
