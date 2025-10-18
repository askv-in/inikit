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
	addShadcnConfigForVite,
	addShadcnUi,
	addPrisma,
	addZustand,
	createExpressApp,
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
		.option('--express', 'Initialize as an Express.js project.')
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
		.option(
			'--shadcn',
			'Initialize with Shadcn UI config. (typescript required).'
		)
		.option(
			'--prisma',
			'Initialize with Prisma ORM config. (nextjs only, typescript required).'
		)
		.option('--zustand', 'Initialize with Zustand state management.')
		.option('--no-git', 'Skip git initialization.')
		.option('--tools', 'Use recommended dev tools.')
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

	if (
		(opts.nextjs && opts.reactjs) ||
		(opts.nextjs && opts.express) ||
		(opts.reactjs && opts.express)
	) {
		p.log.error(
			'Please select only one framework: --nextjs, --reactjs, or --express.'
		);
		process.exit(1);
	}

	if (opts.shadcn && !opts.typescript) {
		p.log.error(`--shadcn requires --typescript to be set.`);
		process.exit(1);
	}

	if (opts.prisma && (!opts.nextjs || !opts.typescript)) {
		p.log.error(`--prisma requires both --nextjs and --typescript to be set.`);
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
			: opts.express
				? 'express'
				: await getFramework();

	const projectPath = path.resolve(process.cwd(), projectName);

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
		if (opts.shadcn) {
			devTools.add('shadcn');
		}
		if (opts.prisma) {
			devTools.add('prisma');
		}
	} else if (
		opts.tailwindcss ||
		opts.prettier ||
		opts.commitlint ||
		opts.shadcn ||
		opts.prisma ||
		opts.zustand
	) {
		if (opts.tailwindcss) devTools.add('tailwind');
		if (opts.prettier) devTools.add('prettier');
		if (opts.commitlint) devTools.add('commitlint');
		if (opts.shadcn) {
			devTools.add('shadcn');
			devTools.add('tailwind');
		}
		if (opts.prisma) devTools.add('prisma');
		if (opts.zustand) devTools.add('zustand');
	} else if (opts.tools === false) {
		// No dev tools
	} else {
		devTools = await getDevtools(framework, typeScript);
		if (devTools.has('shadcn')) devTools.add('tailwind');
	}

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
	} else if (framework === 'express') {
		await runTaskAnimation(
			`Creating a new Express TypeScript app in ${yellow(projectPath)}`,
			`Created Express TypeScript app at ${projectPath}`,
			() => createExpressApp(projectPath, typeScript)
		);
	}

	if (framework === 'react' || framework === 'next') {
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

		if (typeScript && devTools.has('shadcn')) {
			await runTaskAnimation(
				`Adding shadcn UI to the project`,
				`Added shadcn UI configuration`,
				async () => {
					if (framework === 'react') {
						addShadcnConfigForVite(projectPath);
					}
					await addShadcnUi(projectPath);
				}
			);
		}

		if (typeScript && devTools.has('prisma')) {
			await runTaskAnimation(
				`Adding Prisma ORM to the project`,
				`Added Prisma ORM configuration`,
				() => addPrisma(projectPath)
			);
		}
	}

	if (devTools.has('zustand')) {
		await runTaskAnimation(
			`Adding Zustand state management`,
			`Added Zustand configuration`,
			() => addZustand(projectPath, typeScript)
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
