// Prints the scored lead list by priority. Usage: npx tsx scripts/report.ts
import { readFileSync } from 'node:fs'
import { scoreLead, PRIORITY_META } from '../src/lib/score'
import type { Lead } from '../src/lib/types'

const leads: Lead[] = JSON.parse(readFileSync(new URL('../data/leads.json', import.meta.url), 'utf8'))
const rows = leads.map(l => ({ l, s: scoreLead(l) })).sort((a, b) => b.s.total - a.s.total)
for (const p of Object.keys(PRIORITY_META) as (keyof typeof PRIORITY_META)[]) {
  const group = rows.filter(r => r.s.priority === p)
  console.log(`\n${PRIORITY_META[p].label} (${group.length})`)
  for (const { l, s } of group) console.log(`  ${String(s.total).padStart(3)}  ${l.company.slice(0, 44).padEnd(44)} ${l.vertical.padEnd(13)} ${l.city}, ${l.region}${s.disqualifiers.length ? '  ✗ ' + s.disqualifiers.join(', ') : ''}`)
}
