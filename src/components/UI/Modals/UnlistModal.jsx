import { Dialog, Transition } from '@headlessui/react'
import Button from '../Buttons/Button'
import { useState, Fragment } from 'react'
import { ethers } from 'ethers'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import marketplaceAbi from '@/data/ERC1155Sale.json'
import PolygonIcon from '@/components/Icons/PolygonIcon'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import useProfile from '@/hooks/useProfile'
import { ExclamationIcon } from '@heroicons/react/outline'
import XIcon from '@/components/Icons/XIcon'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { formatAddressShort, truncateWithEllipses } from '@/lib/utilities'
import BadgeIcon from '@/components/Icons/BadgeIcon'

const MODAL_PAGES = {
	GENERAL: 'general',
	LOADING: 'loading',
	PROCESSING: 'processing',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
}

const UnlistModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)
	// const { data: ownershipData } = useSWR(
	// 	() => open && myProfile && `/v1/owned_quantity?nft_id=${token.nft_id}&profile_id=${myProfile.profile_id}`,
	// 	url => backend.get(url).then(res => res.data?.data)
	// )

	const [transactionHash, setTransactionHash] = useState('')

	useEffect(() => {
		if (!token?.mime_type?.startsWith('model') || window.customElements.get('model-viewer')) return
		import('@google/model-viewer')
	}, [token?.mime_type])

	const resetForm = () => {
		setTransactionHash('')
		setModalPage(MODAL_PAGES.GENERAL)
	}

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		resetForm()
		onClose()
	}

	const unlistToken = async () => {
		setModalPage(MODAL_PAGES.LOADING)

		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(error => {
			if (error !== 'Modal closed by user') throw error

			isWeb3ModalActive.current = false
			throw setModalPage(MODAL_PAGES.GENERAL)
		})
		const signerAddress = await web3.getSigner().getAddress()

		if (!myProfile?.wallet_addresses_v2?.map(({ address }) => address.toLowerCase())?.includes(signerAddress.toLowerCase())) {
			return setModalPage(MODAL_PAGES.CHANGE_WALLET)
		}

		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, marketplaceAbi, biconomy.getSignerByAddress(signerAddress))

		const provider = biconomy.getEthersProvider()

		const { data } = await contract.populateTransaction.cancelSale(token.listing.sale_identifier)

		const transaction = await provider
			.send('eth_sendTransaction', [
				{
					data,
					from: signerAddress,
					to: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
					signatureType: 'EIP712_SIGN',
				},
			])
			.catch(error => {
				if (error.code === 4001) throw setModalPage(MODAL_PAGES.GENERAL)

				throw error
			})

		setTransactionHash(transaction)

		provider.once(transaction, () => setModalPage(MODAL_PAGES.SUCCESS))

		setModalPage(MODAL_PAGES.PROCESSING)
	}

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <UnlistPage token={token} unlistToken={unlistToken} onClose={trueOnClose} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.PROCESSING:
				return <MintingPage transactionHash={transactionHash} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage token={token} transactionHash={transactionHash} />
			case MODAL_PAGES.CHANGE_WALLET:
				return <WalletErrorPage listToken={unlistToken} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className="fixed inset-0 overflow-y-auto z-1 pt-[96px] md:pt-0" open={open} onClose={trueOnClose}>
				<div className="min-h-screen text-center">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom rounded-t-3xl sm:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-white dark:bg-black shadow-xl sm:max-w-lg w-full">
							<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
								<h2 className="text-gray-900 dark:text-white text-lg font-bold">Unlist NFT</h2>
								<button onClick={trueOnClose} className="p-3 -my-3 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:hidden rounded-full transition bg-gray-100" disabled={modalPage === MODAL_PAGES.LOADING}>
									<XIcon className="w-4 h-4" />
								</button>
							</div>
							{renderedPage}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const UnlistPage = ({ token, unlistToken, onClose }) => {
	return (
		<>
			<div className="flex-1 overflow-y-auto">
				<div className="p-4 border-b border-gray-100 dark:border-gray-900 space-y-2">
					<p className="font-bold text-gray-900">Are you sure you want to unlist this NFT?</p>
					<p className="font-medium text-gray-900">Unlisting an NFT will remove it from Showtime’s marketplace.</p>
				</div>
				{token && (
					<>
						<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center space-x-4">
							{token.source_url && <div className="w-auto h-20">{token.mime_type.startsWith('model') ? <model-viewer src={token.source_url} autoplay camera-controls auto-rotate ar ar-modes="scene-viewer quick-look" interaction-prompt="none" /> : token.mime_type.startsWith('video') ? <video src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" autoPlay loop muted /> : <img src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" />}</div>}
							<div>
								<p className="font-semibold text-gray-900 dark:text-white">{token?.token_name}</p>
								{token?.token_description && <p className="text-gray-900 dark:text-gray-300 font-medium text-sm">{token.token_description}</p>}
							</div>
						</div>
						<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center">
							<div className="flex items-center space-x-2">
								<img alt={token.creator_name} src={token.creator_img_url ? token.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
								<div>
									<p className="font-medium text-gray-700 dark:text-gray-400 text-xs">Creator</p>
									<div className="flex items-center space-x-1 -mt-0.5">
										<p className="text-gray-900 dark:text-white font-semibold text-sm">{token.creator_name === token.creator_address ? formatAddressShort(token.creator_address) : truncateWithEllipses(token.creator_name, 22)}</p>
										{token.creator_verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" bgClass="text-white dark:text-black" />}
									</div>
								</div>
							</div>
							<hr className="mx-8 border-0 border-r-px dark:border-gray-800" />
						</div>
						<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
							<p className="text-gray-600 text-xs font-semibold">
								{token.listing.total_listed_quantity}/{token.listing.total_edition_quantity} available
							</p>
							<p className="text-gray-600 text-xs font-semibold">{parseInt(token.listing.royalty_percentage)}% Royalties</p>
						</div>
					</>
				)}
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" onClick={onClose}>
						Cancel
					</Button>
					<Button style="primary" onClick={unlistToken}>
						Unlist
					</Button>
				</div>
			</div>
		</>
	)
}

const LoadingPage = () => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center border-b border-gray-100">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs">We'll ask you to sign with your wallet shortly.</p>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled={true}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Unlisting...
					</Button>
				</div>
			</div>
		</div>
	)
}

const MintingPage = ({ transactionHash }) => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center border-b border-gray-100">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>Your NFT is being unlisted from Showtime.</p>
					<p>Feel free to navigate away from this screen.</p>
				</div>
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<p className="text-sm font-medium">View on PolygonScan</p>
				</Button>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled={true}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Unlisting...
					</Button>
				</div>
			</div>
		</div>
	)
}

const SuccessPage = ({ transactionHash, token }) => {
	const tokenURL = `/t/${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'polygon'}/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${token.token_id}`

	const visitTokenPage = event => {
		event.preventDefault()

		window.location = tokenURL
	}

	return (
		<div className="p-12 space-y-10 flex-1 flex flex-col items-center justify-center min-h-[344px]">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 dark:text-white text-center !mt-6">Your NFT has been successfully unlisted!</p>
			<Button style="primary" as="a" href={tokenURL} onClick={visitTokenPage} className="!mt-6">
				View on Showtime &rarr;
			</Button>
			<div className="flex items-center justify-center">
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<span className="text-sm font-medium">PolygonScan</span>
				</Button>
			</div>
		</div>
	)
}

const WalletErrorPage = ({ listToken }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none min-h-[344px]">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">The wallet you selected doesn't own this NFT.</p>
			<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
				Please{' '}
				<button onClick={listToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

export default UnlistModal
