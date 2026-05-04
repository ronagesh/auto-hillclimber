# Arize Auto Hill Climber

A demo product concept for Arize AI — an autopilot layer that continuously monitors your AI agent in production, surfaces prioritized failure clusters, and automatically runs prompt experiments to hill-climb your KPIs.

## What it does

Enter your product URL. Arize scrapes it, infers what your agent does and what KPIs matter, then generates a live dashboard of:

- **Prioritized issue feed** — production failure clusters ranked by frequency, KPI risk, and escalation volume, each backed by real traces and evaluator scores
- **Suggested fixes** — editable prompt diffs you can review and deploy in one click
- **Impact tracker** — experiment results showing KPI lift before/after each deployed fix, with confidence intervals and counterfactual baselines

## Stack

- React + Vite + TypeScript
- Tailwind CSS v3
- Recharts (impact charts)
- Anthropic SDK (`claude-haiku-4-5`) — website inference + dashboard generation

## Running locally

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

> **Note:** The API key is baked in at build time by Vite. Restart the dev server after adding or changing `.env.local`.

## How it works

1. **URL onboarding** — enter any company URL (e.g. `cursor.com`). Arize fetches structured metadata (title, OG tags, headings) via a CORS proxy and sends it to Claude to infer agent type and KPIs.
2. **Review & edit** — pre-filled description and KPI fields are shown for confirmation. Edit anything that looks off.
3. **Dashboard generation** — Claude generates a realistic set of production failure clusters, sample traces with evaluator labels, suggested prompt fixes, and past experiment results — all specific to the company's domain.
4. **Apply fixes** — clicking "Apply Fix" or deploying from the drawer removes the issue from the feed and records the change. The Impact Tracker shows experiment history with KPI charts.

## Key Arize constructs surfaced in the UI

| Construct | Where |
|-----------|-------|
| **Evaluator** | Issue card badge, drawer header, span section subtitle |
| **Traces & Spans** | Drawer — each sample span shows `tr_XXXXXXXX · sp_XXXXXXXX` IDs with Arize deeplinks |
| **Experiment** | Impact Tracker — each result card is labeled as an Experiment with evaluator type |
| **KPI lift** | Stat cards (feed) and lift badges (impact charts) with ±CI |

## Live demo

[auto-hill-climber.vercel.app](https://auto-hill-climber.vercel.app)
