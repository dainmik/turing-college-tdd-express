import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import { Router } from 'express'
import { createMoviesRepository } from './repository'

export const createMoviesController = (db: Database) => {
	const messages = createMoviesRepository(db)
	const router = Router()

	router.get(
		'/',
		jsonRoute(async (req, res) => {
			if (typeof req.query.id !== 'string') {
				const movies = await messages.findAll()
				res.status(200)
				res.json(movies)
				return
			}

			// a hard-coded solution for your first controller test
			const ids = req.query.id.split(',').map(Number)
			const movies = await messages.findByIds(ids)

			res.status(200)
			res.json(movies)
		})
	)

	return router
}
