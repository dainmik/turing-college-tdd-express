import { StatusCodes } from 'http-status-codes'

export class MethodNotAllowed extends Error {
	status: number

	constructor(message = 'Method not allowed') {
		super(message)
		this.status = StatusCodes.METHOD_NOT_ALLOWED
	}
}
