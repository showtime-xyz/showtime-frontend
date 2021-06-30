import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import Dropdown from '@/components/UI/Dropdown'
import useProfile from '@/hooks/useProfile'
import { Fragment, useState } from 'react'
import { useEffect } from 'react'
import Button from '@/components/UI/Buttons/Button'
import Checkbox from '@/components/UI/Inputs/Checkbox'
import Switch from '@/components/UI/Inputs/Switch'
import { Transition } from '@headlessui/react'
import { useMemo } from 'react'
import Input from '@/components/UI/Inputs/Input'
import Textarea from '@/components/UI/Inputs/Textarea'
import PercentageIcon from '@/components/Icons/PercentageIcon'

const TYPES = ['image', 'video']
const FORMATS = {
	image: ['.png', '.gif', '.jpg', '.tiff'],
	video: ['.mp4'],
}

const MintPage = ({ type }) => {
	const { profile, loading: profileLoading } = useProfile()
	const router = useRouter()
	const [selectedWallet, setSelectedWallet] = useState(null)

	const [uploadProgress, setUploadProgress] = useState(null)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [hasVerifiedAuthorship, setHasVerifiedAuthorship] = useState(false)
	const [isAdultContent, setIsAdultContent] = useState(false)

	const [putOnSale, setPutOnSale] = useState(false)
	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState('eth')

	const [configureOptions, setConfigureOptions] = useState(false)
	const [copies, setCopies] = useState(1)
	const [royalties, setRoyalties] = useState(10)

	const fileUploaded = event => {
		const file = event.target.files?.[0]

		if (!file) return

		setUploadProgress(0)
	}

	const cancelUpload = event => {
		event.preventDefault()

		setUploadProgress(null)
	}

	const isValid = useMemo(() => {
		if (!title || !description || !hasVerifiedAuthorship || !copies || !royalties) return false
		if (putOnSale && (!price || !currency)) return false
		if (copies < 1 || royalties > 100) return false

		return true
	}, [title, description, hasVerifiedAuthorship, putOnSale, price, currency, copies, royalties])

	const submitForm = event => {
		event.preventDefault()

		//
	}

	useEffect(() => {
		if (profileLoading || selectedWallet) return

		setSelectedWallet(profile.wallet_addresses_excluding_email_v2?.[0]?.address)
	}, [profileLoading, profile?.wallet_addresses_excluding_email_v2, selectedWallet])

	return (
		<Layout>
			<div className="my-12 px-4 md:px-0 max-w-4xl xl:max-w-7xl md:mx-auto w-full">
				<div>
					<button onClick={router.back} className="flex items-center font-bold">
						&larr; Back
					</button>
				</div>
				<div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
					<h1 className="text-3xl font-bold">
						Create <span className="capitalize">{type}</span>
					</h1>
					{!profileLoading && <Dropdown className="w-max" options={profile.wallet_addresses_excluding_email_v2.map(({ address, ens_domain }) => ({ value: address, label: ens_domain || address }))} value={selectedWallet} onChange={setSelectedWallet} label="Wallet" />}
				</div>
				<form onSubmit={submitForm} className="mt-12 flex flex-col md:flex-row justify-between space-y-12 md:space-y-0 md:space-x-12">
					<div className="space-y-6">
						<p className="font-bold text-lg">Upload</p>
						<label className={`rounded-xl ${uploadProgress != null ? '' : 'cursor-pointer'} border dark:border-gray-700 flex flex-col items-center justify-center space-y-6 px-8 py-16 min-w-[15rem]`}>
							{uploadProgress != null ? (
								<>
									<div className="space-y-2 text-center">
										<p className="font-bold">Uploading to IPFS...</p>
										<a className="text-xs font-medium">Learn about IPFS &rarr;</a>
									</div>
									<div className="rounded overflow-hidden bg-gray-100 w-full h-2 my-6">
										<div className="rounded bg-gradient-to-r from-[#4D54FF] to-[#E14DFF] h-full transition" style={{ width: `${uploadProgress}%` }} />
									</div>
									<button onClick={cancelUpload} className="text-xs font-bold">
										Cancel Upload
									</button>
								</>
							) : (
								<>
									<input onChange={fileUploaded} type="file" className="hidden" multiple={false} accept={FORMATS[type].join(',')} capture="environment" />
									<p className="font-medium text-sm dark:text-gray-400">{FORMATS[type].join(', ')} / max 50mb</p>
									<Button as="div" type="button" style="primary">
										Choose File
									</Button>
								</>
							)}
						</label>
					</div>
					<div className="flex-1">
						<p className="font-bold text-lg">Details</p>
						<div className="mt-6 space-y-16">
							<div className="space-y-6">
								<Input label="Title" value={title} onChange={setTitle} id="title" placeholder="e.g. Super Cool Marbles" required />
								<Textarea label="Description" labelSubtitle={<span className="ml-1 text-gray-400 font-medium text-xs">(optional)</span>} value={description} onChange={setDescription} id="description" placeholder="e.g. A story about some marbles" />
								<div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
									<Checkbox label="I verify that this artwork is mine" value={hasVerifiedAuthorship} onChange={setHasVerifiedAuthorship} />
									<div className="md:hidden">
										<Checkbox label="Content is 18+" value={isAdultContent} onChange={setIsAdultContent} />
									</div>
									<div className="hidden md:block">
										<Checkbox label="Content is 18+" position="right" value={isAdultContent} onChange={setIsAdultContent} />
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between space-x-3">
									<div className="space-y-3 flex-1">
										<p className="text-lg font-bold">Put on Sale</p>
										<p className="text-sm dark:text-gray-400 font-medium">Enter a price to allow people to purchase your image</p>
									</div>
									<Switch value={putOnSale} onChange={setPutOnSale} />
								</div>
								<Transition appear={false} show={putOnSale} as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-y-full opacity-0" enterTo="translate-y-0 opacity-100" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-y-0 opacity-100" leaveTo="-translate-y-full opacity-0">
									<div className="flex items-stretch space-x-2">
										<Input className="flex-1" label="Price" id="price" value={price} onChange={setPrice} placeholder="Enter Price" required={putOnSale} />
										<Dropdown className="flex-1 flex flex-col" label="Currency" value={currency} onChange={setCurrency} options={[{ label: 'ETH', value: 'eth' }]} />
									</div>
								</Transition>
							</div>
							<div className="space-y-4">
								<div className="flex items-center justify-between space-x-3">
									<div className="space-y-3 flex-1">
										<p className="text-lg font-bold">Options</p>
										<p className="text-sm dark:text-gray-400 font-medium">Pre-filled / copy</p>
									</div>
									<Switch value={configureOptions} onChange={setConfigureOptions} />
								</div>
								<Transition appear={false} show={configureOptions} as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-y-full opacity-0" enterTo="translate-y-0 opacity-100" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-y-0 opacity-100" leaveTo="-translate-y-full opacity-0">
									<div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-2">
										<Input className="flex-1" label="Number of Copies" labelSubtitle={<span className="ml-1 text-gray-400 font-medium text-xs">(1 by default)</span>} value={copies} onChange={setCopies} type="number" id="copies" min="1" required={configureOptions} />
										<Input Icon={PercentageIcon} className="flex-1" label="Royalties" labelSubtitle={<span className="ml-1 text-gray-400 font-medium text-xs">(10% by default)</span>} value={royalties} onChange={setRoyalties} type="number" min="0" step="10" max="100" id="royalties" required={configureOptions} />
									</div>
								</Transition>
							</div>
							<div className="flex items-center justify-between">
								<button className="text-sm font-bold text-gray-400 dark:text-gray-500">Save Draft</button>
								<Button disabled={!isValid} type="submit" style="primary" className="flex items-center">
									Create <span className="capitalize ml-1">{type}</span>
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</Layout>
	)
}

export async function getStaticProps({ params: { type } }) {
	return { props: { type } }
}

export async function getStaticPaths() {
	return {
		paths: TYPES.map(type => ({ params: { type } })),
		fallback: false,
	}
}

export default MintPage
