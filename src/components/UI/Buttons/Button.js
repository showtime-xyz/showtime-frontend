import { forwardRef } from 'react'

const Button = forwardRef(({ style, ...props }, ref) => {
	switch (style) {
		case 'primary':
			return <PrimaryButton ref={ref} {...props} />
		case 'gradient':
			return <GradientButton ref={ref} {...props} />
		case 'danger':
			return <DangerButton ref={ref} {...props} />

		case 'tertiary':
			return <TertiaryButton ref={ref} {...props} />
		case 'tertiary_gray':
			return <TertiaryButton ref={ref} {...props} />

		default:
			throw new Error('No style specified')
	}
})

Button.displayName = 'Button'

export const BaseButton = forwardRef((props, ref) => {
	const Component = props.as || 'button'

	return <Component {...{ ...props, ref, as: undefined }} />
})

BaseButton.displayName = 'BaseButton'

export const PrimaryButton = ({ className, iconOnly, ...props }) => <BaseButton {...props} className={`border-2 border-transparent dark:border-white bg-black text-white font-medium flex items-center ${iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'} disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

PrimaryButton.displayName = 'PrimaryButton'

export const GradientButton = ({ className, iconOnly, ...props }) => <BaseButton {...props} className={`bg-gradient-to-r from-[#6366F1] dark:from-[#22D3EE] to-[#D946EF] dark:to-[#8B5CF6] text-white font-medium flex items-center ${iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'} disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

GradientButton.displayName = 'GradientButton'

export const DangerButton = ({ className, iconOnly, ...props }) => <BaseButton {...props} className={`bg-red-500 dark:bg-red-700 text-white font-medium flex items-center ${iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'} disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

DangerButton.displayName = 'DangerButton'

export const TertiaryButton = ({ className, ...props }) => <BaseButton {...props} className={`relative bg-gray-100 text-gray-900 font-semibold dark:bg-gray-800 dark:text-gray-200 rounded-2xl flex items-center px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

export default Button
