import { useState } from 'react'
import { Ban, Check, Copy, ExternalLink, Globe, Phone, X } from 'lucide-react'
import type { CallStatus, Lead, Signals } from '../lib/types'
import type { Scored } from '../lib/score'
import { PRIORITY_META } from '../lib/score'
import type { Store } from '../lib/store'
import { addBusinessDays, cadenceFollowUp, localTime, relDay, tzShort } from '../lib/time'
import { attempts } from '../lib/script'
import { VERTICALS } from '../lib/verticals'
import { Button, cx, LinkedInPill, Pill, PRIORITY_TONE, ScoreRing, STATUS_META, StatusPill, WindowDot } from './ui'
import { EditableText, TriToggle } from './Editable'
import { ScriptView } from './ScriptView'

type Tab = 'script' | 'research' | 'activity'

export function LeadPanel({ lead: l, score, store, now, onClose, onNext }: { lead: Lead; score: Scored; store: Store; now: Date; onClose: () => void; onNext?: () => void }) {
  const [tab, setTab] = useState<Tab>('script')
  const [copied, setCopied] = useState(false)
  const t = localTime(l.timezone, now)
  const v = VERTICALS[l.vertical]
  const patch = (p: Partial<Lead>) => store.patchLead(l.id, p)
  const blocked = l.dnc || (l.country === 'CA' && !l.canadaCallReady)

  const copy = () => {
    navigator.clipboard.writeText(l.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <section className="anim-slide flex min-w-0 flex-1 flex-col bg-panel">
      {/* Header */}
      <div className="border-b border-line px-7 pt-5 pb-0">
        <div className="flex items-start gap-4">
          <ScoreRing score={score.total} priority={score.priority} size={54} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Pill tone={PRIORITY_TONE[score.priority]}>{PRIORITY_META[score.priority].label}</Pill>
              <span className="text-[12.5px] text-ink-3">{v?.emoji} {v?.label} · {v?.tier}-tier</span>
            </div>
            <h2 className="mt-1 truncate font-serif text-[32px] leading-[1.1] tracking-tight">{l.company}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-2">
              <span>{l.city}, {l.region}{l.country === 'CA' ? ', Canada' : ''}</span>
              <span className="flex items-center gap-1.5" title={t.hint}><WindowDot w={t.window} pulse /><span className="tnum">{t.label} {tzShort(l.timezone)}</span><span className="text-ink-3">· {t.hint}</span></span>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-ink-3 hover:bg-line-2 hover:text-ink" title="Close (esc)"><X size={18} /></button>
        </div>

        {/* Phone strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {blocked ? (
            <div className="flex items-center gap-2 rounded-xl bg-bad-soft px-4 py-2.5 text-[14px] font-medium text-bad">
              <Ban size={16} /> {l.dnc ? 'Do not call — they asked to be removed' : 'Canada — hold until CRTC telemarketing registration is done'}
            </div>
          ) : (
            <a href={`tel:${l.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-bg transition hover:opacity-90">
              <Phone size={16} /> <span className="tnum text-[17px] font-semibold tracking-wide">{l.phone}</span>
            </a>
          )}
          <Button variant="outline" onClick={copy} title="Copy number">{copied ? <Check size={14} /> : <Copy size={14} />}</Button>
          <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-ink-2 hover:text-ink">
            <Globe size={14} /> Website
          </a>
          {l.linkedin?.url && (
            <a href={l.linkedin.url} target="_blank" rel="noreferrer" title={l.linkedin.note}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-ink-2 hover:text-ink">
              <LinkedInPill li={l.linkedin} /> {l.linkedin.status === 'sent' || l.linkedin.status === 'connected' ? '' : 'LinkedIn'}
            </a>
          )}
          <div className="ml-auto text-right text-[12px] leading-snug text-ink-3">
            <div>{l.phoneSource ?? 'Phone source not recorded'}</div>
            {l.directLine && <div className="text-ink-2">Direct: <span className="tnum font-medium">{l.directLine}</span> ({l.directLineSource})</div>}
          </div>
        </div>

        <div className="mt-4 flex gap-5 text-[13.5px]">
          {(['script', 'research', 'activity'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={cx('-mb-px cursor-pointer border-b-2 pb-2.5 capitalize transition', tab === k ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-3 hover:text-ink')}>
              {k === 'script' ? 'Call script' : k === 'research' ? 'Research & score' : `Activity${l.activity.length ? ` · ${l.activity.length}` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="scroll-thin flex-1 overflow-y-auto">
        {tab === 'script' && <ScriptView lead={l} settings={store.settings} score={score} />}
        {tab === 'research' && <Research lead={l} score={score} patch={patch} onDelete={() => { store.deleteLead(l.id); onClose() }} />}
        {tab === 'activity' && <ActivityTab lead={l} patch={patch} />}
      </div>

      {!blocked && <OutcomeBar lead={l} patch={patch} onNext={onNext} />}
      {l.dnc && (
        <div className="border-t border-line px-7 py-3 text-[12.5px] text-ink-3">
          Marked do-not-call. <button className="cursor-pointer underline" onClick={() => patch({ dnc: false })}>Undo</button> only if this was a mistake.
        </div>
      )}
    </section>
  )
}

/* ---------------------------------------------------------------- outcome */

// 'cadence' = next slot in the 5-attempt sequence; a number = business days; null = no follow-up.
const OUTCOMES: { status: CallStatus; label: string; follow: 'cadence' | number | null }[] = [
  { status: 'no-answer', label: 'No answer', follow: 'cadence' },
  { status: 'voicemail', label: 'Voicemail', follow: 'cadence' },
  { status: 'gatekeeper', label: 'Gatekeeper', follow: 1 },
  { status: 'callback', label: 'Call back', follow: 1 },
  { status: 'conversation', label: 'Conversation', follow: 3 },
  { status: 'meeting', label: 'Meeting booked', follow: null },
  { status: 'not-interested', label: 'Not interested', follow: null },
]

function OutcomeBar({ lead: l, patch, onNext }: { lead: Lead; patch: (p: Partial<Lead>) => void; onNext?: () => void }) {
  const [note, setNote] = useState('')
  const [flash, setFlash] = useState<string | null>(null)

  const log = (status: CallStatus, follow: 'cadence' | number | null) => {
    const at = new Date().toISOString()
    const followUp = follow === 'cadence' ? cadenceFollowUp(attempts(l) + 1) : follow == null ? null : addBusinessDays(follow)
    patch({ status, lastContact: at, followUp, activity: [...l.activity, { at, outcome: status, note: note.trim() || undefined }] })
    setNote('')
    setFlash(`Logged “${STATUS_META[status].label}”${followUp ? ` · follow up ${relDay(followUp).toLowerCase()}` : ''}`)
    setTimeout(() => setFlash(null), 6000)
  }
  const dnc = () => {
    const at = new Date().toISOString()
    patch({ dnc: true, followUp: null, lastContact: at, activity: [...l.activity, { at, outcome: 'note', note: `Asked not to be called again.${note.trim() ? ' ' + note.trim() : ''}` }] })
    setNote('')
  }

  return (
    <div className="border-t border-line bg-panel-2 px-7 py-3">
      <div className="flex items-center gap-2">
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Quick note for this call (optional)…"
          className="flex-1 rounded-lg border border-line bg-panel px-3 py-1.5 text-[13px] outline-none placeholder:text-ink-3 focus:border-ink-3/60" />
        {flash && <span className="anim-fade text-[12.5px] font-medium text-good">{flash}</span>}
        {flash && onNext && (
          <button onClick={onNext} className="anim-fade cursor-pointer rounded-lg bg-ink px-3 py-1.5 text-[12.5px] font-medium text-bg hover:opacity-90">
            Next lead →
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11.5px] font-medium tracking-wide text-ink-3 uppercase">Log attempt {attempts(l) + 1}</span>
        {OUTCOMES.map(o => (
          <button key={o.status} onClick={() => log(o.status, o.follow)}
            className={cx('cursor-pointer rounded-lg border px-2.5 py-1 text-[12.5px] font-medium transition',
              o.status === 'meeting' ? 'border-good/30 bg-good-soft text-good hover:border-good/60'
                : 'border-line bg-panel text-ink-2 hover:border-ink-3/60 hover:text-ink')}>
            {o.label}
          </button>
        ))}
        <button onClick={dnc} className="ml-auto cursor-pointer rounded-lg border border-line bg-panel px-2.5 py-1 text-[12.5px] font-medium text-bad hover:bg-bad-soft">
          <Ban size={12} className="mr-1 inline" />Do not call
        </button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- research */

const SIGNAL_GROUPS: { title: string; keys: [keyof Signals, string][] }[] = [
  { title: 'Demand', keys: [['paidAds', 'Visible paid ads'], ['recentReviews', 'Several recent reviews'], ['multipleServiceAreas', 'Multiple service areas / crews'], ['freeEstimate', 'Free estimate / booking funnel'], ['financing', 'Financing offered']] },
  { title: 'Recovery opportunity', keys: [['emergency247', '24/7 / emergency offering'], ['phonePrimaryCta', 'Phone is primary CTA'], ['afterHoursGap', 'Possible after-hours gap'], ['onlineBooking', 'Instant online booking'], ['chatOrText', 'Chat / text / AI on site'], ['reviewResponseComplaints', 'Reviews mention slow callbacks']] },
  { title: 'Fit & contact', keys: [['residential', 'Residential'], ['locallyOwned', 'Local / family / founder owned'], ['franchise', 'Franchise'], ['sophisticatedContactCenter', 'Already has 24/7 contact center'], ['phoneMatchesGoogle', 'Phone matches Google profile']] },
]

function Research({ lead: l, score, patch, onDelete }: { lead: Lead; score: Scored; patch: (p: Partial<Lead>) => void; onDelete: () => void }) {
  const num = (v: string | null) => (v == null || isNaN(Number(v)) ? null : Number(v))
  return (
    <div className="space-y-8 px-7 py-6">
      {l.opportunity && (
        <div className="rounded-2xl bg-accent-soft px-5 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-accent uppercase">The opportunity</div>
          <EditableText value={l.opportunity} onSave={v => patch({ opportunity: v })} multiline className="mt-1 text-[14.5px] text-ink" />
        </div>
      )}

      {score.disqualifiers.length > 0 && (
        <div className="rounded-xl border border-bad/30 bg-bad-soft px-4 py-3 text-[13px] text-bad">
          <span className="font-semibold">Disqualified:</span> {score.disqualifiers.join(' · ')}
        </div>
      )}

      {/* Score breakdown */}
      <Section title={`Score · ${score.total}/100`}>
        <div className="grid grid-cols-5 gap-2">
          {score.groups.map(g => (
            <div key={g.key} className="rounded-xl border border-line p-3">
              <div className="text-[11.5px] leading-tight text-ink-3">{g.label}</div>
              <div className="tnum mt-1 font-serif text-[24px] leading-none">{g.points}<span className="text-[14px] text-ink-3">/{g.max}</span></div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-line-2"><div className="h-full rounded-full bg-accent" style={{ width: `${(g.points / g.max) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="mt-3 columns-2 gap-x-6 [&>*]:mb-1">
          {score.groups.flatMap(g => g.items).map(i => (
            <div key={i.label} className="flex items-center justify-between text-[12.5px]">
              <span className={i.points ? 'text-ink' : 'text-ink-3'}>{i.points ? '✓' : '·'} {i.label}</span>
              <span className="tnum text-ink-3">{i.points}/{i.max}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Signals" hint="Toggle to correct the research — the score updates live.">
        <div className="grid grid-cols-3 gap-4">
          {SIGNAL_GROUPS.map(g => (
            <div key={g.title}>
              <div className="mb-1.5 text-[11.5px] font-medium text-ink-3">{g.title}</div>
              <div className="space-y-1.5">
                {g.keys.map(([k, label]) => (
                  <div key={k} className="flex items-center justify-between gap-2 text-[12.5px]">
                    <span className="text-ink-2">{label}</span>
                    <TriToggle value={l.signals[k]} onChange={v => patch({ signals: { [k]: v } as unknown as Signals })} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Business">
        <Fields rows={[
          ['Published hours', <EditableText value={l.hours} onSave={v => patch({ hours: v })} />],
          ['Hours source', <EditableText value={l.hoursSource} onSave={v => patch({ hoursSource: v })} />],
          ['Main phone', <EditableText value={l.phone} onSave={v => patch({ phone: v ?? '' })} mono />],
          ['Phone source', <EditableText value={l.phoneSource} onSave={v => patch({ phoneSource: v })} />],
          ['Google rating', <EditableText value={l.googleRating?.toString() ?? null} onSave={v => patch({ googleRating: num(v) })} />],
          ['Google reviews', <EditableText value={l.googleReviews?.toString() ?? null} onSave={v => patch({ googleReviews: num(v) })} />],
          ['Latest review', <EditableText value={l.latestReviewAge} onSave={v => patch({ latestReviewAge: v })} />],
          ['Paid ads', <EditableText value={l.paidAdsNote} onSave={v => patch({ paidAdsNote: v })} />],
          ['Employees', <EditableText value={l.employeesEstimate} onSave={v => patch({ employeesEstimate: v })} />],
          ['Size band', (
            <select value={l.employeeBand} onChange={e => patch({ employeeBand: e.target.value as Lead['employeeBand'] })}
              className="-mx-1.5 cursor-pointer rounded-md bg-transparent px-1 py-0.5 text-[13px] outline-none hover:bg-line-2">
              {['unknown', '1-2', '3-4', '5-15', '16-50', '51-100', '101-250', '250+'].map(b => <option key={b}>{b}</option>)}
            </select>
          )],
          ['Locations', <EditableText value={l.locations?.toString() ?? null} onSave={v => patch({ locations: num(v) })} />],
          ['Ownership', <EditableText value={l.ownershipNote} onSave={v => patch({ ownershipNote: v })} />],
          ['Existing tools', <EditableText value={l.existingTools} onSave={v => patch({ existingTools: v })} />],
          ['Review complaint', <EditableText value={l.reviewComplaintQuote} onSave={v => patch({ reviewComplaintQuote: v })} multiline />],
        ]} />
      </Section>

      <Section title="Decision maker">
        <Fields rows={[
          ['Name', <EditableText value={l.dmName} onSave={v => patch({ dmName: v })} />],
          ['Title', <EditableText value={l.dmTitle} onSave={v => patch({ dmTitle: v })} />],
          ['Source', <EditableText value={l.dmSource} onSave={v => patch({ dmSource: v })} />],
          ['Direct line', <EditableText value={l.directLine} onSave={v => patch({ directLine: v })} mono placeholder="Only if the company publishes it" />],
          ['Direct line source', <EditableText value={l.directLineSource} onSave={v => patch({ directLineSource: v })} />],
          ['LinkedIn', (
            <div className="flex items-center gap-2 py-0.5 text-[13px]">
              <select value={l.linkedin?.status ?? ''} onChange={e => patch({ linkedin: e.target.value ? { url: l.linkedin?.url ?? null, at: new Date().toISOString(), note: l.linkedin?.note, status: e.target.value as NonNullable<Lead['linkedin']>['status'] } : undefined })}
                className="-mx-1.5 cursor-pointer rounded-md bg-transparent px-1 py-0.5 outline-none hover:bg-line-2">
                <option value="">Not looked up</option>
                <option value="sent">Invite sent</option>
                <option value="connected">Connected</option>
                <option value="not-found">No confident match</option>
                <option value="skipped">Skipped</option>
              </select>
              {l.linkedin?.at && <span className="text-[12px] text-ink-3">{new Date(l.linkedin.at).toLocaleDateString()}</span>}
              {l.linkedin?.note && <span className="truncate text-[12px] text-ink-3" title={l.linkedin.note}>· {l.linkedin.note}</span>}
            </div>
          )],
        ]} />
      </Section>

      <Section title="Talking points" hint="One per line. These feed the script.">
        <EditableText value={l.hooks.join('\n') || null} onSave={v => patch({ hooks: v ? v.split('\n').map(s => s.trim()).filter(Boolean) : [] })} multiline />
        {!l.opportunity && (
          <div className="mt-3">
            <div className="mb-1 text-[11.5px] font-medium text-ink-3">Specific opportunity</div>
            <EditableText value={l.opportunity} onSave={v => patch({ opportunity: v })} multiline />
          </div>
        )}
      </Section>

      {l.sources.length > 0 && (
        <Section title="Sources">
          <div className="flex flex-wrap gap-1.5">
            {l.sources.map(s => (
              <a key={s.url + s.label} href={s.url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-[12px] text-ink-2 hover:text-ink">
                {s.label} <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </Section>
      )}

      <Section title="Research notes">
        <EditableText value={l.researchNotes} onSave={v => patch({ researchNotes: v })} multiline />
        {l.researchedAt && <div className="mt-2 text-[11.5px] text-ink-3">Researched {new Date(l.researchedAt).toLocaleDateString()}</div>}
      </Section>

      <div className="flex items-center justify-between border-t border-line pt-4">
        {l.country === 'CA' ? (
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-2">
            <input type="checkbox" checked={l.canadaCallReady} onChange={e => patch({ canadaCallReady: e.target.checked })} />
            Canada call-ready (CRTC registration done)
          </label>
        ) : <span />}
        <Button variant="danger" onClick={() => { if (confirmDelete()) onDelete() }}>Delete lead</Button>
      </div>
    </div>
  )
}

// Two-click delete without a browser dialog.
let armed = 0
function confirmDelete() {
  const now = Date.now()
  if (now - armed < 2500) return true
  armed = now
  return false
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="text-[13px] font-semibold">{title}</h3>
        {hint && <span className="text-[12px] text-ink-3">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function Fields({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <div className="py-0.5 text-[12.5px] text-ink-3">{k}</div>
          <div className="min-w-0">{v}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- activity */

function ActivityTab({ lead: l, patch }: { lead: Lead; patch: (p: Partial<Lead>) => void }) {
  return (
    <div className="space-y-8 px-7 py-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line p-3">
          <div className="text-[11.5px] text-ink-3">Status</div>
          <select value={l.status} onChange={e => patch({ status: e.target.value as CallStatus })}
            className="mt-1 w-full cursor-pointer bg-transparent text-[14px] font-medium outline-none">
            {Object.entries(STATUS_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
          </select>
        </div>
        <div className="rounded-xl border border-line p-3">
          <div className="text-[11.5px] text-ink-3">Follow-up date</div>
          <input type="date" value={l.followUp ?? ''} onChange={e => patch({ followUp: e.target.value || null })}
            className="mt-1 w-full bg-transparent text-[14px] font-medium outline-none" />
        </div>
        <div className="rounded-xl border border-line p-3">
          <div className="text-[11.5px] text-ink-3">Last contact</div>
          <div className="mt-1 text-[14px] font-medium">{l.lastContact ? new Date(l.lastContact).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</div>
        </div>
      </div>

      <Section title="Notes">
        <EditableText value={l.notes || null} onSave={v => patch({ notes: v ?? '' })} multiline placeholder="What did you learn? Who answered? What happens to their after-hours calls?" />
      </Section>

      <Section title="Timeline">
        {l.activity.length === 0 ? (
          <div className="text-[13px] text-ink-3">No calls logged yet. Use the bar below after each dial.</div>
        ) : (
          <ol className="relative ml-2 space-y-4 border-l border-line pl-5">
            {[...l.activity].reverse().map((a, i) => (
              <li key={i} className="relative">
                <span className="absolute top-1.5 -left-[25px] h-2 w-2 rounded-full bg-ink-3" />
                <div className="flex items-center gap-2">
                  {a.outcome === 'note' ? <Pill>Note</Pill> : <StatusPill status={a.outcome} />}
                  <span className="text-[12px] text-ink-3">{new Date(a.at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                {a.note && <p className="mt-1 text-[13px] text-ink-2">{a.note}</p>}
              </li>
            ))}
          </ol>
        )}
      </Section>
    </div>
  )
}
