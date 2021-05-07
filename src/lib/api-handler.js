import nc from 'next-connect'
import { captureException, withScope, Handlers } from '@sentry/nextjs'
import { addExceptionMechanism } from '@sentry/utils'

const { parseRequest } = Handlers

export default () =>
	nc({
		onError: (err, req, res) => {
			if (process.env.NODE_ENV === 'development') {
				console.error(err)

				return res.status(500).json(err)
			}
			// Log the exception on Sentry
			withScope(scope => {
				scope.addEventProcessor(event => {
					addExceptionMechanism(event, { handled: false })

					return parseRequest(event, req)
				})

				captureException(err)
			})

			res.status(500).send('Internal Server Error')
		},
	})
