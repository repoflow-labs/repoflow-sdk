# repoflow-sdk

TypeScript SDK for integrating with the RepoFlow protocol on Stellar

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Stellar](https://img.shields.io/badge/network-Stellar-black)](https://stellar.org)

## Technical Architecture Overview

```
Consumer App → RepoFlowClient → Soroban RPC (simulate + submit)
                             → Backend API (proof endpoints)
```

Public surface: RepoFlowClient { claimRepo | setDependencySplit | fundRepo | claimEarnings | getRepoFunding | getDependencyTree }

## Local Development Setup

### Prerequisites

| Tool | Version | Install Command |
|------|---------|-----------------|
| Node.js | 20 LTS | https://nodejs.org |
| npm | 10+ | Comes with Node.js |

### Sequential CLI Commands

```bash
npm install
npm run build
npm test
```

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | TypeScript | 5.x |
| Runtime | Node.js | 20 LTS |
| Testing | Vitest | latest |
| Bundler | Vite | latest |
| HTTP Client | Fetch API | native |