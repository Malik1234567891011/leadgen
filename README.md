# Leadgen

A calling dashboard for finding and working home-service leads. Each lead is scored against the ICP rubric and comes with a word-for-word call script built from its own research.

```bash
npm install
npm run dev        # http://localhost:5190
```

## How it's put together

- **`data/leads.json`** is the database: one object per lead, research fields plus CRM state (status, notes, activity, do-not-call). The dev server serves it through a small API in `vite.config.ts`, and every edit in the UI writes back to this file. It's plain JSON, so it diffs cleanly in git.
- **`data/settings.json`** holds your name, company, callback number, one-liner and price range. The scripts say these out loud.
- **`src/lib/score.ts`** is the 100-point rubric (vertical 25, inbound volume 25, recovery opportunity 20, buyability 20, contactability 10) plus hard disqualifiers. The score is computed from the research signals, never typed in by hand, so correcting a signal in the Research tab re-scores the lead immediately.
- **`src/lib/script.ts`** builds each lead's call script. The wording and rules come from `docs/research/cold-calling.md`. Read that doc before changing lines.
- **`src/lib/time.ts`** holds the call windows (the lead's local time) and the 5-attempt follow-up cadence.

## Adding leads

- **By hand:** use "Add lead" in the sidebar, then fill in the Research tab.
- **In bulk:** write researched leads in the flat format described in `docs/LEAD_RESEARCH.md`, then run:

```bash
node scripts/import-research.mjs path/to/research.json
```

The import matches existing leads by website domain or company name. It refreshes research fields and never touches call status, notes, activity or the do-not-call flag. Keep the dashboard open while importing; it reloads when the window regains focus.

## Rules the app enforces

- The **Do not call** flag hides the dial button permanently. Honor these requests on the same call.
- **Canadian** leads stay held until `canadaCallReady` is ticked, which should happen only once CRTC / National DNCL registration is done.
- The voicemail script switches to "don't leave one" once two have been left.
