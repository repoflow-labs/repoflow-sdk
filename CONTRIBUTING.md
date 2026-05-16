# Contributing to RepoFlow SDK

## 1. Fork-and-Pull Git Workflow

- Fork → clone → upstream: `git remote add upstream https://github.com/repoflow-labs/repoflow-sdk.git`
- Branch naming: `feature/<scope>` | `fix/<scope>` | `docs/<scope>` | `chore/<scope>`
- Never commit directly to main
- Rebase on upstream/main before PR; merge commits prohibited

## 2. Commit Message Convention (Angular, enforced)

Format: `<type>(<scope>): <imperative subject ≤72 chars>`

Types: feat | fix | docs | chore | test | refactor | perf

Scopes: sdk,types,ci,deps

Examples:
- feat(sdk): add RepoFlowClient.getDependencyTree method
- fix(sdk): correct XDR serialization in claimRepo
- docs(sdk): add TypeDoc comments to all public methods

Breaking changes: `BREAKING CHANGE: <description>` in commit footer

## 3. PR Submission Requirements

- All CI checks must pass before requesting review
- Unit test for every new public method
- Closes # in PR description
- PR title follows same Angular convention
- Minimum one maintainer approval before merge