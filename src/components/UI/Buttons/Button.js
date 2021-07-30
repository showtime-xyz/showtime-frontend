import { forwardRef } from 'react'

const Button = forwardRef(({ style, ...props }, ref) => {
	switch (style) {
		case 'primary':
			return <PrimaryButton ref={ref} {...props} />

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

export const PrimaryButton = ({ className, iconOnly, ...props }) => <BaseButton {...props} className={`border border-transparent dark:border-white bg-black text-white font-medium flex items-center ${iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'} disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

PrimaryButton.displayName = 'PrimaryButton'

export const TertiaryButton = ({ className, ...props }) => <BaseButton {...props} className={`relative bg-gray-100 text-gray-900 font-semibold dark:bg-gray-800 dark:text-gray-200 rounded-2xl flex items-center px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`} />

export default Button
