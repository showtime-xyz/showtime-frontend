const GhostButton = ({ children, type = 'button', ...props }) => (
	<button type={type} className="border-2 text-gray-800 dark:text-gray-500 border-gray-800 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400 hover:text-gray-500 dark:hover:text-gray-400 px-4 py-2 rounded-full transition focus:outline-none focus-visible:ring-1" {...props}>
		{children}
	</button>
)

export default GhostButton
