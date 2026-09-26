import type { Lead } from './types'
import { TIER_POINTS, VERTICALS } from './verticals'

export interface ScoreItem { label: string; points: number; max: number }
export interface ScoreGroup { key: string; label: string; max: number; points: number; items: ScoreItem[] }
export type Priority = 'call-first' | 'very-good' | 'backlog' | 'skip'

export interface Scored {
  total: number
  groups: ScoreGroup[]
  priority: Priority
  /** Hard disqualifiers from the ICP. Any of these forces priority to skip. */
  disqualifiers: string[]
}

export const PRIORITY_META: Record<Priority, { label: string; short: string }> = {
  'call-first': { label: 'Call first', short: '80+' },
  'very-good': { label: 'Very good', short: '70–79' },
  backlog: { label: 'Backlog', short: '60–69' },
  skip: { label: "Don't waste time", short: '<60' },
}

const yes = (v: boolean | null) => v === true

function group(key: string, label: string, max: number, items: ScoreItem[]): ScoreGroup {
  const points = Math.min(max, items.reduce((s, i) => s + i.points, 0))
  return { key, label, max, points, items }
}

export function scoreLead(l: Lead): Scored {
  const s = l.signals
  const tier = VERTICALS[l.vertical]?.tier ?? 'B'
  const r = l.googleReviews ?? 0

  const vertical = group('vertical', 'Vertical & economics', 25, [
    { label: `${tier}-tier vertical`, points: TIER_POINTS[tier], max: 25 },
  ])

  const inbound = group('inbound', 'Inbound lead volume', 25, [
    { label: 'Visible paid ads', points: yes(s.paidAds) ? 8 : 0, max: 8 },
    { label: r >= 100 ? '100+ reviews' : r >= 40 ? '40–99 reviews' : r >= 15 ? '15–39 reviews' : 'Reviews', points: r >= 100 ? 5 : r >= 40 ? 3 : r >= 15 ? 1 : 0, max: 5 },
    { label: 'Several recent reviews', points: yes(s.recentReviews) ? 3 : 0, max: 3 },
    { label: 'Multiple service areas / crews', points: yes(s.multipleServiceAreas) ? 3 : 0, max: 3 },
    { label: 'Free estimate / booking funnel', points: yes(s.freeEstimate) ? 3 : 0, max: 3 },
    { label: 'Financing offered', points: yes(s.financing) ? 3 : 0, max: 3 },
  ])

  const recovery = group('recovery', 'Recovery opportunity', 20, [
    { label: '24/7 / emergency offering', points: yes(s.emergency247) ? 6 : 0, max: 6 },
    { label: 'Phone is the primary CTA', points: yes(s.phonePrimaryCta) ? 4 : 0, max: 4 },
    { label: 'Possible after-hours gap', points: yes(s.afterHoursGap) ? 4 : 0, max: 4 },
    { label: 'No instant booking / text / chat', points: s.onlineBooking === false && s.chatOrText === false ? 3 : 0, max: 3 },
    { label: 'Reviews mention slow callbacks', points: yes(s.reviewResponseComplaints) ? 3 : 0, max: 3 },
  ])

  const band = l.employeeBand
  const buy = group('buy', 'Buyability', 20, [
    { label: 'Local / family / founder owned', points: yes(s.locallyOwned) ? 6 : 0, max: 6 },
    { label: 'Likely 5–50 employees', points: band === '5-15' || band === '16-50' ? 5 : band === '51-100' ? 3 : band === '3-4' ? 2 : 0, max: 5 },
    { label: '1–5 locations', points: l.locations != null && l.locations >= 1 && l.locations <= 5 ? 3 : 0, max: 3 },
    { label: 'Decision maker identified', points: l.dmName ? 3 : 0, max: 3 },
    { label: 'No franchise / corporate procurement', points: s.franchise === false ? 3 : 0, max: 3 },
  ])

  const contact = group('contact', 'Contactability', 10, [
    { label: 'Official number verified', points: l.phone && l.phoneSource ? (yes(s.phoneMatchesGoogle) ? 5 : 3) : 0, max: 5 },
    { label: 'Decision maker name sourced', points: l.dmName && l.dmSource ? 3 : 0, max: 3 },
    { label: 'Direct line / good route to DM', points: l.directLine ? 2 : 0, max: 2 },
  ])

  const groups = [vertical, inbound, recovery, buy, contact]
  const total = groups.reduce((s, g) => s + g.points, 0)

  const disqualifiers: string[] = []
  if (s.residential === false) disqualifiers.push('Not residential')
  if (s.franchise === true) disqualifiers.push('Franchise branch')
  if (s.sophisticatedContactCenter === true) disqualifiers.push('Already has a 24/7 contact center')
  if (band === '1-2') disqualifiers.push('One/two-person operator')
  if (band === '250+') disqualifiers.push('Too big (250+)')
  if (l.googleReviews != null && l.googleReviews < 15) disqualifiers.push('Under 15 reviews')
  if (!l.phone) disqualifiers.push('No verified business phone')

  const priority: Priority = disqualifiers.length
    ? 'skip'
    : total >= 80 ? 'call-first' : total >= 70 ? 'very-good' : total >= 60 ? 'backlog' : 'skip'

  return { total, groups, priority, disqualifiers }
}
