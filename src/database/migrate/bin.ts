#!/usr/bin/env -S pnpm tsx

import SQLite, { type Database } from 'better-sqlite3'
import 'dotenv/config'
import { FileMigrationProvider, Kysely, SqliteDialect } from 'kysely'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrateToLatest } from '.'

const MIGRATIONS_PATH = '../migrations'

async function migrateDefault(url: string) {
	const db = new Kysely<Database>({
		dialect: new SqliteDialect({
			database: new SQLite(url),
		}),
	})

	const dirname = path.dirname(fileURLToPath(import.meta.url))

	const nodeProvider = new FileMigrationProvider({
		fs,
		path,
		migrationFolder: path.join(dirname, MIGRATIONS_PATH),
	})

	const { results, error } = await migrateToLatest(nodeProvider, db)

	if (!results?.length) {
		console.log('No migrations to run.')
	}

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`Migration "${it.migrationName}" was executed successfully.`)
		} else if (it.status === 'Error') {
			console.error(`Failed to execute migration "${it.migrationName}".`)
		}
	})

	if (error) {
		console.error('Failed to migrate.')
		console.error(error)
		process.exit(1)
	}

	await db.destroy()
}

const isRunDirectly = path
	.resolve(fileURLToPath(import.meta.url))
	.includes(path.resolve(process.argv[1]))

if (isRunDirectly) {
	const { DATABASE_URL } = process.env

	if (typeof DATABASE_URL !== 'string') {
		throw new TypeError('Provide DATABASE_URL in your environment variables.')
	}

	await migrateDefault(DATABASE_URL)
}
