import supertest from 'supertest'
// import { createTestDatabase } from '@tests/utils/createTestDatabase'
import { createApp } from '@/app'
import { createDatabase } from '@/database'

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set')
}

// Testing with a real database, fine for read-only tests, as we would not
// want to pollute the database with test data, as then we need to clean it up.
// To make sure we are not modifying anything in a real database, we are using
// a read-only connection.
const db = createDatabase(DATABASE_URL, {
	readonly: true,
})

// We could also easily use an in-memory database here, but then we would need
// to provide some test data
// const db = await createTestDatabase()

const app = createApp(db)

describe('GET', () => {
	it('should return all movies if no ids are provided', async () => {
		const result = await supertest(app).get('/movies').expect(200)

		expect(result.body).toHaveLength(10)
	})

	it('should return movies by a list of query params', async () => {
		const result = await supertest(app)
			.get('/movies?id=133093,816692')
			.expect(200)

		expect(result.body).toHaveLength(2)

		expect(result.body).toEqual([
			{
				id: 133_093,
				title: 'The Matrix',
				year: 1999,
			},
			{
				id: 816_692,
				title: 'Interstellar',
				year: 2014,
			},
		])
	})

	// it('should return movies by a list of titles', async () => {
	//   const { body } = await supertest(app)
	//     .get('/movies?id=Interstellar')
	//     .expect(200)

	//   expect(body).toHaveLength(1)

	//   expect(body).toEqual([
	//     {
	//       id: 133093,
	//       title: 'The Matrix',
	//       year: 1999,
	//     },
	//     {
	//       id: 816692,
	//       title: 'Interstellar',
	//       year: 2014,
	//     },
	//   ])
	// })
})
