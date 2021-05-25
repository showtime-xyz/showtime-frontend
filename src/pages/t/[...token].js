import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import mixpanel from 'mixpanel-browser'
import Layout from '@/components/layout'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import ModalReportItem from '@/components/ModalReportItem'
import TokenDetailBody from '@/components/TokenDetailBody'

export async function getServerSideProps(context) {
	const { res } = context

	const { token: token_array } = context.query
	const contract_address = token_array[0]
	const token_id = token_array[1]

	const response_token = await backend.get(`/v2/token/${contract_address}/${token_id}`)
	const token = response_token.data.data.item

	if (token) {
		return {
			props: {
				token,
			}, // will be passed to the page component as props
		}
	} else {
		res.writeHead(404)
		res.end()
		return { props: {} }
	}
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
					<meta property="og:image" content={item.token_img_preview_url ? item.token_img_preview_url : null} />
					<meta name="og:title" content={item.token_name} />

					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content={item.token_name} />
					<meta name="twitter:description" content={item.token_description} />
					<meta name="twitter:image" content={item.token_img_preview_url ? item.token_img_preview_url : null} />
				</Head>

				<div>
					<TokenDetailBody item={item} muted={false} className="w-full" ownershipDetails={ownershipDetails} parentSetReportModalOpen={setReportModalOpen} parentReportModalOpen={reportModalOpen} />
				</div>
			</Layout>
		</>
	)
}
