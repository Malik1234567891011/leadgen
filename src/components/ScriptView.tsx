import { Fragment, useMemo, useState } from 'react'
import { Check, Copy, MessageCircleQuestion, Target } from 'lucide-react'
import type { Lead, Settings } from '../lib/types'
import type { Scored } from '../lib/score'
import { buildScript, type Flow, type Line, type Script } from '../lib/script'
import { cx } from './ui'

const FLOW_LABEL: Record<Flow, string> = {
  gatekeeper: 'Someone else answers',
  owner: 'Decision maker answers',
  service: 'Answering service',
  voicemail: 'Voicemail',
}

export function ScriptView({ lead, settings, score }: { lead: Lead; settings: Settings; score: Scored }) {
  const script = useMemo(() => buildScript(lead, settings, score), [lead, settings, score])
  const [flow, setFlow] = useState<Flow>(script.defaultFlow)
  const [objection, setObjection] = useState<string | null>(null)

  return (
    <div className="px-7 py-5">
      <Prep script={script} />

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_280px] gap-6">
        <div className="min-w-0">
          {/* Flow picker */}
          <div className="sticky top-0 z-10 -mx-1 bg-panel/90 px-1 pt-1 pb-3 backdrop-blur">
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Who picked up?</div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(FLOW_LABEL) as Flow[]).map(f => (
                <button key={f} onClick={() => setFlow(f)}
                  className={cx('cursor-pointer rounded-full border px-3 py-1 text-[12.5px] font-medium transition',
                    flow === f ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2 hover:border-ink-3/60 hover:text-ink')}>
                  {FLOW_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <ol className="mt-3 space-y-7">
            {script.flows[flow].map((step, i) => (
              <li key={step.id} className="grid grid-cols-[28px_1fr] gap-3">
                <div className="tnum grid h-7 w-7 place-items-center rounded-full border border-line text-[12px] font-semibold text-ink-2">{i + 1}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h4 className="text-[14px] font-semibold">{step.title}</h4>
                    {step.goal && <span className="text-[12px] text-ink-3">{step.goal}</span>}
                  </div>
                  <div className="mt-2"><Lines lines={step.lines} /></div>
                  {step.branches && (
                    <div className="mt-3 space-y-1.5">
                      {step.branches.map(b => (
                        <details key={b.if} className="group rounded-xl border border-line bg-panel-2 open:bg-panel">
                          <summary className="cursor-pointer list-none px-3.5 py-2 text-[12.5px] text-ink-2 select-none marker:hidden hover:text-ink">
                            <span className="mr-1.5 inline-block text-ink-3 transition group-open:rotate-90">›</span>
                            If {b.if}
                          </summary>
                          <div className="px-3.5 pb-3"><Lines lines={b.lines} /></div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {script.email && <EmailCard email={script.email} />}
        </div>

        {/* Objection rail */}
        <aside className="self-start sticky top-0 max-h-[calc(100vh-260px)] overflow-y-auto scroll-thin">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">
            <MessageCircleQuestion size={12} /> They say…
          </div>
          <div className="space-y-1">
            {script.objections.map(o => {
              const open = objection === o.id
              return (
                <div key={o.id} className={cx('rounded-xl border transition', open ? 'border-hot/40 bg-hot-soft/50' : 'border-transparent hover:border-line')}>
                  <button onClick={() => setObjection(open ? null : o.id)}
                    className={cx('w-full cursor-pointer px-3 py-1.5 text-left text-[13px]', open ? 'font-medium text-hot' : 'text-ink-2 hover:text-ink')}>
                    “{o.they}”
                  </button>
                  {open && (
                    <div className="anim-pop px-3 pb-3">
                      <Lines lines={o.lines} small />
                      {o.why && <div className="mt-2 text-[11.5px] leading-snug text-ink-3">Why: {o.why}</div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Prep({ script }: { script: Script }) {
  const p = script.prep
  const [more, setMore] = useState(false)
  return (
    <div className="rounded-2xl bg-accent-soft px-5 py-4">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-accent uppercase"><Target size={12} /> Before you dial</div>
          <div className="mt-1.5 text-[14px] leading-snug">
            Ask for <span className="font-semibold">{p.askFor}</span>{p.askForTitle && <span className="text-ink-2"> · {p.askForTitle}</span>}
            <span className="text-ink-2"> — {p.goal}</span>
          </div>
          <div className="mt-2 font-serif text-[21px] leading-snug italic">“{p.keyQuestion}”</div>
        </div>
        <button onClick={() => setMore(m => !m)} className="shrink-0 cursor-pointer rounded-lg border border-accent/25 px-2.5 py-1 text-[12px] font-medium text-accent hover:bg-panel/50">
          {more ? 'Hide notes' : `What you know · ${p.facts.length + p.watchOut.length}`}
        </button>
      </div>
      {more && (
        <div className="anim-pop mt-4 grid grid-cols-2 gap-6 border-t border-accent/20 pt-3">
          <ul className="space-y-1.5 text-[13px] leading-snug">
            {p.facts.map(f => <li key={f} className="flex gap-2"><span className="text-accent">•</span><span>{f}</span></li>)}
          </ul>
          {p.watchOut.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Careful</div>
              <ul className="mt-1 space-y-1.5 text-[12.5px] leading-snug text-ink-2">
                {p.watchOut.map(f => <li key={f}>– {f}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** [[text]] marks a lead-specific fill so you can see what's personalized. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[.+?\]\])/g)
  return (
    <>
      {parts.map((p, i) => p.startsWith('[[')
        ? <mark key={i} className="rounded bg-transparent px-0 text-inherit underline decoration-accent/50 decoration-2 underline-offset-[3px]">{p.slice(2, -2)}</mark>
        : <Fragment key={i}>{p}</Fragment>)}
    </>
  )
}

function Lines({ lines, small }: { lines: Line[]; small?: boolean }) {
  return (
    <div className="space-y-2">
      {lines.map((l, i) => {
        if (l.kind === 'say') return <p key={i} className={cx('leading-relaxed text-ink', small ? 'text-[13.5px]' : 'text-[15.5px]')}><Rich text={l.text} /></p>
        if (l.kind === 'them') return <p key={i} className="border-l-2 border-line pl-3 text-[13px] text-ink-3 italic">They: <Rich text={l.text} /></p>
        if (l.kind === 'pause') return <p key={i} className="text-[12px] font-medium tracking-wide text-accent uppercase">— {l.text} —</p>
        return <p key={i} className="text-[12.5px] leading-snug text-ink-3"><Rich text={l.text} /></p>
      })}
    </div>
  )
}

function EmailCard({ email }: { email: { subject: string; body: string } }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="mt-10 rounded-2xl border border-line">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <div className="text-[13px] font-semibold">If they say “send me something”</div>
          <div className="text-[12px] text-ink-3">Send within the hour. Short, plain text, no attachments.</div>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`); setCopied(true); setTimeout(() => setCopied(false), 1200) }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12.5px] text-ink-2 hover:text-ink">
          {copied ? <Check size={13} /> : <Copy size={13} />} Copy
        </button>
      </div>
      <div className="px-5 py-4 text-[13.5px] leading-relaxed">
        <div className="mb-2 text-ink-3">Subject: <span className="text-ink">{email.subject}</span></div>
        <div className="whitespace-pre-wrap">{email.body}</div>
      </div>
    </div>
  )
}
