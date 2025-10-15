import * as p from '@clack/prompts';
import { $ } from 'execa';
import { copyFileSync, existsSync, cpSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, 'templates');

export const validateProjectName = (input: string) => {
	if (input && input !== '.' && input !== './') {
		if (input.includes(' ')) return 'Project name cannot contain spaces';
		if (input.toLowerCase() !== input) return 'Project name must be lowercase';
		if (input.startsWith('./')) return 'Project name cannot start with "./"';
		if (/[^a-zA-Z0-9-_]/.test(input))
			return 'Project name can only contain letters, numbers, dashes, and underscores';
	}
};

export const titleCase = (str: string) => {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const runTaskAnimation = async (
	startMessage: string,
	stopMessage: string,
	callback: () => Promise<void>
) => {
	const nextSpinner = p.spinner();
	nextSpinner.start(startMessage);
	await callback();
	nextSpinner.stop(stopMessage);
};

export const createNextApp = async (
	appName: string,
	typeScript: boolean,
	tailwind: boolean = true
) => {
	await $({
		cwd: process.cwd(),
	})`npm install -g create-next-app@latest`;

	await $({
		cwd: process.cwd(),
	})`npx create-next-app ${appName} ${
		typeScript ? '--ts' : '--js'
	} ${tailwind ? '--tailwind' : '--no-tailwind'} --eslint --app --turbopack --use-npm --yes --disable-git`;
};

export const createReactApp = async (appName: string, typeScript: boolean) => {
	await $({
		cwd: process.cwd(),
	})`
		npm install -g create-vite@latest
		`;
	await $({
		cwd: process.cwd(),
	})`npx create-vite ${appName} --- --template ${
		typeScript ? 'react-ts' : 'react'
	}`;

	await $({
		cwd: path.resolve(process.cwd(), appName),
	})`npm install`;
};

export const addTailwind = async (appPath: string, typeScript: boolean) => {
	await $({
		cwd: appPath,
	})`npm install tailwindcss @tailwindcss/vite`;

	copyFileSync(
		path.join(
			templateDir,
			'tailwind',
			`vite.config.${typeScript ? 'ts' : 'js'}`
		),
		path.resolve(appPath, `vite.config.${typeScript ? 'ts' : 'js'}`)
	);

	copyFileSync(
		path.join(templateDir, 'tailwind', 'index.css'),
		path.resolve(appPath, 'src', 'index.css')
	);
};

export const addPrettier = async (appPath: string) => {
	await $({
		cwd: appPath,
	})`npm install -D prettier prettier-plugin-tailwindcss`;

	cpSync(path.join(templateDir, 'prettier'), path.resolve(appPath), {
		force: true,
		recursive: true,
	});
};

export const addGit = async (appPath: string) => {
	if (existsSync(path.resolve(appPath, '.git'))) {
		// return 'Git already initialized';
		return;
	}

	await $({
		cwd: appPath,
	})`git init`;
};

export const addCommitlint = async (appPath: string) => {
	await $({
		cwd: appPath,
	})`npm install -D husky @commitlint/config-conventional @commitlint/cli`;

	await $({
		cwd: appPath,
	})`npx husky init`;

	cpSync(path.join(templateDir, 'husky'), path.resolve(appPath, '.husky'), {
		force: true,
		recursive: true,
	});

	copyFileSync(
		path.join(templateDir, 'commitlint', 'commitlint.config.cjs'),
		path.resolve(appPath, 'commitlint.config.cjs')
	);

	await $({
		cwd: appPath,
	})`npm run prepare`;
};

export const addShadcnConfigForVite = (appPath: string) => {
	cpSync(path.join(templateDir, 'shadcn-vite'), path.resolve(appPath), {
		force: true,
		recursive: true,
	});
};

export const addShadcnUi = async (appPath: string) => {
	await $({
		cwd: appPath,
	})`npm install -g shadcn@latest`;
	await $({
		cwd: appPath,
	})`npx shadcn init -d -y -s`;
};

export const addPrisma = async (appPath: string) => {
	await $({
		cwd: appPath,
	})`npm install -D prisma`;
	await $({
		cwd: appPath,
	})`npm install @prisma/client dotenv`;

	cpSync(path.join(templateDir, 'prisma'), path.resolve(appPath), {
		force: true,
		recursive: true,
	});
};

export const createExpressApp = async (
	appPath: string,
	typeScript: boolean
) => {
	if (typeScript) {
		const templatePath = path.join(templateDir, 'express-ts');
		await $({ cwd: templatePath })`npm install`;
		cpSync(templatePath, path.resolve(appPath), {
			force: true,
			recursive: true,
		});
	}
};
