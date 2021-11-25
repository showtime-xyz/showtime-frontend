import { forwardRef } from 'react'

import { Text } from 'design-system/text'
import { Pressable, Props as PressableScaleProps } from 'design-system/pressable-scale'
import { tw as tailwind } from 'design-system/tailwind'

type Props = {
	tw?: string
	iconOnly?: boolean
	variant?: 'primary' | 'danger' | 'tertiary'
	size?: 'small' | 'regular'
	children?: React.ReactNode
	ref?: any
} & PressableScaleProps

export const Button = forwardRef(({ variant, ...props }: Props, ref) => {
	switch (variant) {
		case 'primary':
			return <PrimaryButton ref={ref} {...props} />
		case 'danger':
			return <DangerButton ref={ref} {...props} />
		case 'tertiary':
			return <TertiaryButton ref={ref} {...props} />
		default:
			return <PrimaryButton ref={ref} {...props} />
	}
})

Button.displayName = 'Button'

export const BaseButton = forwardRef(({ ...props }: Props, ref) => {
	return <Pressable {...{ ...props, ref }} />
})

BaseButton.displayName = 'BaseButton'

export const PrimaryButton = ({ tw, iconOnly, size, ...props }: Props) => (
	<BaseButton
		{...props}
		tw={`bg-black dark:bg-white flex-row justify-center items-center ${
			iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'
		} ${size === 'regular' ? 'h-10 rounded-3xl' : ''} disabled:opacity-40 disabled:cursor-not-allowed ${
			tw ? tw : ''
		}`}
	/>
)

PrimaryButton.displayName = 'PrimaryButton'

export const DangerButton = ({ tw, iconOnly, size, ...props }: Props) => (
	<BaseButton
		{...props}
		tw={`bg-red-500 dark:bg-red-700 text-white font-medium flex-row justify-center items-center ${
			iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'
		} ${size === 'regular' ? 'h-10 rounded-3xl' : ''} disabled:opacity-40 disabled:cursor-not-allowed ${
			tw ? tw : ''
		}`}
	/>
)

DangerButton.displayName = 'DangerButton'

export const TertiaryButton = ({ tw, iconOnly, size, ...props }: Props) => (
	<BaseButton
		{...props}
		tw={`relative bg-gray-100 text-gray-900 font-semibold dark:bg-gray-800 dark:text-gray-200 flex-row justify-center items-center ${
			iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'
		} ${size === 'regular' ? 'h-10 rounded-3xl' : ''} disabled:opacity-40 disabled:cursor-not-allowed ${
			tw ? tw : ''
		}`}
	/>
)

TertiaryButton.displayName = 'TertiaryButton'

export const ButtonLabel = ({ tw, ...props }: { tw?: string; children?: React.ReactNode }) => {
	// TODO: md:text-base
	return <Text variant="text-sm" {...props} tw={`text-white dark:text-black font-bold ${tw ? tw : ''}`} />
}
