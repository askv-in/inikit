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
} from './utils.js';
import path from 'node:path';
import packageJSON from './package.json' with { type: 'json' };
import {
	getDevtools,
	getFramework,
	getProjectName,
	getTypeScript,
} from './tli.js';

const { green, yellow } = chalkStderr;

p.log.info(
	`Welcome to ${green(titleCase(packageJSON.name) + ' v' + packageJSON.version)}`
);

async function main() {
	const projectName = await getProjectName();
	const framework = await getFramework();
	const typeScript = await getTypeScript();
	const devTools = await getDevtools();

	const projectPath = path.resolve(process.cwd(), projectName);

	if (framework === 'next') {
		await runTaskAnimation(
			`Creating a new Next.js app in ${yellow(projectPath)}`,
			`Created ${projectName} at ${projectPath}`,
			() =>
				createNextApp(projectName, typeScript, devTools.includes('tailwind'))
		);
	} else if (framework === 'react') {
		await runTaskAnimation(
			`Creating a new React app in ${yellow(projectPath)}`,
			`Created ${projectName} at ${projectPath}`,
			() => createReactApp(projectName, typeScript)
		);
		if (devTools.includes('tailwind')) {
			await runTaskAnimation(
				`Adding Tailwind CSS to the project`,
				`Added Tailwind CSS configuration`,
				() => addTailwind(projectPath, typeScript)
			);
		}
	}

	if (devTools.includes('prettier')) {
		await runTaskAnimation(
			`Adding prettier to the project`,
			`Added prettier configuration`,
			() => addPrettier(projectPath)
		);
	}

	if (devTools.includes('commitlint')) {
		await runTaskAnimation(
			`Adding husky and commitlint to the project`,
			`Added husky and commitlint configuration`,
			() => addCommitlint(projectPath)
		);
	}

	await runTaskAnimation(
		`Initializing git repository`,
		`Initialized git repository`,
		() => addGit(projectPath)
	);

	p.outro(green(`Project initialized successfully! Happy coding!`));
	process.exit(0);
}

main().catch(err => {
	console.error(err);
	p.outro('An error occurred: ' + err.message);
	process.exit(1);
});
