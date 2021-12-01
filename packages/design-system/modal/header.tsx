import { View } from 'design-system/view'
import { Text } from 'design-system/text'
import { Button } from 'design-system/button'
import { Close, MoreHorizontal } from 'design-system/icon'
import { useRouter } from 'app/navigation/use-router'
import { tw } from 'design-system/tailwind'

type Props = {
	title?: string
}

export function Header(props: Props) {
	const router = useRouter()

	return (
		<View tw="p-6 h-16 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
			<View tw="w-8 h-8">
				<Button onPress={router.pop} variant="tertiary" tw="h-8 rounded-full p-2" iconOnly={true}>
					<Close
						width={24}
						height={24}
						color={tw.style('bg-black dark:bg-white')?.backgroundColor as string}
					/>
				</Button>
			</View>
			<Text variant="text-lg" tw="dark:text-white font-bold">
				{props.title}
			</Text>
			<View tw="w-8 h-8">
				<Button onPress={router.pop} variant="tertiary" tw="hidden h-8 rounded-full p-2" iconOnly={true}>
					<MoreHorizontal
						width={24}
						height={24}
						color={tw.style('bg-black dark:bg-white')?.backgroundColor as string}
					/>
				</Button>
			</View>
		</View>
	)
}
