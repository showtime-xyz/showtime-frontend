import axios from '@/lib/axios'
import { buildFormData } from '@/lib/utilities'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useEffect } from 'react'
import { MINT_FORMATS, MINT_TYPES } from '@/lib/constants'
import HelpIcon from './Icons/HelpIcon'
import XIcon from './Icons/XIcon'
import ImageIcon from './Icons/ImageIcon'
import VideoIcon from './Icons/VideoIcon'
import AudioIcon from './Icons/AudioIcon'
import TextIcon from './Icons/TextIcon'
import FileIcon from './Icons/FileIcon'
import CheckIcon from './Icons/CheckIcon'

const IpfsUpload = ({ ipfsHash: baseIpfsHash, onChange = () => null }) => {
	const [uploadProgress, setUploadProgress] = useState(null)
	const [ipfsHash, setIpfsHash] = useState(baseIpfsHash)
	const [fileDetails, setFileDetails] = useState({ type: null, size: null, ext: null })

	useEffect(() => {
		onChange(ipfsHash)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ipfsHash])

	useEffect(() => {
		if (ipfsHash) return
		setIpfsHash(baseIpfsHash)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [baseIpfsHash])

	const cancelUpload = () => {
		setUploadProgress(null)
		setIpfsHash('')
		setFileDetails({ type: null, size: null, ext: null })
	}

	const onFileUpload = async event => {
		const file = event.target.files?.[0]
		if (!file) return

		setUploadProgress(0)
		setFileDetails({ type: file.type.split('/')[0], size: file.size < 1000000 ? Math.floor(file.size / 1000) + 'kb' : Math.floor(file.size / 1000000) + 'mb', ext: file.type.split('/')[1] })

		const { token: pinataToken } = await axios.post('/api/pinata/generate-key').then(res => res.data)

		const formData = buildFormData({ file, pinataMetadata: { name: uuid() } })

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

	return (
		<div className="flex items-center justify-between">
			{ipfsHash ? (
				<>
					<div className="flex items-center space-x-1.5 text-gray-500">
						<MintIcon type={fileDetails.type} className="w-5 h-5" />
						<p className="text-xs font-semibold">
							{fileDetails.size} <span className="text-gray-300">&bull;</span> {fileDetails?.ext}
						</p>
					</div>
					<div className="flex items-center space-x-1.5">
						<CheckIcon className="w-3 h-3" />
						<span className="text-gray-900 text-xs font-medium">Uploaded to IPFS</span>
					</div>
				</>
			) : uploadProgress != null ? (
				<div className="flex items-center space-x-4">
					<div className="inline-block border-2 w-5 h-5 rounded-full border-gray-100 border-t-indigo-500 animate-spin" />
					<p className="font-semibold text-sm text-gray-700">Uploading to IPFS</p>
					<div className="h-5 w-px bg-gray-300" />
					<div className="flex items-center space-x-2 text-gray-900">
						<button onClick={cancelUpload} className="bg-gray-100 rounded-full p-2.5 focus-visible:ring">
							<XIcon className="w-5 h-5" />
						</button>
					</div>
				</div>
			) : (
				<>
					<div className="flex items-center">
						<div>
							<p className="text-gray-900 text-sm font-semibold">Attachment</p>
							<p className="text-xs font-medium text-gray-500">50mb max</p>
						</div>
						<div className="h-5 w-px bg-gray-300 mx-4" />
						<div className="flex items-center space-x-2 text-gray-900">
							{MINT_TYPES.map(type => (
								<label key={type} className="bg-gray-100 rounded-full p-2.5 cursor-pointer focus:outline-none focus-visible:ring" tabIndex="0">
									<input onChange={onFileUpload} type="file" className="hidden" multiple={false} accept={MINT_FORMATS[type].join(',')} capture="environment" />
									<MintIcon type={type} className="w-5 h-5" />
								</label>
							))}
						</div>
					</div>
					<div className="flex items-center space-x-1">
						<span className="text-gray-700 text-xs font-medium">
							Stored on <span className="font-semibold text-gray-900">IPFS</span>
						</span>
						<HelpIcon className="w-4 h-4 cursor-help" />
					</div>
				</>
			)}
		</div>
	)
}

const MintIcon = ({ type, ...props }) => {
	switch (type) {
		case 'image':
			return <ImageIcon {...props} />
		case 'video':
			return <VideoIcon {...props} />
		case 'audio':
			return <AudioIcon {...props} />
		case 'text':
			return <TextIcon {...props} />

		default:
			return <FileIcon {...props} />
	}
}

export default IpfsUpload
