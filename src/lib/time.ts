export type Window = 'prime' | 'ok' | 'avoid' | 'closed'

export interface LocalTime {
  label: string // "7:42 AM"
  day: string // "Tue"
  window: Window
  hint: string
}

/** Contractor owners are reachable before crews roll out and as they wrap up; mid-day they're on jobs. */
export function localTime(tz: string, now = new Date()): LocalTime {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const h = Number(get('hour')) % 24
  const m = Number(get('minute'))
  const day = get('weekday')
  const mins = h * 60 + m
  const label = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(now)

  // Windows from docs/research/cold-calling.md §8: owners before crews roll and as they
  // head back; office staff mid-morning. Before 8 only if it's clearly a business line (TCPA).
  let window: Window
  let hint: string
  if (day === 'Sat' || day === 'Sun') { window = 'closed'; hint = 'Weekend — call Monday' }
  else if (mins < 7 * 60 || mins >= 18 * 60) { window = 'closed'; hint = 'Outside calling hours' }
  else if (day === 'Mon' && mins < 10 * 60) { window = 'avoid'; hint = 'Monday morning dispatch chaos' }
  else if (day === 'Fri' && mins >= 15 * 60) { window = 'avoid'; hint = 'Friday afternoon — low odds' }
  else if (mins < 8 * 60 + 15) { window = 'prime'; hint = mins < 8 * 60 ? 'Prime — before crews roll (business lines only before 8)' : 'Prime — before crews roll' }
  else if (mins >= 16 * 60 && mins < 17 * 60 + 30) { window = 'prime'; hint = 'Prime — owners heading back' }
  else if (mins >= 10 * 60 && mins < 11 * 60 + 30) { window = 'ok'; hint = 'Good for office staff / GMs' }
  else { window = 'ok'; hint = 'Owner likely on a job — expect the front desk' }
  return { label, day, window, hint }
}

export function relDay(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso)
  const today = new Date()
  const diff = Math.round((startOfDay(d) - startOfDay(today)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff < 0 && diff > -7) return `${-diff}d ago`
  if (diff > 0 && diff < 7) return d.toLocaleDateString('en-US', { weekday: 'long' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addBusinessDays(n: number, from = new Date()): string {
  const d = new Date(from)
  let left = n
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) left--
  }
  return isoDate(d)
}

export function tzShort(tz: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? tz
}

/** Next follow-up per the 5-attempts-over-3-weeks cadence (research §7). */
export function cadenceFollowUp(attemptNumber: number, from = new Date()): string {
  const gap = [2, 4, 5, 6][attemptNumber - 1] // day 1 → 3 → 7 → 12 → 18
  const d = new Date(from)
  d.setDate(d.getDate() + (gap ?? 30)) // after the 5th, park it for a month
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
  return isoDate(d)
}
