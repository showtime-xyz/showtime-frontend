import { Image } from 'design-system/image'
import { View } from 'design-system/view'
import { Liked, Commented, Transfer, Purchased, Followed } from 'design-system/icon'

type Props = {
	url: string
	icon?: 'none' | 'like' | 'comment' | 'sell' | 'buy' | 'create' | 'follow' | 'send' | 'receive'
}

const Avatar = ({ url, icon = 'none' }: Props) => {
	let Icon = null
	switch (icon) {
		case 'like':
			Icon = Liked
			break
		case 'comment':
			Icon = Commented
			break
		case 'sell':
			Icon = Transfer
			break
		case 'buy':
			Icon = Purchased
			break
		case 'create':
			Icon = Transfer
			break
		case 'follow':
			Icon = Followed
			break
		case 'send':
			Icon = Transfer
			break
		case 'receive':
			Icon = Transfer
			break
	}

	return (
		<View tw="h-12 w-12 rounded-full relative">
			<Image
				tw="h-12 w-12 rounded-full"
				source={{
					uri: url,
				}}
			/>
			{icon !== 'none' ? (
				<View tw="absolute -bottom-px -right-px rounded-full border-white dark:border-black border-2 justify-center items-center">
					<Icon width={20} height={20} color="white" />
				</View>
			) : null}
		</View>
	)
}

export { Avatar }
