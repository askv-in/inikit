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
	addZod,
	addAuthJs,
} from './utils.js';
import path from 'node:path';
import packageJSON from './package.json' with { type: 'json' };
import {
	getDevtools,
	getFramework,
	getProjectName,
	getTypeScript,
} from './tli.js';
import { toolsConfig } from './inikit.config.js';
import { Command, Option } from 'commander';

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
		.addOption(
			new Option(
				'--next, --nextjs',
				'Initialize as a Next.js project.'
			).conflicts(['reactjs', 'expressjs'])
		)
		.addOption(
			new Option(
				'--react, --reactjs',
				'Initialize as a React project.'
			).conflicts(['nextjs', 'expressjs'])
		)
		.addOption(
			new Option(
				'--express, --expressjs',
				'Initialize as an Express.js project.'
			).conflicts(['nextjs', 'reactjs'])
		)
		.addOption(
			new Option(
				'--ts, --typescript',
				'Initialize as a TypeScript project. (default)'
			).conflicts('javascript')
		)
		.addOption(
			new Option(
				'--js, --javascript',
				'Initialize as a JavaScript project.'
			).conflicts('typescript')
		);

	for (const tool of toolsConfig) {
		program.addOption(
			new Option(
				`${tool.otherName ? `--${tool.otherName}, ` : ''}--${tool.baseName}`,
				`${tool.description}`
			)
		);
	}

	program
		.addOption(new Option('--no-git', 'Skip git initialization.'))
		.addOption(new Option('--tools', 'Use recommended dev tools.'))
		.addOption(new Option(`--no-tools`, 'Skip all dev tools setup.'))
		.allowUnknownOption()
		.parse(process.argv);

	const opts = program.opts(); // Get options
	const { args } = program; // Get positional arguments (ProjectName)

	const language = opts.typescript
		? 'typescript'
		: opts.javascript
			? 'javascript'
			: null;
	const frameworkOpt = opts.nextjs
		? 'nextjs'
		: opts.reactjs
			? 'reactjs'
			: opts.expressjs
				? 'expressjs'
				: null;

	for (const tool of toolsConfig) {
		if (opts[tool.baseName]) {
			if (language ? !tool.language.includes(language) : true) {
				p.log.error(
					`--${tool.baseName} requires --${tool.language.join(' or --')} to be set.`
				);
				process.exit(1);
			}
			if (frameworkOpt ? !tool.frameworks.includes(frameworkOpt) : true) {
				p.log.error(
					`--${tool.baseName} requires --${tool.frameworks.join(' or --')} to be set.`
				);
				process.exit(1);
			}
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
			? 'nextjs'
			: opts.reactjs
				? 'reactjs'
				: opts.expressjs
					? 'expressjs'
					: await getFramework();

		const projectPath = path.resolve(process.cwd(), projectName);

		const typeScript =
			opts.typescript || framework === 'expressjs' // !TODO: remove this when JS support is added for express
				? true
				: opts.javascript
					? false
					: await getTypeScript();

		let devTools: Set<string> = new Set<string>();

		if (
			toolsConfig.reduce(
				(acc, tool) => acc && !opts[tool.baseName],
				!opts.tools
			)
		) {
			devTools = await getDevtools(framework, typeScript);
		} else {
			toolsConfig.forEach(tool => {
				if (opts[tool.baseName]) {
					devTools.add(tool.baseName);
					if (tool.dependencies) {
						tool.dependencies.forEach(dep => devTools.add(dep));
					}
				}
			});
		}

		switch (framework) {
			case 'nextjs':
				await runTaskAnimation(
					`Creating a new Next.js app in ${yellow(projectPath)}`,
					`Created ${projectName} at ${projectPath}`,
					() =>
						createNextApp(projectName, typeScript, devTools.has('tailwindcss'))
				);
				break;
			case 'reactjs':
				await runTaskAnimation(
					`Creating a new React app in ${yellow(projectPath)}`,
					`Created ${projectName} at ${projectPath}`,
					() => createReactApp(projectName, typeScript)
				);
				if (devTools.has('tailwindcss')) {
					await runTaskAnimation(
						`Adding Tailwind CSS to the project`,
						`Added Tailwind CSS configuration`,
						() => addTailwind(projectPath, typeScript)
					);
				}
				break;
			case 'expressjs':
				await runTaskAnimation(
					`Creating a new Express TypeScript app in ${yellow(projectPath)}`,
					`Created Express TypeScript app at ${projectPath}`,
					() => createExpressApp(projectPath, typeScript)
				);
				break;
			default:
				p.log.error('Invalid framework selected.');
				process.exit(1);
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

		if (devTools.has('shadcn')) {
			await runTaskAnimation(
				`Adding shadcn UI to the project`,
				`Added shadcn UI configuration`,
				async () => {
					if (framework === 'reactjs') {
						addShadcnConfigForVite(projectPath);
					}
					await addShadcnUi(projectPath);
				}
			);
		}

		if (devTools.has('prisma')) {
			await runTaskAnimation(
				`Adding Prisma ORM to the project`,
				`Added Prisma ORM configuration`,
				() => addPrisma(projectPath)
			);
		}
		if (devTools.has('authjs')) {
			await runTaskAnimation(
				`Adding Auth.js to the project`,
				`Added Auth.js configuration`,
				() => addAuthJs(projectPath)
			);
		}

		if (devTools.has('zustand')) {
			await runTaskAnimation(
				`Adding Zustand state management`,
				`Added Zustand configuration`,
				() => addZustand(projectPath, typeScript)
			);
		}

		if (devTools.has('zod')) {
			await runTaskAnimation(
				`Adding Zod validation library`,
				`Added Zod configuration`,
				() => addZod(projectPath)
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
}

main().catch(err => {
	console.error(err);
	p.outro('An error occurred: ' + err.message);
	process.exit(1);
});
