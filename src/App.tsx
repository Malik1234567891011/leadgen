import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, CalendarClock, CheckCircle2, Inbox, Moon, PhoneCall, Plus, Search, Settings2, Sun } from 'lucide-react'
import { useStore } from './lib/store'
import { scoreLead, PRIORITY_META, type Priority } from './lib/score'
import { localTime, isoDate } from './lib/time'
import { VERTICALS } from './lib/verticals'
import type { Lead, Vertical } from './lib/types'
import { LeadList } from './components/LeadList'
import { LeadPanel } from './components/LeadPanel'
import { Playbook } from './components/Playbook'
import { SettingsDialog, AddLeadDialog } from './components/Dialogs'
import { cx, Kbd } from './components/ui'
import { useNow } from './lib/useNow'

export type View = 'queue' | 'all' | 'followups' | 'booked' | 'playbook'

const CLOSED = new Set(['meeting', 'not-interested', 'disqualified'])

export default function App() {
  const store = useStore()
  const now = useNow()
  const [view, setView] = useState<View>('queue')
  const [selected, setSelected] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [vertical, setVertical] = useState<Vertical | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | null>(() => {
    try { return (localStorage.getItem('theme') as 'light' | 'dark' | null) } catch { return null }
  })

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    else delete document.documentElement.dataset.theme
    try { theme ? localStorage.setItem('theme', theme) : localStorage.removeItem('theme') } catch { /* private mode */ }
  }, [theme])

  const scored = useMemo(() => store.leads.map(l => ({ lead: l, score: scoreLead(l) })), [store.leads])
  const today = isoDate(now)

  const callable = (l: Lead) => !l.dnc && !CLOSED.has(l.status) && (l.country === 'US' || l.canadaCallReady)

  const counts = useMemo(() => ({
    queue: scored.filter(s => callable(s.lead) && s.score.priority !== 'skip').length,
    all: scored.length,
    followups: scored.filter(s => s.lead.followUp && !s.lead.dnc && !CLOSED.has(s.lead.status)).length,
    booked: scored.filter(s => s.lead.status === 'meeting').length,
    due: scored.filter(s => s.lead.followUp && s.lead.followUp <= today && callable(s.lead)).length,
    callFirst: scored.filter(s => s.score.priority === 'call-first' && callable(s.lead)).length,
    // Daily funnel (research §10): track dials and real conversations, not just meetings.
    dialsToday: scored.reduce((n, s) => n + s.lead.activity.filter(a => isoDate(new Date(a.at)) === today && a.outcome !== 'note').length, 0),
    talksToday: scored.reduce((n, s) => n + s.lead.activity.filter(a => isoDate(new Date(a.at)) === today && ['conversation', 'meeting', 'not-interested', 'callback'].includes(a.outcome)).length, 0),
  }), [scored, today])

  const rows = useMemo(() => {
    let r = scored
    if (view === 'queue') r = r.filter(s => callable(s.lead) && s.score.priority !== 'skip')
    if (view === 'followups') r = r.filter(s => s.lead.followUp && !s.lead.dnc && !CLOSED.has(s.lead.status))
    if (view === 'booked') r = r.filter(s => s.lead.status === 'meeting')
    if (vertical) r = r.filter(s => s.lead.vertical === vertical)
    if (priority) r = r.filter(s => s.score.priority === priority)
    if (q.trim()) {
      const n = q.toLowerCase()
      r = r.filter(s => [s.lead.company, s.lead.city, s.lead.region, s.lead.dmName, s.lead.phone, VERTICALS[s.lead.vertical]?.label]
        .some(v => v?.toLowerCase().includes(n)))
    }
    const windowRank = { prime: 0, ok: 1, avoid: 2, closed: 3 }
    return [...r].sort((a, b) => {
      if (view === 'followups') return (a.lead.followUp ?? '').localeCompare(b.lead.followUp ?? '')
      if (view === 'queue') {
        const dueA = a.lead.followUp && a.lead.followUp <= today ? 0 : 1
        const dueB = b.lead.followUp && b.lead.followUp <= today ? 0 : 1
        if (dueA !== dueB) return dueA - dueB
        const wa = windowRank[localTime(a.lead.timezone, now).window]
        const wb = windowRank[localTime(b.lead.timezone, now).window]
        if (wa !== wb) return wa - wb
      }
      return b.score.total - a.score.total
    })
  }, [scored, view, vertical, priority, q, today, now])

  const sel = scored.find(s => s.lead.id === selected) ?? null

  // Remember what comes after the open lead. Logging "Meeting" or "Not interested" drops it
  // out of the queue, so the next row has to be known before the list re-sorts.
  const nextRef = useRef<string | null>(null)
  if (selected && rows.some(r => r.lead.id === selected)) nextRef.current = nextId(rows, selected)

  // j / k to move through the list, esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'j' || e.key === 'k') {
        const i = rows.findIndex(r => r.lead.id === selected)
        const n = e.key === 'j' ? Math.min(rows.length - 1, i + 1) : Math.max(0, i - 1)
        if (rows[n]) setSelected(rows[n].lead.id)
      }
      if (e.key === '/') { e.preventDefault(); document.getElementById('search')?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rows, selected])

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const verticalsPresent = [...new Set(store.leads.map(l => l.vertical))]

  const nav: { id: View; label: string; icon: typeof Inbox; count?: number }[] = [
    { id: 'queue', label: 'Call queue', icon: PhoneCall, count: counts.queue },
    { id: 'followups', label: 'Follow-ups', icon: CalendarClock, count: counts.followups },
    { id: 'booked', label: 'Meetings', icon: CheckCircle2, count: counts.booked },
    { id: 'all', label: 'All leads', icon: Inbox, count: counts.all },
    { id: 'playbook', label: 'Playbook', icon: BookOpen },
  ]

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-[216px] shrink-0 flex-col border-r border-line bg-panel-2 px-3 py-4">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-bg"><PhoneCall size={14} strokeWidth={2.4} /></div>
          <div className="font-serif text-[22px] leading-none tracking-tight">Leadgen</div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {nav.map(n => (
            <button key={n.id} onClick={() => { setView(n.id); if (n.id === 'playbook') setSelected(null) }}
              className={cx('flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition',
                view === n.id ? 'bg-panel font-medium text-ink shadow-card' : 'text-ink-2 hover:bg-line-2 hover:text-ink')}>
              <n.icon size={15} strokeWidth={2} className={view === n.id ? 'text-accent' : ''} />
              <span className="flex-1 text-left">{n.label}</span>
              {n.count != null && <span className="tnum text-[12px] text-ink-3">{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-0.5">
          <button onClick={() => setShowAdd(true)} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-2 hover:bg-line-2 hover:text-ink">
            <Plus size={15} /> Add lead
          </button>
          <button onClick={() => setShowSettings(true)} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-2 hover:bg-line-2 hover:text-ink">
            <Settings2 size={15} /> Settings
          </button>
          <button onClick={() => setTheme(t => (t === 'dark' ? 'light' : t === 'light' ? null : 'dark'))}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-2 hover:bg-line-2 hover:text-ink">
            {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />} {theme ? (theme === 'dark' ? 'Dark' : 'Light') : 'System'} theme
          </button>
          <div className="mt-3 px-2.5 text-[11px] leading-relaxed text-ink-3">
            <Kbd>j</Kbd> <Kbd>k</Kbd> move · <Kbd>/</Kbd> search · <Kbd>esc</Kbd> close
          </div>
        </div>
      </aside>

      {view === 'playbook' ? (
        <Playbook settings={store.settings} />
      ) : (
        <>
          {/* List column */}
          <main className={cx('flex min-w-0 flex-col', sel ? 'w-[400px] shrink-0 border-r border-line' : 'flex-1')}>
            <header className="px-6 pt-6 pb-4">
              {!sel && (
                <div className="mb-5 flex items-end justify-between gap-6">
                  <div>
                    <div className="text-[13px] text-ink-3">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    <h1 className="font-serif text-[40px] leading-[1.05] tracking-tight">{greeting}, {store.settings.callerName || 'there'}.</h1>
                  </div>
                  <div className="flex gap-2">
                    <Stat label="Call first" value={counts.callFirst} tone="text-hot" />
                    <Stat label="Due today" value={counts.due} tone="text-warn" />
                    <Stat label="Dials today" value={counts.dialsToday} />
                    <Stat label="Talked today" value={counts.talksToday} tone="text-accent" />
                    <Stat label="Meetings" value={counts.booked} tone="text-good" />
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 focus-within:border-ink-3/60">
                  <Search size={14} className="text-ink-3" />
                  <input id="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search company, city, owner…"
                    className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
                </label>
                <select value={vertical} onChange={e => setVertical(e.target.value as Vertical | '')}
                  className="cursor-pointer rounded-lg border border-line bg-panel px-2 py-1.5 text-[13px] text-ink-2 outline-none">
                  <option value="">All trades</option>
                  {verticalsPresent.map(v => <option key={v} value={v}>{VERTICALS[v]?.label ?? v}</option>)}
                </select>
                {!sel && (
                  <div className="flex rounded-lg border border-line bg-panel p-0.5">
                    {(['', 'call-first', 'very-good', 'backlog', 'skip'] as const).map(p => (
                      <button key={p} onClick={() => setPriority(p)}
                        className={cx('cursor-pointer rounded-md px-2 py-1 text-[12px] transition', priority === p ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink')}>
                        {p ? PRIORITY_META[p].label : 'Any score'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </header>
            <LeadList rows={rows} selected={selected} onSelect={setSelected} compact={!!sel} now={now} view={view} loaded={store.loaded} total={store.leads.length} />
          </main>

          {sel && (
            <LeadPanel key={sel.lead.id} lead={sel.lead} score={sel.score} store={store} now={now} onClose={() => setSelected(null)}
              onNext={nextRef.current ? () => setSelected(nextRef.current) : undefined} />
          )}
        </>
      )}

      {store.error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-bad px-3 py-2 text-[13px] text-white shadow-float">{store.error}</div>
      )}
      {showSettings && <SettingsDialog settings={store.settings} onSave={s => { store.saveSettings(s); setShowSettings(false) }} onClose={() => setShowSettings(false)} />}
      {showAdd && <AddLeadDialog onAdd={l => { store.addLead(l); setShowAdd(false); setView('all'); setSelected(l.id) }} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

/** The row after `id` in the current list, for working straight through a calling block. */
function nextId(rows: { lead: Lead }[], id: string): string | null {
  const i = rows.findIndex(r => r.lead.id === id)
  return rows[i + 1]?.lead.id ?? null
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="min-w-[92px] rounded-xl border border-line bg-panel px-3.5 py-2.5 shadow-card">
      <div className={cx('tnum font-serif text-[28px] leading-none', tone)}>{value}</div>
      <div className="mt-1 text-[11.5px] text-ink-3">{label}</div>
    </div>
  )
}
