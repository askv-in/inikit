#!/usr/bin/env node

import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import {
	titleCase,
	addCommitlint,
	addGit,
	addPrettier,
	createNextApp,
	createReactApp,
	addTailwind,
} from './utils.js';
import path from 'node:path';
import packageJSON from './package.json' with { type: 'json' };

const { cyan, green, yellow } = chalkStderr;

p.log.info(
	`Welcome to ${green(titleCase(packageJSON.name) + ' v' + packageJSON.version)}}`
);

async function getUserInput() {
	const projectName = await p.text({
		message: `Enter the ${cyan('project name')}`,
		placeholder: 'my-app',
		defaultValue: 'my-app',
		validate(input: string) {
			if (input && input !== '.' && input !== './') {
				if (input.includes(' ')) return 'Project name cannot contain spaces';
				if (input.toLowerCase() !== input)
					return 'Project name must be lowercase';
				if (input.startsWith('./'))
					return 'Project name cannot start with "./"';
				if (/[^a-zA-Z0-9-_]/.test(input))
					return 'Project name can only contain letters, numbers, dashes, and underscores';
			}
		},
	});

	if (p.isCancel(projectName)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	const framework = await p.select({
		message: `Select a ${cyan('framework')}`,
		options: [
			{ value: 'next', label: 'Next.js', hint: 'using create-next-app' },
			{ value: 'react', label: 'React', hint: 'using vite' },
		],
	});

	if (p.isCancel(framework)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	const typeScript = await p.confirm({
		message: `Do you want to use ${cyan('TypeScript?')}`,
		initialValue: true, // Yes
	});

	if (p.isCancel(typeScript)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	const devTools = await p.multiselect({
		message: `Select ${cyan('dev tools')}`,
		options: [
			{ value: 'tailwind', label: 'Tailwind CSS' },
			{ value: 'prettier', label: 'Prettier' },
			{ value: 'commitlint', label: 'Husky', hint: 'commitlint + husky' },
		],
		initialValues: ['tailwind', 'prettier', 'commitlint'],
		required: false,
	});

	if (p.isCancel(devTools)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}

	return { projectName, framework, typeScript, devTools };
}

getUserInput()
	.then(async res => {
		const { projectName, framework, typeScript, devTools } = res;

		const projectPath = path.resolve(process.cwd(), projectName);

		if (framework === 'next') {
			const nextSpinner = p.spinner();
			nextSpinner.start(`Creating a new Next.js app in ${yellow(projectPath)}`);
			await createNextApp(
				projectName,
				typeScript,
				devTools.includes('tailwind')
			);
			nextSpinner.stop(`Created ${projectName} at ${projectPath}`);
		} else if (framework === 'react') {
			const reactSpinner = p.spinner();
			reactSpinner.start(`Creating a new React app in ${yellow(projectPath)}`);
			await createReactApp(projectName, typeScript);
			reactSpinner.stop(`Created ${projectName} at ${projectPath}`);

			if (devTools.includes('tailwind')) {
				const tailwindSpinner = p.spinner();
				tailwindSpinner.start(`Adding Tailwind CSS to the project`);
				await addTailwind(projectPath, typeScript);
				tailwindSpinner.stop(`Added Tailwind CSS configuration`);
			}
		}

		if (devTools.includes('prettier')) {
			const prettierSpinner = p.spinner();
			prettierSpinner.start(`Adding prettier to the project`);
			await addPrettier(projectPath);
			prettierSpinner.stop(`Added prettier configuration`);
		}

		await addGit(projectPath);

		if (devTools.includes('commitlint')) {
			const commitlintSpinner = p.spinner();
			commitlintSpinner.start(`Adding husky and commitlint to the project`);
			await addCommitlint(projectPath);
			commitlintSpinner.stop(`Added husky and commitlint configuration`);
		}

		p.outro(green('Project initialized successfully!'));
		process.exit(0);
	})
	.catch(err => {
		console.error(err);
		p.outro('An error occurred: ' + err.message);
		process.exit(1);
	});
