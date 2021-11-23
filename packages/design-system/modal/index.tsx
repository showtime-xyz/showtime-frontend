import { Platform, useWindowDimensions } from 'react-native'

import { View } from 'design-system/view'
import { Header } from 'design-system/modal/header'

type Props = {
	children: React.ReactNode
	title?: string
	height?: number
	width?: number
}

export function Modal(props: Props) {
	const { width } = useWindowDimensions()

	return (
		<>
			<View tw="absolute top-0 right-0 bottom-0 left-0 opacity-90 dark:opacity-85 bg-gray-200 dark:bg-black" />
			<View
				tw="z-99999 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg md:shadow-sm ios:w-full ios:h-full absolute ios:relative lg:relative bottom-0 lg:max-h-[600px] lg:max-w-[420px] md:border-t md:border-l md:border-r md:border-b rounded-t-3xl md:rounded-b-3xl ios:rounded-t-none"
				sx={
					Platform.OS === 'web' && width > 1024
						? { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
						: {}
				}
			>
				<Header title={props.title} />
				<View tw="p-6">{props.children}</View>
			</View>
		</>
	)
}
