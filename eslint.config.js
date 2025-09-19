import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	tseslint.configs.recommended,
	{
		files: ['**/*.md'],
		plugins: { markdown },
		language: 'markdown/gfm',
		extends: ['markdown/recommended'],
	},
	{
		ignores: [
			'**/package-lock.json',
			'**/dist/**',
			'**/node_modules/**',
			'**/coverage/**',
			'**/.next/**',
			'**/.nuxt/**',
			'**/.vercel/**',
			'**/.output/**',
			'**/.cache/**',
			'**/build/**',
			'**/out/**',
			'**/public/**',
			'**/templates/**',
		],
	},
]);
