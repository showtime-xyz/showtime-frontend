const Button = ({ style, ...props }) => {
	switch (style) {
		case 'primary':
			return <PrimaryButton {...props} />

		case 'tertiary':
			return <TertiaryButton {...props} />

		default:
			throw new Error('No style specified')
	}
}

export const BaseButton = props => {
	const Component = props.as || 'button'

	return <Component {...props} />
}

export const PrimaryButton = ({ className, ...props }) => <BaseButton {...props} className={`border border-transparent dark:border-white bg-black text-white font-medium rounded-2xl flex items-center px-4 py-2 ${className}`} />

export const TertiaryButton = ({ className, ...props }) => <BaseButton {...props} className={`relative bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-2xl flex items-center px-4 py-2 ${className}`} />

export default Button
