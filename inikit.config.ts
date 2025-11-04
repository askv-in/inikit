type FrameworkName = 'nextjs' | 'reactjs' | 'expressjs';
type ToolsName =
	| 'tailwindcss'
	| 'eslint'
	| 'prettier'
	| 'commitlint'
	| 'shadcn'
	| 'prisma'
	| 'authjs'
	| 'zod'
	| 'zustand';

type ToolConfig = {
	baseName: string;
	otherName?: string;
	description: string;
	label: string;
	hint: string;
	recommended: boolean;
	language: ('javascript' | 'typescript')[];
	dependencies: ToolsName[];
	frameworks: FrameworkName[];
};

export const toolsConfig: ToolConfig[] = [
	{
		baseName: 'tailwindcss',
		otherName: 'tailwind',
		description: 'A utility-first CSS framework for rapid UI development.',
		label: 'Tailwind CSS',
		hint: 'utility-first CSS',
		recommended: true,
		language: ['javascript', 'typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs'],
	},
	{
		baseName: 'eslint',
		otherName: 'lint',
		description: 'A pluggable linting utility for JavaScript and TypeScript.',
		label: 'ESLint',
		hint: 'pluggable linting',
		recommended: true,
		language: ['javascript', 'typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs', 'expressjs'],
	},
	{
		baseName: 'prettier',
		description: 'An opinionated code formatter for JavaScript and TypeScript.',
		label: 'Prettier',
		hint: 'opinionated code formatting',
		recommended: true,
		language: ['javascript', 'typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs', 'expressjs'],
	},
	{
		baseName: 'commitlint',
		description: 'A linter for commit messages.',
		label: 'Commitlint',
		hint: 'linter for commit messages',
		recommended: true,
		language: ['javascript', 'typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs', 'expressjs'],
	},
	{
		baseName: 'shadcn',
		description: 'A set of UI components for React.',
		recommended: false,
		label: 'Shadcn',
		hint: 'UI components for React',
		language: ['typescript'],
		dependencies: ['tailwindcss'],
		frameworks: ['reactjs', 'nextjs'],
	},
	{
		baseName: 'prisma',
		description: 'A next-generation ORM for Node.js and TypeScript.',
		recommended: false,
		label: 'Prisma',
		hint: 'next-generation ORM',
		language: ['typescript'],
		dependencies: [],
		frameworks: ['nextjs'],
	},
	{
		baseName: 'authjs',
		otherName: 'auth',
		description: 'A simple authentication library for JavaScript.',
		recommended: false,
		label: 'Auth.js',
		hint: 'authentication library (next-auth)',
		language: ['typescript'],
		dependencies: ['prisma'],
		frameworks: ['nextjs'],
	},
	{
		baseName: 'zod',
		description:
			'A TypeScript-first schema declaration and validation library.',
		recommended: false,
		label: 'Zod',
		hint: 'TypeScript-first schema validation',
		language: ['typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs'],
	},
	{
		baseName: 'zustand',
		description:
			'A small, fast and scalable bearbones state-management solution.',
		label: 'Zustand',
		hint: 'lightweight state management',
		recommended: false,
		language: ['typescript'],
		dependencies: [],
		frameworks: ['reactjs', 'nextjs'],
	},
];
