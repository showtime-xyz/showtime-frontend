import { forwardRef } from 'react'

const Button = forwardRef(({ style, ...props }, ref) => {
	switch (style) {
		case 'primary':
			return <PrimaryButton ref={ref} {...props} />

		case 'tertiary':
			return <TertiaryButton ref={ref} {...props} />

		case 'tertiary_gray':
			return <TertiaryGrayButton ref={ref} {...props} />

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

export const PrimaryButton = forwardRef(({ className, iconOnly, ...props }, ref) => <BaseButton ref={ref} {...props} className={`border-2 border-transparent dark:border-white bg-black disabled:bg-gray-400 dark:disabled:border-gray-700 dark:disabled:text-gray-600 text-white font-medium dark:bg-transparent flex items-center ${iconOnly ? 'p-2 rounded-xl' : 'px-4 py-2 rounded-2xl'} transition ${className}`} />)

PrimaryButton.displayName = 'PrimaryButton'

export const TertiaryButton = ({ className, ...props }) => <BaseButton {...props} className={`relative border border-transparent bg-white dark:bg-gray-900 rounded-2xl flex items-center px-4 py-2 before:absolute before:inset-0 before:z-[-1] before:rounded-inherit before:bg-gradient-to-r before:from-[#4DEAFF] before:to-[#894DFF] before:m-[-2px] ${className}`} />

export const TertiaryGrayButton = ({ className, ...props }) => <BaseButton {...props} className={`relative border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl flex items-center px-4 py-2 ${className}`} />

export default Button
