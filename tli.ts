import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
const { cyan } = chalkStderr;

export async function getProjectName() {
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
	return projectName;
}

export async function getFramework() {
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
	return framework;
}

export async function getTypeScript() {
	const typeScript = await p.confirm({
		message: `Do you want to use ${cyan('TypeScript?')}`,
		initialValue: true, // Yes
	});

	if (p.isCancel(typeScript)) {
		p.cancel('Operation cancelled.');
		return process.exit(0);
	}
	return typeScript;
}

export async function getDevtools() {
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
	return devTools;
}
