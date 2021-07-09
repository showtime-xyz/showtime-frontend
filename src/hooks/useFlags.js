import { useMemo } from 'react'
import useProfile from './useProfile'

export const FLAGS = {
	hasMinting: 'mint',
}

export const flagDefs = {
	[FLAGS.hasMinting]: profile => !!profile?.username, //profile?.verified || false,
}

const useFlags = () => {
	const { profile, loading } = useProfile()

	return { ...useMemo(() => Object.fromEntries(Object.values(FLAGS).map(key => [key, flagDefs[key](profile)])), [profile]), loading }
}

export default useFlags
