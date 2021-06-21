import nc from 'next-connect'
import { withSentry } from '@sentry/nextjs'

export default () =>
	nc({
		onError: (err, req, res, next) => {
			// Due to how the Sentry integration works, successful requests throw the request as an exception. Weird, I know.
			if (err == req) return next()

			if (process.env.NODE_ENV === 'development') {
				console.error(err)
				if (err.response.data.error.code === 429) return res.status(429).json(err.response.data.error)
				return res.status(500).json(err.response)
			}

			if (err.response.data.error.code === 429) return res.status(429).send(err.response.data.error)
			res.status(500).send('Internal Server Error')
		},
	}).use((req, res, next) => withSentry(next)(req, res))
