import { Star, Ban } from 'lucide-react'
import type { Lead } from '../lib/types'
import type { Scored } from '../lib/score'
import { localTime, relDay, isoDate } from '../lib/time'
import { VERTICALS } from '../lib/verticals'
import { cx, Pill, ScoreRing, StatusPill, WindowDot } from './ui'
import type { View } from '../App'

interface Props {
  rows: { lead: Lead; score: Scored }[]
  selected: string | null
  onSelect: (id: string) => void
  compact: boolean
  now: Date
  view: View
  loaded: boolean
  total: number
}

export function LeadList({ rows, selected, onSelect, compact, now, view, loaded, total }: Props) {
  if (!loaded) return <div className="px-6 text-ink-3">Loading…</div>
  if (!rows.length) {
    return (
      <div className="mx-6 mt-4 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
        <div className="font-serif text-[24px]">{total ? 'Nothing here' : 'No leads yet'}</div>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-ink-3">
          {total
            ? view === 'queue' ? 'Everyone callable has been handled. Check follow-ups or loosen the filters.' : 'Try clearing the filters.'
            : 'Add one from the sidebar, or drop researched leads into data/leads.json.'}
        </p>
      </div>
    )
  }
  const today = isoDate(now)

  return (
    <div className="scroll-thin flex-1 overflow-y-auto px-3 pb-8">
      {!compact && (
        <div className="grid grid-cols-[52px_minmax(220px,2fr)_110px_110px_minmax(170px,1.4fr)_minmax(140px,1fr)_130px] items-center gap-3 px-3 pb-2 text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          <span>Score</span><span>Company</span><span>Local time</span><span>Google</span><span>Signals</span><span>Decision maker</span><span>Status</span>
        </div>
      )}
      <div className="flex flex-col gap-1">
        {rows.map(({ lead: l, score }) => {
          const t = localTime(l.timezone, now)
          const v = VERTICALS[l.vertical]
          const due = l.followUp && l.followUp <= today && !l.dnc
          const active = selected === l.id
          return (
            <button key={l.id} onClick={() => onSelect(l.id)}
              className={cx('group w-full cursor-pointer rounded-xl border text-left transition',
                active ? 'border-ink-3/40 bg-panel shadow-card' : 'border-transparent hover:border-line hover:bg-panel',
                l.dnc && 'opacity-50')}>
              {compact ? (
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <ScoreRing score={score.total} priority={score.priority} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{l.company}</div>
                    <div className="flex items-center gap-1.5 truncate text-[12px] text-ink-3">
                      <span>{v?.emoji}</span>{l.city}, {l.region}
                      <span className="text-line">•</span>
                      <WindowDot w={t.window} /> <span className="tnum">{t.label}</span>
                    </div>
                  </div>
                  {l.dnc ? <Pill tone="bad"><Ban size={11} /> DNC</Pill> : due ? <Pill tone="warn">Due</Pill> : <StatusPill status={l.status} />}
                </div>
              ) : (
                <div className="grid grid-cols-[52px_minmax(220px,2fr)_110px_110px_minmax(170px,1.4fr)_minmax(140px,1fr)_130px] items-center gap-3 px-3 py-3">
                  <ScoreRing score={score.total} priority={score.priority} />
                  <div className="min-w-0">
                    <div className="truncate text-[14.5px] font-medium">{l.company}</div>
                    <div className="truncate text-[12.5px] text-ink-3"><span className="mr-1">{v?.emoji}</span>{v?.label} · {l.city}, {l.region}{l.country === 'CA' && ' 🇨🇦'}</div>
                  </div>
                  <div className="text-[12.5px]" title={t.hint}>
                    <div className="flex items-center gap-1.5"><WindowDot w={t.window} pulse /><span className="tnum">{t.label}</span></div>
                    <div className="text-[11.5px] text-ink-3">{t.window === 'prime' ? 'Prime time' : t.window === 'ok' ? 'Open' : t.window === 'avoid' ? 'Low odds' : 'Closed'}</div>
                  </div>
                  <div className="text-[12.5px]">
                    {l.googleRating != null ? (
                      <>
                        <div className="flex items-center gap-1"><Star size={12} className="fill-warn text-warn" /><span className="tnum font-medium">{l.googleRating.toFixed(1)}</span></div>
                        <div className="tnum text-[11.5px] text-ink-3">{l.googleReviews?.toLocaleString()} reviews</div>
                      </>
                    ) : <span className="text-ink-3">—</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {l.signals.paidAds && <Pill tone="hot">Runs ads</Pill>}
                    {l.signals.afterHoursGap && <Pill tone="accent">After-hours gap</Pill>}
                    {l.signals.emergency247 && !l.signals.afterHoursGap && <Pill>24/7</Pill>}
                    {l.signals.reviewResponseComplaints && <Pill tone="warn">Callback complaints</Pill>}
                    {score.disqualifiers.slice(0, 1).map(d => <Pill key={d} tone="bad">{d}</Pill>)}
                  </div>
                  <div className="min-w-0 text-[12.5px]">
                    {l.dmName ? (
                      <><div className="truncate font-medium">{l.dmName}</div><div className="truncate text-[11.5px] text-ink-3">{l.dmTitle}</div></>
                    ) : <span className="text-ink-3">Unknown</span>}
                  </div>
                  <div className="flex flex-col items-start gap-0.5">
                    {l.dnc ? <Pill tone="bad"><Ban size={11} /> Do not call</Pill> : <StatusPill status={l.status} />}
                    {l.followUp && !l.dnc && <span className={cx('text-[11.5px]', due ? 'font-medium text-warn' : 'text-ink-3')}>↻ {relDay(l.followUp)}</span>}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
