import { Theme, Text as DripsyText } from 'dripsy'
import { ComponentProps, createContext, forwardRef, useContext } from 'react'
import type { Text as TextType } from 'react-native'

import { tw as tailwind } from 'design-system/tailwind'

type Variant = keyof Theme['text']

type TextProps = ComponentProps<typeof DripsyText>

type Props = { tw?: string; variant?: Variant } & Pick<TextProps, 'onLayout' | 'children' | 'selectable' | 'sx'>

/**
 * Text should inherit styles from parent text nodes.
 */
const ParentContext = createContext<{} | undefined>(undefined)

/**
 * Note: You can wrap <DripsyText> in a <View> with a background color
 * to verify if the text is rendered correctly and if Capsize is working well.
 */
export const Text = forwardRef<TextType, Props>(({ variant, onLayout, children, selectable, tw, sx }, ref) => {
	const parentTw = useContext(ParentContext)

	const compoundSx = { ...tailwind.style(parentTw), ...sx, ...tailwind.style(tw) }

	return (
		<DripsyText ref={ref} variant={variant} selectable={selectable} onLayout={onLayout} sx={compoundSx}>
			<ParentContext.Provider value={compoundSx}>{children}</ParentContext.Provider>
		</DripsyText>
	)
})

Text.displayName = 'Text'
