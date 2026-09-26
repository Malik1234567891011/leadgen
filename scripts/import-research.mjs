#!/usr/bin/env node
// Merge researched leads (flat JSON, see docs/LEAD_RESEARCH.md) into data/leads.json.
// Research fields are refreshed; CRM fields (status, notes, activity, dnc…) are never touched.
// Usage: node scripts/import-research.mjs data/seed-research.json
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs'

const src = process.argv[2]
if (!src) { console.error('usage: import-research.mjs <research.json>'); process.exit(1) }

const LEADS = new URL('../data/leads.json', import.meta.url).pathname
const leads = existsSync(LEADS) ? JSON.parse(readFileSync(LEADS, 'utf8')) : []
const incoming = JSON.parse(readFileSync(src, 'utf8'))

const SIGNALS = ['paidAds', 'recentReviews', 'emergency247', 'residential', 'freeEstimate', 'onlineBooking', 'chatOrText',
  'financing', 'multipleServiceAreas', 'phonePrimaryCta', 'afterHoursGap', 'reviewResponseComplaints', 'locallyOwned',
  'franchise', 'sophisticatedContactCenter', 'phoneMatchesGoogle']
const FIELDS = ['company', 'website', 'vertical', 'city', 'region', 'country', 'timezone', 'hours', 'hoursSource', 'phone',
  'phoneSource', 'googleRating', 'googleReviews', 'latestReviewAge', 'paidAdsNote', 'reviewComplaintQuote', 'ownershipNote',
  'employeesEstimate', 'employeeBand', 'locations', 'existingTools', 'dmName', 'dmTitle', 'dmSource', 'directLine',
  'directLineSource', 'opportunity', 'hooks', 'sources']

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const host = u => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }

let added = 0, updated = 0
for (const r of incoming) {
  const research = Object.fromEntries(FIELDS.map(f => [f, r[f] ?? (f === 'hooks' || f === 'sources' ? [] : null)]))
  research.employeeBand ??= 'unknown'
  const signals = Object.fromEntries(SIGNALS.map(k => [k, r[k] ?? null]))
  const existing = leads.find(l => host(l.website) === host(r.website) || l.company === r.company)
  if (existing) {
    Object.assign(existing, research, { signals: { ...existing.signals, ...signals }, researchNotes: r.notes ?? existing.researchNotes, researchedAt: new Date().toISOString() })
    updated++
  } else {
    leads.push({
      id: slug(r.company), ...research, signals,
      researchedAt: new Date().toISOString(), researchNotes: r.notes ?? null,
      status: 'new', lastContact: null, followUp: null, dnc: false, canadaCallReady: false, notes: '', activity: [],
    })
    added++
  }
}

writeFileSync(LEADS + '.tmp', JSON.stringify(leads, null, 2) + '\n')
renameSync(LEADS + '.tmp', LEADS)
console.log(`added ${added}, updated ${updated}, total ${leads.length}`)
