const PrimaryButton = ({ children, type = 'button', ...props }) => (
	<div {...props} type={type} className="border-2 border-transparent text-white dark:text-gray-900 bg-stpink hover:border-stpink hover:bg-transparent hover:text-stpink dark:hover:text-stpink transition text-center px-4 py-3 rounded-full cursor-pointer">
		{children}
	</div>
)

export default PrimaryButton
