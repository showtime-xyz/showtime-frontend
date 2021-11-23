import PropTypes from 'prop-types'

const CappedWidth = ({ children }) => {
	return <div className="max-w-screen-2xl sm:px-3 mx-auto w-full">{children}</div>
}

CappedWidth.propTypes = {
	children: PropTypes.node.isRequired,
}

export default CappedWidth
