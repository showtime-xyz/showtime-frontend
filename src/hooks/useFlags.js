import { useMemo } from 'react'
import useProfile from './useProfile'

export const FLAGS = {
	hasMinting: 'mint',
}

const flagDefs = {
	[FLAGS.hasMinting]: profile => profile?.verified || false,
}

const useFlags = () => {
	const { profile } = useProfile()

	return useMemo(() => Object.fromEntries(Object.values(FLAGS).map(key => [key, flagDefs[key](profile)])), [profile])
}

export default useFlags
