import axios from '@/lib/axios'
import useSWR from 'swr'

const useAuth = () => {
	const { data: user, error, revalidate } = useSWR('/api/auth/user', url => axios.get(url).then(res => res.data), { revalidateOnFocus: false, shouldRetryOnError: false })

	return { user, error, loading: !user && !error, isAuthenticated: user && !error, revalidate }
}

export default useAuth
