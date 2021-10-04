import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import mixpanel from 'mixpanel-browser'
import Layout from '@/components/layout'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import ModalReportItem from '@/components/ModalReportItem'
import TokenDetailBody from '@/components/TokenDetailBody'
import { CHAIN_IDENTIFIERS } from '@/lib/constants'

export async function getServerSideProps({
	query: {
		token: [chain_name, contract_address, token_id],
	},
}) {
	if (!token_id) {
		token_id = contract_address
		contract_address = chain_name
		chain_name = null
	}

	const token = await backend
		.get(`/v2/token/${contract_address}/${token_id}${chain_name ? `?chain_identifier=${CHAIN_IDENTIFIERS[chain_name]}` : ''}`)
		.then(
			({
				data: {
					data: { item },
				},
			}) => item
		)
		.catch(() => null)

	if (token) {
		return { props: { token } }
	}

	return { notFound: true }
}

export default function Token({ token }) {
	const context = useContext(AppContext)
	useEffect(() => {
		// Wait for identity to resolve before recording the view
		if (typeof context.user !== 'undefined') {
			mixpanel.track('NFT page view')
		}
	}, [typeof context.user])

	// Set up my likes
	const [item, setItem] = useState(token)

	const [ownershipDetails, setOwnershipDetails] = useState()

	useEffect(() => {
		setItem(token)
		setOwnershipDetails(null)
		const getOwnershipDetails = async nftId => {
			const detailsData = await backend.get(`/v1/nft_detail/${nftId}`)
			const {
				data: { data: details },
			} = detailsData
			setOwnershipDetails(details)
		}
		if (item) {
			getOwnershipDetails(item.nft_id)
		}
		return () => setOwnershipDetails(null)
	}, [token])

	const [reportModalOpen, setReportModalOpen] = useState(false)

	return (
		<>
			{typeof document !== 'undefined' ? <ModalReportItem isOpen={reportModalOpen} setReportModalOpen={setReportModalOpen} nftId={item.nft_id} /> : null}
			<Layout key={item.nft_id}>
				<Head>
					<title>{item.token_name} | Showtime</title>

					<meta name="description" content={item.token_description} />
					<meta property="og:type" content="website" />
					<meta name="og:description" content={item.token_description} />
					<meta property="og:image" content={item.token_img_twitter_url ? item.token_img_twitter_url : item.token_img_url} />
					<meta name="og:title" content={item.token_name} />

					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content={item.token_name} />
					<meta name="twitter:description" content={item.token_description} />
					<meta name="twitter:image" content={item.token_img_twitter_url ? item.token_img_twitter_url : item.token_img_url} />
				</Head>

				<div>
					<TokenDetailBody item={item} muted={false} className="w-full" ownershipDetails={ownershipDetails} parentSetReportModalOpen={setReportModalOpen} parentReportModalOpen={reportModalOpen} />
				</div>
			</Layout>
		</>
	)
}
