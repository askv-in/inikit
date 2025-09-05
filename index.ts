#!/usr/bin/env node

import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import {
	addCommitlint,
	addGit,
	addPrettier,
	createNextApp,
	createReactApp,
	addTailwind,
	titleCase,
	runTaskAnimation,
	validateProjectName,
} from './utils.js';
import path from 'node:path';
import packageJSON from './package.json' with { type: 'json' };
import {
	getDevtools,
	getFramework,
	getProjectName,
	getTypeScript,
} from './tli.js';
import { Command } from 'commander';

const { green, yellow } = chalkStderr;

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

async function main() {
	const program = new Command(packageJSON.name)
		.version(
			packageJSON.version,
			'-v, --version',
			'Output the current version of Inikit.'
		)
		.argument('[directory]')
		.usage('[directory] [options]')
		.helpOption('-h, --help', 'Display this help message.')
		.option('--next, --nextjs', 'Initialize as a Next.js project.')
		.option('--react, --reactjs', 'Initialize as a React project.')
		.option(
			'--ts, --typescript',
			'Initialize as a TypeScript project. (default)'
		)
		.option('--js, --javascript', 'Initialize as a JavaScript project.')
		.option(
			'--tailwind, --tailwindcss',
			'Initialize with Tailwind CSS config. (default)'
		)
		.option('--eslint', 'Initialize with ESLint config. (default)')
		.option('--prettier', 'Initialize with Prettier config. (default)')
		.option(
			'--commitlint',
			'Initialize with Commitlint + Husky config. (default)'
		)
		.option('--no-git', 'Skip git initialization.')
		.option('--tools', 'Use recommended dev tools. (default)')
		.option(`--no-tools`, 'Skip all dev tools setup.')
		.allowUnknownOption()
		.parse(process.argv);

	const opts = program.opts(); // Get options
	const { args } = program; // Get positional arguments (ProjectName)

	if (opts.typescript && opts.javascript) {
		p.log.error(
			'Cannot use both --typescript and --javascript flags together.'
		);
		process.exit(1);
	}
	if (opts.nextjs && opts.reactjs) {
		p.log.error('Cannot use both --nextjs and --reactjs flags together.');
		process.exit(1);
	}

	p.log.info(
		`Welcome to ${green(titleCase(packageJSON.name) + ' v' + packageJSON.version)}`
	);

	const projectNameError = validateProjectName(args[0] ?? 'my-app');
	if (typeof projectNameError === 'string') {
		p.log.error(projectNameError);
		process.exit(1);
	}

	const projectName = args[0] ?? (await getProjectName());

	const framework = opts.nextjs
		? 'next'
		: opts.reactjs
			? 'react'
			: await getFramework();

	const typeScript = opts.typescript
		? true
		: opts.javascript
			? false
			: await getTypeScript();

	let devTools: Set<string> = new Set<string>();
	if (opts.tools === true) {
		devTools.add('tailwind');
		devTools.add('prettier');
		devTools.add('commitlint');
	} else if (opts.tailwindcss || opts.prettier || opts.commitlint) {
		if (opts.tailwindcss) devTools.add('tailwind');
		if (opts.prettier) devTools.add('prettier');
		if (opts.commitlint) devTools.add('commitlint');
	} else if (opts.tools === false) {
		// No dev tools
	} else {
		devTools = await getDevtools();
	}

	const projectPath = path.resolve(process.cwd(), projectName);

	if (framework === 'next') {
		await runTaskAnimation(
			`Creating a new Next.js app in ${yellow(projectPath)}`,
			`Created ${projectName} at ${projectPath}`,
			() => createNextApp(projectName, typeScript, devTools.has('tailwind'))
		);
	} else if (framework === 'react') {
		await runTaskAnimation(
			`Creating a new React app in ${yellow(projectPath)}`,
			`Created ${projectName} at ${projectPath}`,
			() => createReactApp(projectName, typeScript)
		);
		if (devTools.has('tailwind')) {
			await runTaskAnimation(
				`Adding Tailwind CSS to the project`,
				`Added Tailwind CSS configuration`,
				() => addTailwind(projectPath, typeScript)
			);
		}
	}

	if (devTools.has('prettier')) {
		await runTaskAnimation(
			`Adding prettier to the project`,
			`Added prettier configuration`,
			() => addPrettier(projectPath)
		);
	}

	if (devTools.has('commitlint')) {
		await runTaskAnimation(
			`Adding husky and commitlint to the project`,
			`Added husky and commitlint configuration`,
			() => addCommitlint(projectPath)
		);
	}

	if (opts.git !== false) {
		await runTaskAnimation(
			`Initializing git repository`,
			`Initialized git repository`,
			() => addGit(projectPath)
		);
	}

	p.outro(green(`Project initialized successfully! Happy coding!`));
	process.exit(0);
}

main().catch(err => {
	console.error(err);
	p.outro('An error occurred: ' + err.message);
	process.exit(1);
});
