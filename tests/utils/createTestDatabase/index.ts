import { type DB } from '@/database'
import { migrateToLatest } from '@/database/migrate'
import SQLite from 'better-sqlite3'
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely'
import { ModuleMigrationProvider } from './module-migration-provider'

const DATABASE_FILE = ':memory:'

export const createTestDatabase = async () => {
	const provider = new ModuleMigrationProvider()

	const database = new Kysely<DB>({
		dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE) }),
		plugins: [new CamelCasePlugin()],
	})

	const { results, error } = await migrateToLatest(provider, database)

	results
		?.filter((result) => result.status === 'Error')
		.forEach((result) => {
			console.error(`failed to execute migration "${result.migrationName}"`)
		})

	if (error) {
		console.error('failed to migrate')
		console.error(error)
	}

	return database
}
