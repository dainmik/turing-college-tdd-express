import { createMoviesController } from '@/modules/movies/controller'
import express, { json } from 'express'
import { type Database } from './database'
import { jsonErrorHandler } from './middleware/json-error-handler'

export function createApp(db: Database) {
	const app = express()

	app.use(json())

	app.use('/movies', createMoviesController(db))

	app.use(jsonErrorHandler)

	return app
}
