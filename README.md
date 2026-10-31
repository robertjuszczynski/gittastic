# Gittastic

A desktop Git client built with Electron and React.

> **Status:** early development. Expect rough edges and breaking changes. There are no prebuilt binaries yet, so you need to run it from source.

## Features

- **Repositories:** manage multiple repositories and organize them into groups
- **History:** commit graph with virtualized commit list
- **Changes:** stage/unstage files, view diffs with syntax highlighting, commit
- **Branches:** create, check out, delete and merge branches
- **Stashes:** stash and pop changes
- **Remote:** push, pull and fetch
- **Undo / redo** for git operations
- **Merge conflicts:** built-in conflict resolver
- **Integrated terminal** (xterm + node-pty)
- **Command palette**
- **Light and dark themes**
- **Onboarding wizard** for first-run setup

## Tech stack

| Area | Tools |
|------|-------|
| Desktop shell | Electron, electron-vite |
| UI | React 19, React Router, Tailwind CSS, Zustand, TanStack Query |
| Git | simple-git |
| Terminal | xterm.js, node-pty |
| Backend (`apps/api`) | NestJS + Fastify |
| Monorepo | pnpm workspaces, Turborepo |

## Getting started

### Prerequisites

- **Node.js** 22+
- **pnpm** 11 (`corepack enable` or install it with your preferred tool)
- **Git**
- A native build toolchain for compiling `node-pty`:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Linux: `build-essential` and Python 3
  - Windows: Visual Studio Build Tools with the "Desktop development with C++" workload

### Setup

```bash
git clone https://github.com/robertjuszczynski/gittastic.git
cd gittastic
pnpm install
cp apps/desktop/.env.example apps/desktop/.env
pnpm dev
```

`pnpm install` downloads Electron and rebuilds `node-pty` against it (via `postinstall`).

### Environment variables

Defined in `apps/desktop/.env` and validated at startup:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | yes | Port number used by the dev setup (e.g. `5174`) |
| `GITHUB_CLIENT_ID` | yes | Client ID of a GitHub OAuth App. Any placeholder works if you don't use GitHub sign-in |
| `RESET_ONBOARDING` | no | `true` always opens the onboarding wizard on launch (dev only) |

GitHub sign-in is still in progress. To try it, create an OAuth App at
[github.com/settings/developers](https://github.com/settings/developers) with the
callback URL `gitastic://oauth/callback`.

## Scripts

Run from the repository root:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode (typechecks and validates FSD structure first) |
| `pnpm dev:reset-onboarding` | Same as `dev`, but always shows the onboarding wizard |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Lint all packages |

To target a single app, use a filter, e.g. `pnpm --filter @gitastic/desktop dev`.

## Project structure

```
apps/
  desktop/        Electron + React app (the main product)
    src/app/        Electron entry points (main, preload, renderer roots)
    src/main/       Main process: git operations, IPC handlers, services
    src/renderer/   Main window UI (Feature-Sliced Design)
    src/onboarding/ Onboarding window UI
    src/shared/     Code shared by main and renderer (IPC channels, types, config)
  api/            NestJS backend
packages/
  types/          Shared TypeScript types
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture rules and the development workflow.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md). Please don't open public issues for security problems.

## License

[MIT](LICENSE) © Robert Juszczynski
