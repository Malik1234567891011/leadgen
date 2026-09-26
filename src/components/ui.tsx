import type { ReactNode } from 'react'
import type { CallStatus } from '../lib/types'
import type { Priority } from '../lib/score'
import type { Window } from '../lib/time'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const STATUS_META: Record<CallStatus, { label: string; tone: Tone }> = {
  new: { label: 'Not called', tone: 'neutral' },
  'no-answer': { label: 'No answer', tone: 'neutral' },
  voicemail: { label: 'Left voicemail', tone: 'blue' },
  gatekeeper: { label: 'Gatekeeper', tone: 'blue' },
  callback: { label: 'Call back', tone: 'warn' },
  conversation: { label: 'Had conversation', tone: 'accent' },
  meeting: { label: 'Meeting booked', tone: 'good' },
  'not-interested': { label: 'Not interested', tone: 'bad' },
  disqualified: { label: 'Disqualified', tone: 'bad' },
}

type Tone = 'neutral' | 'accent' | 'good' | 'warn' | 'bad' | 'blue' | 'hot'

const TONES: Record<Tone, string> = {
  neutral: 'bg-line-2 text-ink-2',
  accent: 'bg-accent-soft text-accent',
  good: 'bg-good-soft text-good',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
  blue: 'bg-blue-soft text-blue',
  hot: 'bg-hot-soft text-hot',
}

export function Pill({ tone = 'neutral', children, className, title }: { tone?: Tone; children: ReactNode; className?: string; title?: string }) {
  return (
    <span title={title} className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium', TONES[tone], className)}>
      {children}
    </span>
  )
}

export function StatusPill({ status }: { status: CallStatus }) {
  const m = STATUS_META[status]
  return <Pill tone={m.tone}>{m.label}</Pill>
}

export const PRIORITY_TONE: Record<Priority, Tone> = { 'call-first': 'hot', 'very-good': 'accent', backlog: 'warn', skip: 'neutral' }

const RING: Record<Priority, string> = { 'call-first': 'var(--hot)', 'very-good': 'var(--accent)', backlog: 'var(--warn)', skip: 'var(--ink-3)' }

export function ScoreRing({ score, priority, size = 40 }: { score: number; priority: Priority; size?: number }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={RING[priority]} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`} style={{ transition: 'stroke-dasharray .4s ease' }} />
      </svg>
      <span className="tnum absolute inset-0 grid place-items-center font-semibold" style={{ fontSize: size * 0.33 }}>{score}</span>
    </div>
  )
}

const WINDOW_COLOR: Record<Window, string> = { prime: 'bg-good', ok: 'bg-warn', avoid: 'bg-hot', closed: 'bg-ink-3/50' }

export function WindowDot({ w, pulse }: { w: Window; pulse?: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && w === 'prime' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-50" />}
      <span className={cx('relative inline-flex h-2 w-2 rounded-full', WINDOW_COLOR[w])} />
    </span>
  )
}

export function Button({ children, onClick, variant = 'ghost', className, title, disabled, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'outline' | 'danger'; className?: string; title?: string; disabled?: boolean; type?: 'button' | 'submit'
}) {
  const v = {
    primary: 'bg-ink text-bg hover:opacity-90',
    ghost: 'text-ink-2 hover:bg-line-2 hover:text-ink',
    outline: 'border border-line bg-panel text-ink hover:border-ink-3/60',
    danger: 'border border-line bg-panel text-bad hover:bg-bad-soft',
  }[variant]
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={cx('inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40', v, className)}>
      {children}
    </button>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-panel-2 px-1 font-mono text-[10.5px] text-ink-3">{children}</kbd>
}
