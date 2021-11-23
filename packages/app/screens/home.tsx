import { useState, useEffect, useCallback, useRef } from 'react'
import useUnmountSignal from 'use-unmount-signal'
import useSWRInfinite from 'swr/infinite'

import { mixpanel } from 'app/lib/mixpanel'
import { Feed } from 'app/components/feed'
import { axios } from 'app/lib/axios'

const ACTIVITY_PAGE_LENGTH = 5 // 5 activity items per activity page

// A function to get the SWR key of each page,
// its return value will be accepted by `fetcher`.
// If `null` is returned, the request of that page won't start.
const getKey = (pageIndex: number, previousPageData: any) => {
	if (previousPageData && !previousPageData.length) return null

	return `/v2/activity?page=${pageIndex + 1}&type_id=0&limit=${ACTIVITY_PAGE_LENGTH}`
}

const HomeScreen = () => {
	const random = useRef(Date.now())
	const unmountSignal = useUnmountSignal()
	const { data, size, setSize } = useSWRInfinite(
		index => [`/v2/activity?page=${index + 1}&type_id=0&limit=${ACTIVITY_PAGE_LENGTH}`, random],
		url => axios({ url, method: 'GET', unmountSignal }),
		{
			initialSize: 2,
		}
	)

	const [activity, setActivity] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)

	useEffect(() => {
		const newData = data?.[size - 1]?.data

		if (newData) {
			setActivity([...activity, ...newData])
			setIsLoading(false)
			setIsRefreshing(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, size])

	useEffect(() => {
		mixpanel.track('Home page view')
	}, [])

	const getNext = useCallback(async () => {
		if (isLoading) return null

		setSize(size + 1)
	}, [isLoading, setSize, size])

	return <Feed activity={activity} activityPage={size} getNext={getNext} isLoading={isLoading} />
}

export { HomeScreen }
