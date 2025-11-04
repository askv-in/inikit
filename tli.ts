import * as p from '@clack/prompts';
import { chalkStderr } from 'chalk';
import { validateProjectName } from './utils.js';
import { toolsConfig } from './inikit.config.js';
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
			{ value: 'nextjs', label: 'Next.js', hint: 'using create-next-app' },
			{ value: 'reactjs', label: 'React', hint: 'using vite' },
			{ value: 'expressjs', label: 'Express', hint: 'Express.js template' },
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
	framework: 'nextjs' | 'reactjs' | 'expressjs',
	typescript: boolean
) {
	const devTools = await p.multiselect({
		message: `Select ${cyan('dev tools')} to configure`,
		options: toolsConfig
			.filter(
				tool =>
					tool.language.includes(typescript ? 'typescript' : 'javascript') &&
					tool.frameworks.includes(framework)
			)
			.map(tool => ({
				value: tool.baseName,
				label: tool.label,
				hint: tool.hint,
			})),
		initialValues: toolsConfig
			.filter(tool => tool.recommended)
			.map(tool => tool.baseName),
	});

	if (p.isCancel(devTools)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return new Set(devTools);
}
