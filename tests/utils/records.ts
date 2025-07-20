import { DB } from '@/database'
import type { ExpressionOrFactory, Insertable, Kysely, SqlBool } from 'kysely'

/**
 * Given a database instance and a table name, returns a function
 * that inserts records into that table.
 * @param db Kysely database instance
 * @param tableName Name of the table
 */
export const createFor =
	<N extends keyof DB>(db: Kysely<DB>, tableName: N) =>
	(records: Insertable<DB[N]> | Insertable<DB[N]>[]) =>
		db.insertInto(tableName).values(records).returningAll().execute()

/**
 * Given a database instance and a table name, returns a function
 * that selects all records from that table.
 * @param db Kysely database instance
 * @param tableName Name of the table
 */
export const createSelectAllFor =
	<N extends keyof DB>(db: Kysely<DB>, tableName: N) =>
	(expression?: ExpressionOrFactory<DB, N, SqlBool>): Promise<DB[N][]> => {
		const query = db.selectFrom(tableName).selectAll()

		// shortcut which works as long as there are no table aliases
		if (!expression) {
			return query.execute() as Promise<DB[N][]>
		}

		// TypeScript infers N as a union of types with different
		// signatures and it can't map N to the correct overload.
		// But we know that `tableName` is a valid key of DB.
		//
		// @ts-expect-error See above comment
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		return query.where(expression).execute() as Promise<DB[N][]>
	}
