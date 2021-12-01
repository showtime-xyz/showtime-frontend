import { LinkProps } from 'next/link'

import { Pressable } from 'design-system'
import { Props as PressableProps } from 'design-system/pressable-scale'
import { useRouter } from 'app/navigation/use-router'

function Link({ href, onPress, ...props }: LinkProps & PressableProps) {
	const router = useRouter()

	return (
		<Pressable
			onPress={() => {
				if (onPress) {
					onPress()
				}

				router.push(href)
			}}
			{...props}
		/>
	)
}

export { Link }
