import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import checkFile from 'eslint-plugin-check-file'
import { flatConfigs } from 'eslint-plugin-import-x'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import tsEslint, { configs } from 'typescript-eslint'

// Default export is required by eslint
// eslint-disable-next-line import-x/no-default-export
export default tsEslint.config([
	includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),

	{
		// https://typescript-eslint.io/packages/parser#configuration
		name: 'General TypeScript',
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			configs.strictTypeChecked,
			configs.stylisticTypeChecked,
		],
		languageOptions: {
			// https://typescript-eslint.io/getting-started/typed-linting
			parserOptions: {
				projectService: true,
				tsconfigRootDir: '.',
			},
		},
		rules: {
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					// We allow for number and boolean to avoid having to call String constructor or toString method inside template literals because their string representations are reasonably well defined and generally purposeful, unlike other types such as object, undefined, null.
					allowNumber: true,
					allowBoolean: true,
				},
			],
		},
	},
	{
		name: 'General JavaScript',
		files: ['**/*.ts'],
		extends: [
			// https://github.com/sindresorhus/eslint-plugin-unicorn
			eslintPluginUnicorn.configs.recommended,
		],
		rules: {
			/*
			 * Null is semantically different from undefined. Null means 'explicitly set to no value' while undefined means 'the value is implicitly absent'.
			 * https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
			 */
			'unicorn/no-null': 'off',

			/*
			 * Sometimes forEach results in better readability.
			 * https://github.com/sindresorhuzs/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md
			 */
			'unicorn/no-array-for-each': 'off',

			/**
			 * if-else is often more readable in multiline statements.
			 * https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-ternary.md
			 */
			'unicorn/prefer-ternary': ['error', 'only-single-line'],

			/*
			 * The rule does not account for arbitrary abbreviations, and generally very common abbreviations such as 'utils -> utilities', 'e -> event', are generally not confusing among developers.
			 * https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
			 */
			'unicorn/prevent-abbreviations': 'off',
		},
	},
	{
		name: 'Import Export',
		files: ['**/*.ts'],
		extends: [flatConfigs.recommended, flatConfigs.typescript],
		rules: {
			/**
			 * Using default exports encourages naming the imported symbol differently in different files,
			 * making it harder to track symbol usage.
			 *
			 * If the default import is named differently than the exported symbol, some editors (like VS Code)
			 * will not update the import name when renaming the symbol in the source module.
			 * To propagate renames, the symbol must be imported with the same name as its source, which defeats
			 * much of the purpose of default exports.
			 *
			 * The other purpose of default imports is importing with a different name to avoid name clashes.
			 * This is easily solved with named import aliases.
			 */
			'import-x/no-default-export': 'error',

			// https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-mutable-exports.md
			'import-x/no-mutable-exports': 'error',

			/*
			 * TypeScript’s compiler already ensures imports resolve correctly.
			 * https://github.com/un-ts/eslint-plugin-import-x/blob/v4.15.1/docs/rules/no-unresolved.md
			 */
			'import-x/no-unresolved': 'off',
		},
	},
	{
		name: 'File',
		files: ['**/*.ts'],
		plugins: {
			'check-file': checkFile,
		},
		rules: {
			'check-file/filename-naming-convention': [
				'error',
				{
					'**/!(migrations)/*.ts': 'KEBAB_CASE',
					'**/migrations/*.ts': '+([0-9])-[a-z-]*',
				},
				{
					// Ignore the middle extensions of the filename to support filename like prettier.config.js or my.test.ts
					ignoreMiddleExtensions: true,
				},
			],
			'check-file/folder-naming-convention': [
				'error',
				{
					'**/!(__tests__)': 'KEBAB_CASE',
				},
			],
		},
	},
	eslintConfigPrettier,
])
