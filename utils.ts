import { $ } from 'execa';
import { copyFileSync, existsSync, cpSync } from 'node:fs';
import path from 'node:path';

export const titleCase = (str: string) => {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const createNextApp = async (
	appName: string,
	typeScript: boolean,
	eslint: boolean
) => {
	const { stdout } = await $({
		cwd: process.cwd(),
	})`npx create-next-app@latest ${appName} ${
		typeScript ? '--ts' : '--js'
	} ${eslint ? '--eslint' : ''} --app --turbopack --use-npm --yes --disable-git`;

	return stdout;
};

export const addPrettier = async (appPath: string) => {
	await $({
		cwd: appPath,
	})`npm install -D prettier prettier-plugin-tailwindcss`;

	cpSync(path.resolve('templates', 'prettier'), path.resolve(appPath), {
		force: true,
		recursive: true,
	});
};

export const addGit = async (appPath: string) => {
	if (existsSync(path.resolve(appPath, '.git'))) {
		return 'Git already initialized';
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

	cpSync(path.resolve('templates', 'husky'), path.resolve(appPath, '.husky'), {
		force: true,
		recursive: true,
	});

	copyFileSync(
		path.resolve('templates', 'commitlint', 'commitlint.config.js'),
		path.resolve(appPath, 'commitlint.config.js')
	);

	await $({
		cwd: appPath,
	})`npm run prepare`;
};
