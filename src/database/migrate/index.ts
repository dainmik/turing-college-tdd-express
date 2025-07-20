import 'dotenv/config'
import { type Kysely, type MigrationProvider, Migrator } from 'kysely'

export async function migrateToLatest<T>(
	provider: MigrationProvider,
	db: Kysely<T>
) {
	const migrator = new Migrator({
		db,
		provider,
	})

	return migrator.migrateToLatest()
}
