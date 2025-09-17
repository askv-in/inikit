import { defineConfig } from 'prisma/config';

export default defineConfig({
	experimental: {
		adapter: true,
		externalTables: true,
		studio: true,
	},
	schema: './prisma',
});
