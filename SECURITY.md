# Security Policy

## Supported versions

Gittastic is in early development. Security fixes are made only on the latest commit of the `develop` branch.

## Reporting a vulnerability

**Please don't report security vulnerabilities through public issues, discussions or pull requests.**

Report them privately through GitHub's
[private vulnerability reporting](https://github.com/robertjuszczynski/gittastic/security/advisories/new).

Please include:

- a description of the issue and its impact
- steps to reproduce or a proof of concept
- affected version or commit hash, and your OS

You can expect an initial response within 7 days. Once the issue is confirmed, a fix will be prepared and you'll be credited in the advisory unless you prefer otherwise.

## Scope

Areas of particular interest:

- the Electron preload bridge and IPC handlers (anything that lets the renderer reach Node APIs or run arbitrary commands)
- handling of GitHub OAuth tokens and other stored credentials
- command or argument injection in git and terminal operations
- loading of remote content in the renderer
