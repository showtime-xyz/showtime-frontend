import { useContext } from 'react'

import { Link } from 'app/navigation/link'
import { View, Text, Pressable } from 'design-system'
import { mixpanel } from 'app/lib/mixpanel'
import { truncateWithEllipses } from 'app/lib/utilities'
import { AppContext } from 'app/context/app-context'
import UserImageList from 'app/components/user-image-list'

const TRUNCATE_NAME_LENGTH = 24

export default function Follow({ act }) {
	const { isMobile } = useContext(AppContext)
	const { counterparties } = act
	const count = counterparties?.length

	return (
		<View tw="flex-col">
			<View>
				{count === 1 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Followed </Text>
						<Link href={`/${counterparties[0]?.username || counterparties[0]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 2 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Followed </Text>
						<Link href={`/${counterparties[0]?.username || counterparties[0]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and </Text>
						<Link href={`/${counterparties[1]?.username || counterparties[1]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Followed </Text>
						<Link href={`/${counterparties[0]?.username || counterparties[0]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">, </Text>
						<Link href={`/${counterparties[1]?.username || counterparties[1]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and </Text>
						<Link href={`/${counterparties[2]?.username || counterparties[2]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[2].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count > 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Followed </Text>
						<Link href={`/${counterparties[0]?.username || counterparties[0]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[0].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">, </Text>
						<Link href={`/${counterparties[1]?.username || counterparties[1]?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Clicked on Followed user's name")}
							>
								<Text tw="text-black dark:text-gray-300">
									{truncateWithEllipses(counterparties[1].name, TRUNCATE_NAME_LENGTH)}
								</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and {count - 2} others.</Text>
					</View>
				)}
			</View>
			<View tw="flex mt-2 mb-4">
				<UserImageList users={counterparties.slice(0, isMobile ? 5 : 7)} />
			</View>
		</View>
	)
}
