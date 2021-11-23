import { Media } from 'design-system/card/media'

import { View } from 'design-system'

type Props = {
	act: any
	variant: 'nft' | 'activity' | 'market'
}

function Card({ act }: Props) {
	const { id, nfts, actor } = act

	return (
		<View>
			<Media nfts={nfts} />
		</View>
	)
}

export { Card }
