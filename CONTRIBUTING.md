# Contributing to Recall

Thank you for your interest in contributing to Recall! This guide outlines the process, standards, and expectations for all contributions to ensure consistency and quality across the codebase.

## 🚀 Getting Started

1. **Ensure you have the right environment:**
   - Node v24.x
   - Yarn v4.5.1+
   - Docker & Docker Compose
2. **Setup the project:** Follow the 'Getting Started' instructions in the [README.md](./README.md).
3. **Familiarize yourself with the architecture:** Understand the boundaries of `apps/` and `packages/`. Make changes in the most appropriate layer. Avoid coupling independent services.

## 🌿 Branching Strategy

We follow a structured branching model:

- `main`: The stable production-ready branch.
- `dev` or `develop`: The active development branch.
- **Feature Branches:** Create branches off `dev` for new features or fixes.
  - Format: `<type>/<issue-number>-<short-description>`
  - Types: `feature`, `fix`, `chore`, `refactor`, `docs`
  - Example: `feature/12-add-oauth-login`

## 💻 Coding Standards

We enforce strict coding standards to maintain uniformity:

- **Type Safety**: Zero Tolerance for `any` under any circumstances. Use precise types, generics, or `unknown` with type guards. Avoid `as` casting and non-null assertions (`!`). Code must prove its types through logical flow. Prefer explicit return types for exported functions.
- **Formatting**: We use Prettier. Before committing, ensure you run:
  ```bash
  yarn format
  ```
- **Linting**: We enforce strict linting rules. Ensure there are no warnings or errors by running:
  ```bash
  yarn lint:fix
  ```
- **Clean Architecture & Best Practices**:
  - Adhere to SOLID principles.
  - Apply the "Happy Path" approach and follow framework-specific best practices (Next.js App Router patterns, NestJS DI patterns).
  - Do not over-engineer features (YAGNI). Do not implement features or abstractions for hypothetical future needs.
  - Resolve Root Causes: Never provide "band-aid" fixes. Identify the fundamental cause of an issue and fix it at the source.
  - Performance Awareness: Minimize memory footprint and avoid unnecessary computations.

## 🏗 Monorepo Guidelines (Turborepo)

- If you add a new dependency used only by one app/package, add it to that specific `package.json`.
- If a dependency is shared widely, consider if it belongs in the root workspace or shared out via a `@repo/*` package.
- Always run `yarn build` at the root directory to verify there are no cyclical dependencies or build failures before pushing.

## 🧪 Testing

- We rely heavily on automated tests.
- Write unit tests for your logic changes.
- Ensure all tests pass:
  ```bash
  yarn test
  ```

## 📬 Pull Request Process

1. Provide a clear and descriptive title for your PR.
2. Ensure the PR is pointed against the `dev` branch.
3. Your code MUST pass the CI pipeline (Lint, Typecheck, Build, Test).
4. Request reviews from code maintainers. Resolve all discussions before merging.
5. Provide a summary of changes in the PR description, including how to verify the new feature or fix.
