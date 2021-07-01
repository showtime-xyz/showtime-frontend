import axios from '@/lib/axios'
import { buildFormData } from '@/lib/utilities'
import { useState } from 'react'
import Button from './UI/Buttons/Button'
import { v4 as uuid } from 'uuid'
import { useEffect } from 'react'
import TokenCard from './TokenCard'
import useProfile from '@/hooks/useProfile'
import { useMemo } from 'react'
import { useRef } from 'react'
import { FORMATS } from '@/pages/mint/[type]'

const IpfsUpload = ({ type, wallet, onChange, tokenName }) => {
	const { profile } = useProfile()
	const [uploadProgress, setUploadProgress] = useState(null)
	const [filePreview, setFilePreview] = useState(null)
	const [ipfsHash, setIpfsHash] = useState('')
	const imageRef = useRef(null)

	useEffect(() => {
		onChange(ipfsHash)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ipfsHash])

	const cancelUpload = () => {
		setUploadProgress(null)
		setIpfsHash('')
		setFilePreview(null)
	}

	const onFileUpload = async event => {
		const file = event.target.files?.[0]
		if (!file) return

		setFilePreview(URL.createObjectURL(file))
		setUploadProgress(0)

		const { token: pinataToken } = await axios.post('/api/pinata/generate-key').then(res => res.data)

		const formData = buildFormData({ file, pinataMetadata: { name: uuid(), keyvalues: { wallet } } })

		const { IpfsHash } = await axios
			.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
				maxBodyLength: 'Infinity',
				headers: {
					Authorization: `Bearer ${pinataToken}`,
					'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				},
				onUploadProgress: progressEvent => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total)),
			})
			.then(res => res.data)

		setIpfsHash(IpfsHash)
		setUploadProgress(null)
	}

	const fakeItem = useMemo(
		() => ({
			nft_id: -1,
			token_has_video: type === 'video',
			imageRef,
			creator_address: 'm1guelpf.eth',
			creator_address_nonens: '0x000',
			creator_id: profile?.profile_id,
			creator_img_url: profile?.img_url,
			creator_name: profile?.name,
			creator_username: profile?.username,
			creator_verified: profile?.verified ? 1 : 0,
			token_name: tokenName || 'NFT',
			token_img_url: filePreview,
			token_animation_url: filePreview,
		}),
		[profile, tokenName, filePreview, type]
	)

	return (
		<>
			{ipfsHash ? (
				<div className="max-w-sm">
					<TokenCard isPreview={true} onPreviewClose={cancelUpload} originalItem={fakeItem} currentlyPlayingVideo={-1} currentlyOpenModal={false} isMyProfile={false} listId={1} isChangingOrder={false} />
				</div>
			) : (
				<label className={`rounded-xl ${ipfsHash || uploadProgress != null ? '' : 'cursor-pointer'} border dark:border-gray-700 flex flex-col items-center justify-center space-y-6 px-8 py-16 min-w-[15rem]`}>
					{uploadProgress != null ? (
						<>
							<div className="space-y-2 text-center">
								<p className="font-bold">Uploading to IPFS...</p>
								<a className="text-xs font-medium">Learn about IPFS &rarr;</a>
							</div>
							<div className="rounded overflow-hidden bg-gray-100 w-full h-2 my-6">
								<div className="rounded bg-gradient-to-r from-[#4D54FF] to-[#E14DFF] h-full transition" style={{ width: `${uploadProgress}%` }} />
							</div>
							<button type="button" onClick={cancelUpload} className="text-xs font-bold">
								Cancel Upload
							</button>
						</>
					) : (
						<>
							<input onChange={onFileUpload} type="file" className="hidden" multiple={false} accept={FORMATS[type].join(',')} capture="environment" />
							<p className="font-medium text-sm dark:text-gray-400">{FORMATS[type].join(', ')} / max 50mb</p>
							<Button as="div" type="button" style="primary">
								Choose File
							</Button>
						</>
					)}
				</label>
			)}
		</>
	)
}

export default IpfsUpload
