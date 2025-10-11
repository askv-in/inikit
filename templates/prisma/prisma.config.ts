import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
	schema: path.resolve('prisma'),
	migrations: {
		path: path.join('prisma', 'migrations'),
	},
});
