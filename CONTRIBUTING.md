# Contributing to Gittastic

Thanks for your interest in contributing! This guide covers the workflow and the architecture rules the codebase follows.

## Getting set up

Follow the [Getting started](README.md#getting-started) section of the README.

## Workflow

1. For anything larger than a small fix, open an issue first so we can agree on the approach.
2. Fork the repository and create a branch from `develop` (not `main`).
3. Make your changes, keeping each pull request focused on one thing.
4. Before pushing, make sure these pass:
   ```bash
   pnpm typecheck
   pnpm lint
   ```
5. Open a pull request against `develop` and describe what changed and why. Include screenshots or a short recording for UI changes.

### Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add stash preview
fix: keep selection after discarding a hunk
chore: bump electron to 43
```

Common types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`.

## Architecture

### Desktop app processes

`apps/desktop` is built with electron-vite into three bundles:

| Bundle | Location | Role |
|--------|----------|------|
| main | `src/app/main/`, `src/main/` | Node.js process: git operations, services, IPC handlers |
| preload | `src/app/preload/` | Security bridge exposing IPC to the renderer (no Node APIs) |
| renderer | `src/renderer/`, `src/onboarding/renderer/` | React UI |

Main-process features live in `src/main/features/<feature>/`, each owning its service and IPC handlers.

### Adding an IPC channel

1. Declare the channel in `src/shared/ipc/channels.ts`
2. Add the handler in the feature's `src/main/features/<feature>/ipc/register-<feature>-ipc-handlers.ts`
3. Register it in `src/main/ipc/register-ipc-handlers.ts` (`pnpm lint` fails if you forget)
4. Expose it to the renderer through `src/app/preload/`

### Renderer: Feature-Sliced Design

The renderer follows [Feature-Sliced Design](https://feature-sliced.design/). Layers, from top to bottom:

```
app       providers, global styles, routing
pages     route-level components
widgets   self-contained UI blocks
features  user interactions
entities  domain objects
shared    reusable primitives (ui, lib, config, ipc, types)
```

Rules:

- A layer may only import from layers **below** it.
- Slices on the same layer must not import each other. The rare sanctioned exception goes through the slice's `@x/` folder.
- Each slice exposes its public API through `index.ts`. Import from there, not from internal files.
- Inside a slice: `ui/` for components, `api/` for hooks and queries, `model/` for state, `lib/` for pure helpers.

The FSD structure is validated with [Steiger](https://github.com/feature-sliced/steiger) when you run `pnpm dev`.

## Coding standards

- Never use `any`. Use `unknown` and narrow it, or model the type properly.
- Let type inference work. Add explicit types at public API boundaries, for non-obvious return types and for complex generics.
- Prefer `type` over `interface` unless you need declaration merging.
- Use classes for stateful main-process services and keep their constructors free of side effects.
- Name functions verb-first (`fetchCommits`, `resolveActiveBranch`). Prefix booleans with `is`/`has`/`can`/`should`.
- Avoid nested ternaries. Use `if/else` instead.
- Check `shared/lib/` (or the slice's `lib/`) for an existing helper before writing a new one.
- Keep comments and logging minimal, and don't leave debug `console.log` calls behind.

## Reporting bugs and requesting features

Open an issue with:

- what you expected and what happened instead
- steps to reproduce
- your OS and app version (or commit hash)

For security issues, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
