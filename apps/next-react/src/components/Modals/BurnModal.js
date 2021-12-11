import useProfile from '@/hooks/useProfile'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import { Dialog, Transition } from '@headlessui/react'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import { useRef, useState } from 'react'
import { Fragment } from 'react'
import XIcon from '../Icons/XIcon'
import Button from '../UI/Buttons/Button'
import minterAbi from '@/data/ShowtimeMT.json'
import PolygonIcon from '../Icons/PolygonIcon'
import { ExclamationIcon } from '@heroicons/react/outline'
import useSWR from 'swr'
import backend from '@/lib/backend'

const MODAL_STATES = {
	GENERAL: 'general',
	PROCESSING: 'processing',
	BURNING: 'burning',
	BURNED: 'burned',
	CHANGE_WALLET: 'wrong_wallet',
}

const BurnModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const [modalState, setModalState] = useState(MODAL_STATES.GENERAL)

	const [quantity, setQuantity] = useState(1)
	const [transactionHash, setTransactionHash] = useState(null)

	const { data: ownershipData } = useSWR(
		() => open && myProfile && `/v1/owned_quantity?nft_id=${token.nft_id}&profile_id=${myProfile.profile_id}`,
		url => backend.get(url).then(res => res.data?.data)
	)

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalState === MODAL_STATES.PROCESSING) return

		onClose()
		setQuantity(1)
		setTransactionHash(null)
	}

	const burnToken = async () => {
		setModalState(MODAL_STATES.PROCESSING)

		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(
			error => {
				if (error !== 'Modal closed by user') throw error

				isWeb3ModalActive.current = false
				throw setModalState(MODAL_STATES.GENERAL)
			}
		)

		const signerAddress = await web3.getSigner().getAddress()

		if (
			!myProfile?.wallet_addresses_v2
				?.map(({ address }) => address.toLowerCase())
				?.includes(signerAddress.toLowerCase())
		) {
			return setModalState(MODAL_STATES.CHANGE_WALLET)
		}

		const contract = new ethers.Contract(
			process.env.NEXT_PUBLIC_MINTING_CONTRACT,
			minterAbi,
			biconomy.getSignerByAddress(signerAddress)
		)

		const { data } = await contract.populateTransaction.burn(signerAddress, token.token_id, quantity)

		const provider = biconomy.getEthersProvider()

		const transaction = await provider
			.send('eth_sendTransaction', [
				{
					data,
					from: signerAddress,
					to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
					signatureType: 'EIP712_SIGN',
				},
			])
			.catch(error => {
				if (error.code === 4001) throw setModalState(MODAL_STATES.GENERAL)

				if (
					JSON.parse(error?.body || error?.error?.body || '{}')?.error?.message?.includes(
						'burn amount exceeds balance'
					)
				) {
					alert("Burn failed: You're trying to burn more tokens than you own.")
					throw setModalState(MODAL_STATES.GENERAL)
				}

				console.log(JSON.parse(error?.body || error?.error?.body || '{}')?.error?.message)

				throw error
			})

		setTransactionHash(transaction)
		provider.once(transaction, () => setModalState(MODAL_STATES.BURNED))

		setModalState(MODAL_STATES.BURNING)
	}

	const renderedState = (type => {
		switch (type) {
			case MODAL_STATES.GENERAL:
				return (
					<GeneralState
						maxTokens={ownershipData?.owned_count || 1}
						quantity={quantity}
						setQuantity={setQuantity}
						onClose={trueOnClose}
						burnToken={burnToken}
					/>
				)
			case MODAL_STATES.PROCESSING:
				return <LoadingState />
			case MODAL_STATES.BURNING:
				return <BurningState transactionHash={transactionHash} />
			case MODAL_STATES.BURNED:
				return <BurnedState transactionHash={transactionHash} quantity={quantity} />
			case MODAL_STATES.CHANGE_WALLET:
				return <WalletErrorState burnToken={burnToken} />
		}
	})(modalState)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				static
				className="xs:inset-0 fixed overflow-y-auto z-[2] modal-mobile-position"
				open={open}
				onClose={trueOnClose}
			>
				<div className="bg-white dark:bg-black z-20 modal-mobile-gap" />
				<div className="min-h-screen text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block align-bottom rounded-t-3xl sm:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-white dark:bg-black shadow-xl sm:max-w-lg w-full">
							<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
								<h2 className="text-gray-900 dark:text-white text-xl font-bold">Burn NFT</h2>
								{modalState !== MODAL_STATES.PROCESSING && (
									<button
										onClick={trueOnClose}
										className="p-3 -my-3 hover:bg-gray-100 disabled:hidden rounded-xl transition"
									>
										<XIcon className="w-4 h-4" />
									</button>
								)}
							</div>
							{renderedState}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const GeneralState = ({ maxTokens, quantity, setQuantity, onClose, burnToken }) => (
	<>
		<div className="p-4 space-y-4 border-b border-gray-100 dark:border-gray-900 text-gray-900 dark:text-white">
			<p className="font-medium">Are you sure you want to burn this NFT?</p>
			<p className="font-medium">This can’t be undone and it will be sent to a burn address.</p>
		</div>
		<div className="p-4 border-b border-gray-100 dark:border-gray-900">
			<div className="flex items-center justify-between space-x-4">
				<div className="flex-1">
					<p className="font-semibold text-gray-900 dark:text-white">Quantity</p>
					<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default</p>
				</div>
				<input
					type="number"
					min="1"
					max={maxTokens}
					placeholder="1"
					className="px-4 py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring min-w-[60px] no-spinners text-right"
					value={quantity}
					onChange={event =>
						event.target.value < 1 || event.target.value.trim() == ''
							? setQuantity(1)
							: event.target.value > maxTokens
							? setQuantity(maxTokens)
							: setQuantity(parseInt(event.target.value))
					}
				/>
			</div>
		</div>
		<div className="p-4">
			<div className="flex items-center justify-between">
				<Button style="tertiary" onClick={onClose}>
					Cancel
				</Button>
				<Button style="danger" onClick={burnToken}>
					Burn
				</Button>
			</div>
		</div>
	</>
)

const LoadingState = () => {
	return (
		<div
			tabIndex="0"
			className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center"
		>
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">Preparing to burn this NFT...</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs">
					We'll ask you to confirm with the wallet holding it shortly.
				</p>
			</div>
		</div>
	)
}

const BurningState = ({ transactionHash }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">
					Your NFT is being burned on the Polygon network.
				</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
					Feel free to navigate away from this screen
				</p>
			</div>
			<Button
				style="tertiary"
				as="a"
				href={`https://${
					process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''
				}polygonscan.com/tx/${transactionHash}`}
				target="_blank"
				className="space-x-2"
			>
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on PolygonScan</span>
			</Button>
		</div>
	)
}

const BurnedState = ({ transactionHash, quantity }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<p className="font-medium text-5xl">🔥</p>
			<p className="font-medium text-gray-900 dark:text-white text-center">
				Your NFT has been forever burned on the Polygon network.{' '}
				{quantity == 1
					? 'It might still show up on your profile for a few minutes'
					: 'The editions might still appear on your profile for a few minutes'}
				.
			</p>
			<Button
				style="tertiary"
				as="a"
				href={`https://${
					process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''
				}polygonscan.com/tx/${transactionHash}`}
				target="_blank"
				className="space-x-2"
			>
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on PolygonScan</span>
			</Button>
		</div>
	)
}

const WalletErrorState = ({ burnToken }) => {
	return (
		<div
			tabIndex="0"
			className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none"
		>
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">
				The wallet you selected is not the owner of this NFT.
			</p>
			<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
				Please{' '}
				<button onClick={burnToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

export default BurnModal
