# automation-team-gamma

Playwright + TypeScript UI test automation for [Swag Labs (saucedemo.com)](https://www.saucedemo.com), integrated with the Test Automation Platform via [`@ndviet/adapter-playwright`](https://github.com/ndviet/adapter-playwright).

---

## Stack

| Tool | Role |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| TypeScript | Language |
| `@ndviet/adapter-playwright` | Publishes test results to the Test Automation Platform after each run |

---

## Project Structure

```
automation-team-gamma/
├── playwright.config.ts        # Playwright configuration & reporter setup
├── tests/
│   ├── fixtures.ts             # Shared fixtures, page objects, test users
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── auth.spec.ts            # Login / logout (8 tests)
│   ├── inventory.spec.ts       # Product listing & sorting (8 tests)
│   ├── cart.spec.ts            # Cart operations (7 tests)
│   ├── checkout.spec.ts        # Checkout flow & validation (9 tests)
│   └── navigation.spec.ts      # Burger menu & navigation (5 tests)
└── package.json
```

---

## Test Coverage

| Suite | Cases | Covers |
|---|---|---|
| **Authentication** | 8 | Valid login, invalid credentials, empty fields, locked user, logout, unauthenticated redirect |
| **Inventory** | 8 | Product list display, card elements, sort by name (A→Z / Z→A), sort by price (low→high / high→low), product detail navigation |
| **Cart** | 7 | Add/remove items, badge count, multi-item count, cart page contents, continue shopping |
| **Checkout** | 9 | End-to-end order, form validation (first name / last name / zip), cancel step 1 & 2, total = subtotal + tax, back to home |
| **Navigation** | 5 | Burger menu, reset app state, About link, page title, cart icon |

**Total: 37 test cases**

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- A GitHub Personal Access Token (PAT) with at least **`read:packages`** scope

---

## Getting Started

### 1. Authenticate with GitHub Packages

`@ndviet/adapter-playwright` is published to GitHub Packages. Set your PAT as an environment variable before installing:

```bash
export GITHUB_TOKEN=your_github_pat
```

The `.npmrc` in this repo already points the `@ndviet` scope at `https://npm.pkg.github.com` and picks up the token automatically.

> **Tip — persist the token locally:** add `export GITHUB_TOKEN=...` to your `~/.zshrc` or `~/.bashrc` so you don't have to set it every session.

> **CI/CD:** add `GITHUB_TOKEN` as a repository secret and expose it to the job that runs `npm install`. On GitHub Actions the built-in `${{ secrets.GITHUB_TOKEN }}` already has `read:packages` permission.

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

### 3. Run all tests

```bash
npm test
```

### 4. Run in headed mode (see the browser)

```bash
npm run test:headed
```

### 5. Open the HTML report

```bash
npm run test:report
```

---

## Platform Integration

After every run, `@ndviet/adapter-playwright` automatically POSTs results to the Test Automation Platform. Configure it via environment variables:

| Variable | Default | Description |
|---|---|---|
| `PLATFORM_ENDPOINT` | `http://localhost:8081` | Platform ingestion URL |
| `PLATFORM_API_KEY` | _(none)_ | API key for authentication |
| `PLATFORM_TEAM_ID` | `automation-team-gamma` | Team identifier on the platform |
| `PLATFORM_PROJECT_ID` | `shop-labs` | Project identifier on the platform |

Example:

```bash
export PLATFORM_ENDPOINT=http://your-platform-host:8081
export PLATFORM_API_KEY=your-api-key
export PLATFORM_TEAM_ID=automation-team-gamma
export PLATFORM_PROJECT_ID=shop-labs

npm test
```

On completion you will see a summary line:

```
[PlatformReporter] ✓ Published 37 tests → runId=<uuid>
```

### CI/CD

Branch, commit SHA, and CI run URL are auto-detected from common CI providers (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps, Bitbucket, Travis CI, Buildkite, TeamCity). No extra configuration is needed when running in those environments.

---

## GitHub Actions CI

The workflow at `.github/workflows/playwright.yml` runs automatically on every push and pull request to `main`/`master`.

### Triggers

| Event | Behaviour |
|---|---|
| `push` to `main` / `master` | Runs all tests |
| `pull_request` to `main` / `master` | Runs all tests |
| `workflow_dispatch` | Manual run with optional `environment` input (`ci` / `staging` / `production`) |

Concurrent runs on the same branch are cancelled automatically (only the latest run proceeds).

### Required secrets & variables

Go to **Settings → Secrets and variables → Actions** in your GitHub repository and add:

| Name | Type | Description |
|---|---|---|
| `PLATFORM_ENDPOINT` | Secret | Platform ingestion URL |
| `PLATFORM_API_KEY` | Secret | API key for the platform |
| `PLATFORM_TEAM_ID` | Variable | Team ID (falls back to `automation-team-gamma`) |
| `PLATFORM_PROJECT_ID` | Variable | Project ID (falls back to `shop-labs`) |

> `GITHUB_TOKEN` is provided automatically by GitHub Actions and already has `read:packages` permission — no extra setup needed for installing `@ndviet/adapter-playwright`.

### Artifacts

| Artifact | Uploaded when | Retention |
|---|---|---|
| `playwright-report-<run_id>` | Always | 30 days |
| `test-results-<run_id>` | On failure only (traces, screenshots, videos) | 7 days |

---

## Configuration Reference

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| Base URL | `https://www.saucedemo.com` |
| Timeout per test | 30 s |
| Retries (CI) | 2 |
| Parallelism | Full (local) / single worker (CI) |
| On failure | Screenshot + video + trace retained |
| Reporters | `list`, `html` (`playwright-report/`), platform adapter |
