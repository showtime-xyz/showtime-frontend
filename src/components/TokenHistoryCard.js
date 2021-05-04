import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { truncateWithEllipses, formatAddressShort } from '@/lib/utilities'
import Link from 'next/link'
import backend from '@/lib/backend'
import styled from 'styled-components'
import { formatDistanceToNowStrict } from 'date-fns'

const HistoryTableHeader = styled.td`
	white-space: nowrap;
	width: fit-content;
	padding: 0.5rem 1rem 0.5rem 1rem;
	text-overflow: ellipsis;
`

const HistoryTableData = styled.td`
	white-space: nowrap;
	padding: 0.75rem 1rem;
	text-overflow: ellipsis;
`

export default function TokenHistoryCard({ nftId, closeModal }) {
	const [nftHistory, setNftHistory] = useState()
	const [loadingHistory, setLoadingHistory] = useState(true)
	const [loadingMoreHistory, setLoadingMoreHistory] = useState(false)
	const [hasMoreHistory, setHasMoreHistory] = useState(false)

	const getNFTHistory = async nftId => {
		const historyData = await backend.get(`/v1/nft_history/${nftId}${hasMoreHistory ? '' : '?limit=7'}`)
		const {
			data: {
				data: { history, show_quantity: multiple, has_more: hasMore },
			},
		} = historyData
		setNftHistory({ history, multiple })
		setLoadingHistory(false)
		setHasMoreHistory(hasMore)
	}
	useEffect(() => {
		setHasMoreHistory(false)
		setLoadingHistory(true)
		setLoadingMoreHistory(false)
		getNFTHistory(nftId)
		return () => setNftHistory(null)
	}, [nftId])

	const handleGetMoreHistory = async () => {
		setLoadingMoreHistory(true)
		await getNFTHistory(nftId)
		setLoadingMoreHistory(false)
		setHasMoreHistory(false)
	}

	if (loadingHistory) {
		return (
			<div className="text-center my-4">
				<div className="loading-card-spinner" />
			</div>
		)
	}
	return (
		<>
			<div className="overflow-x-auto overflow-y-hidden flex flex-col border-2 border-gray-300 rounded-xl w-full h-full">
				{nftHistory && nftHistory.history && nftHistory.history.length > 0 ? (
					<table className="table-auto text-sm w-full h-full overflow-auto" style={{ borderSpacing: 50 }}>
						<tbody>
							{nftHistory.history.length == 1 && !nftHistory.history[0].from_address ? null : (
								<tr className="text-left text-gray-400 text-sm">
									<HistoryTableHeader>From</HistoryTableHeader>
									<HistoryTableHeader>To</HistoryTableHeader>
									{nftHistory.multiple && <HistoryTableHeader className="text-right">Qty</HistoryTableHeader>}
									<HistoryTableHeader>Date</HistoryTableHeader>
								</tr>
							)}
							{nftHistory.history.map(entry => (
								<tr key={`${entry.timestamp}${entry.from_address}${entry.to_address}`}>
									<HistoryTableData className={!entry.from_address ? `border-t-2 border-gray-100  rounded-bl-xl ${nftHistory.history.length == 1 ? 'rounded-tl-xl' : null}` : ''}>
										{entry.from_address ? (
											<Link href="/[profile]" as={`/${entry.from_username || entry.from_address}`}>
												<a onClick={closeModal}>
													<div className="flex items-center hover:text-stpink transition-all w-max">
														<img src={entry.from_img_url || 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full mr-2 w-6 h-6" />
														<div>{truncateWithEllipses(entry.from_name || entry.from_username || formatAddressShort(entry.from_address), 26)}</div>
													</div>
												</a>
											</Link>
										) : (
											<div className="text-gray-400">Created</div>
										)}
									</HistoryTableData>
									<HistoryTableData
										className={!entry.from_address ? 'border-t-2 border-gray-100 flex flex-row' : ''}
										//colSpan={!entry.from_address ? 3 : 1}
									>
										<Link href="/[profile]" as={`/${entry.to_username || entry.to_address}`}>
											<a onClick={closeModal}>
												<div className="flex items-center hover:text-stpink transition-all w-max">
													<img src={entry.to_img_url || 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full mr-2 w-6 h-6" />
													<div>{truncateWithEllipses(entry.to_name || entry.to_username || formatAddressShort(entry.to_address), 26)}</div>
												</div>
											</a>
										</Link>
									</HistoryTableData>
									{nftHistory.multiple && <HistoryTableData className={!entry.from_address ? 'border-t-2 border-gray-100  text-right' : 'text-right'}>{entry.quantity}</HistoryTableData>}
									<HistoryTableData className={!entry.from_address ? `border-t-2 border-gray-100  rounded-br-xl ${nftHistory.history.length == 1 ? 'rounded-tr-xl' : null}` : ''}>
										{/*format(new Date(entry.timestamp), "PPp")*/}

										{formatDistanceToNowStrict(new Date(entry.timestamp), {
											addSuffix: true,
										})}
									</HistoryTableData>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="py-2 px-4 border-t-2 border-gray-100  rounded-xl text-sm">No history found.</div>
				)}
			</div>
			{hasMoreHistory && (
				<div className="flex flex-row items-center my-2 justify-center">
					{!loadingMoreHistory ? (
						<div className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer transition-all" onClick={handleGetMoreHistory}>
							<div className="mr-2 text-sm">Show All</div>
							<div>
								<FontAwesomeIcon className="h-3" icon={faArrowDown} />
							</div>
						</div>
					) : (
						<div className="p-1">
							<div className="loading-card-spinner-small" />
						</div>
					)}
				</div>
			)}
		</>
	)
}
