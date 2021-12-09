import { useState, useEffect, useCallback, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import { mixpanel } from 'app/lib/mixpanel'
import { Feed } from 'app/components/feed'
import { axios } from 'app/lib/axios'
import { useUser } from 'app/hooks/use-user'

const ACTIVITY_PAGE_LENGTH = 5 // 5 activity items per activity page

const HomeScreen = () => {
	const { user } = useUser()
	const userId = user?.data?.profile?.profile_id
	const { data, size, setSize, mutate } = useSWRInfinite(
		index => [`/v2/activity?page=${index + 1}&type_id=0&limit=${ACTIVITY_PAGE_LENGTH}`, userId],
		url => axios({ url, method: 'GET' }),
		{
			initialSize: 2,
			revalidateAll: true,
		}
	)

	const [activity, setActivity] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)

	useEffect(() => {
		if (userId) {
			mutate()
		}
	}, [userId])

	useEffect(() => {
		const newData = data?.[size - 1]?.data

		if (!newData) {
			// No data, clean activity feed
			setActivity([])
		} else if (size === 2) {
			// Size 2 means it's the first request,
			// i.e. the beginning of the activity feed
			setActivity([...newData])
		} else {
			// Load more
			setActivity([...activity, ...newData])
		}

		setIsLoading(false)
		setIsRefreshing(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	useEffect(() => {
		mixpanel.track('Home page view')
	}, [])

	const getNext = useCallback(async () => {
		if (isLoading) return null

		setSize(size + 1)
		setIsLoading(true)
	}, [isLoading, setSize, size])

	return (
		<Feed
			activity={activity}
			activityPage={size}
			getNext={getNext}
			isLoading={isLoading}
			isRefreshing={isRefreshing}
			onRefresh={() => {
				setIsRefreshing(true)
				mutate()
			}}
		/>
	)
}

export { HomeScreen }
