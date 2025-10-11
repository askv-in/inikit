import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import { validateProjectName } from './utils.js';
const { cyan } = chalkStderr;

export async function getProjectName() {
	const projectName = await p.text({
		message: `Enter the ${cyan('project name')}`,
		placeholder: 'my-app',
		defaultValue: 'my-app',
		validate: validateProjectName,
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
			{ value: 'express', label: 'Express', hint: 'Express.js template' },
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

export async function getDevtools(
	framework: 'next' | 'react',
	typescript: boolean
) {
	const devTools = await p.multiselect({
		message: `Select ${cyan('dev tools')}`,
		options: typescript
			? framework === 'next'
				? [
						{ value: 'tailwind', label: 'Tailwind CSS' },
						{ value: 'prettier', label: 'Prettier' },
						{ value: 'commitlint', label: 'Husky', hint: 'commitlint + husky' },
						{ value: 'shadcn', label: 'Shadcn UI' },
						{ value: 'prisma', label: 'Prisma ORM' },
					]
				: [
						{ value: 'tailwind', label: 'Tailwind CSS' },
						{ value: 'prettier', label: 'Prettier' },
						{ value: 'commitlint', label: 'Husky', hint: 'commitlint + husky' },
						{ value: 'shadcn', label: 'Shadcn UI' },
					]
			: [
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
	return new Set(devTools);
}
