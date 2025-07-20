import { type ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

const { NODE_ENV } = process.env
const isTest = NODE_ENV === 'test'

/**
 * Reports error in a simple structured JSON format.
 */
export const jsonErrorHandler: ErrorRequestHandler = (
	error,
	_req,
	res,
	// Express requires all parameters to be present to recognize
	// the function as an error handler, so we have to add this
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next
) => {
	const statusCode = getErrorStatusCode(error)

	// display error in the console
	if (!isTest) {
		// tests tend to produce errors on purpose and
		// we don't want to pollute the console expected behavior

		console.error(error)
	}

	const messagePayload =
		error instanceof Error ? error.message : 'Internal server error'
	const errorPayload = error instanceof Error ? error : {}

	res.status(statusCode).json({
		error: {
			message: messagePayload,
			...errorPayload,
		},
	})
}

function getErrorStatusCode(error: unknown) {
	if (
		typeof error === 'object' &&
		error != null &&
		'status' in error &&
		typeof error.status === 'number'
	) {
		return error.status
	}

	// some implementation detail awareness
	if (error instanceof ZodError) return StatusCodes.BAD_REQUEST

	// assume the worst
	return StatusCodes.INTERNAL_SERVER_ERROR
}
