const { useEffect } = require('react')
const { useRef } = require('react')

const useSideEffect = (effect, deps) => {
	const hasInitialised = useRef(false)

	useEffect(() => {
		if (hasInitialised.current) return effect()

		hasInitialised.current = true
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}

export default useSideEffect
