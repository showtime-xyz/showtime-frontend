import { useContext } from 'react'
import Link from 'next/link'
import UserImageList from '../UserImageList'
import mixpanel from 'mixpanel-browser'
import { truncateWithEllipses } from '@/lib/utilities'
import AppContext from '@/context/app-context'

const TRUNCATE_NAME_LENGTH = 24

export default function Follow({ act }) {
	const { isMobile } = useContext(AppContext)
	const { counterparties } = act
	const count = counterparties?.length
	return (
		<div className="flex flex-col">
			<div className="text-gray-500">
				{count === 1 && (
					<>
						Followed{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[0]?.username || counterparties[0]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>
						.
					</>
				)}
				{count === 2 && (
					<>
						Followed{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[0]?.username || counterparties[0]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>{' '}
						and{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[1]?.username || counterparties[1]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>
						.
					</>
				)}
				{count === 3 && (
					<>
						Followed{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[0]?.username || counterparties[0]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>
						,{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[1]?.username || counterparties[1]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>{' '}
						and{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[2]?.username || counterparties[2]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[2].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>
						.
					</>
				)}
				{count > 3 && (
					<>
						Followed{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[0]?.username || counterparties[0]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>
						,{' '}
						<Link
							href="/[profile]"
							as={`/${
								counterparties[1]?.username || counterparties[1]?.wallet_address
							}`}
						>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track("Activity - Clicked on Followed user's name")
								}}
							>
								{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
							</a>
						</Link>{' '}
						and {count - 2} others.
					</>
				)}
			</div>
			<div className="flex mt-2 mb-4">
				<UserImageList users={counterparties.slice(0, isMobile ? 5 : 7)} />
			</div>
		</div>
	)
}
