# Contributing to Inikit

Thank you for your interest in contributing to Inikit! We welcome and encourage
contributions from the community. Whether you're fixing bugs, adding features,
improving documentation, or helping with issues, every contribution makes Inikit
better for everyone.

## Ways to Contribute

- 🐛 **Bug Reports**: Found a bug?
  [Open an issue](https://github.com/ajaykumarn3000/inikit/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: Have an idea?
  [Share it with us](https://github.com/ajaykumarn3000/inikit/issues/new?template=feature_request.md)
- 📝 **Documentation**: Help improve our documentation
- 🔧 **Code**: Submit pull requests with improvements or new features
- 🧪 **Testing**: Help test new features or report edge cases
- 💬 **Community**: Help answer questions and support other users

## Development Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Inikit.git
cd Inikit
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Create a new branch for your feature/fix
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests if applicable
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Check code formatting
npm run format:check

# Build the project
npm run build

# Test the CLI locally
npm link
inikit
```

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/). Please
follow this format:

```bash
# Good commit messages
git commit -m "feat: add support for Yarn package manager"
git commit -m "fix: resolve issue with TypeScript template generation"
git commit -m "docs: update README with new installation instructions"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request on GitHub
```

## Commit Convention

| Type       | Description              | Example                               |
| ---------- | ------------------------ | ------------------------------------- |
| `feat`     | New features             | `feat: add Vue.js framework support`  |
| `fix`      | Bug fixes                | `fix: resolve template copying issue` |
| `docs`     | Documentation changes    | `docs: add contribution guidelines`   |
| `style`    | Code style changes       | `style: fix indentation in utils.ts`  |
| `refactor` | Code refactoring         | `refactor: simplify CLI prompt logic` |
| `perf`     | Performance improvements | `perf: optimize template generation`  |
| `test`     | Adding or updating tests | `test: add unit tests for utils`      |
| `build`    | Build system changes     | `build: update TypeScript config`     |
| `ci`       | CI/CD changes            | `ci: add GitHub Actions workflow`     |
| `chore`    | Maintenance tasks        | `chore: update dependencies`          |

## Code Style Guidelines

- **Language**: Use TypeScript for all new code
- **Formatting**: Follow the existing Prettier configuration
- **Linting**: Ensure ESLint passes without errors
- **Comments**: Add JSDoc comments for public APIs
- **Naming**: Use descriptive variable and function names
- **Async/Await**: Prefer async/await over promises for readability

## Testing Guidelines

- Your changes shouldn't break existing functionality
- Test the CLI with different combinations of options
- Verify that generated projects build and run correctly
- Test on different operating systems if possible

## Documentation Guidelines

- Keep it clear and concise
- Include code examples where helpful
- Update the README if you add new features
- Use proper Markdown formatting
- Check for spelling and grammar

## Issue Reporting

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm version
- **Inikit Version**: Output of `inikit --version` or
  `npx inikit@latest --version`
- **Steps to Reproduce**: Clear, step-by-step instructions
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Error Messages**: Full error messages and stack traces
- **Additional Context**: Screenshots, logs, or other relevant information

## Feature Request Guidelines

When suggesting new features:

- **Use Case**: Explain why this feature would be valuable
- **Proposed Solution**: Describe how you envision it working
- **Alternatives**: Consider and mention alternative approaches
- **Implementation**: If you're willing to implement it, let us know!

<!-- ## Recognition

All contributors will be recognized in our README and release notes. We
appreciate every contribution, no matter how small! -->

## Getting Help

- **GitHub Discussions**: Ask questions about development
- **Issues**: Check existing issues for context
- **Code**: Review existing code to understand patterns
- **Community**: Join the conversation in issues and PRs
