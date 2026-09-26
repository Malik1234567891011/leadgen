import { useEffect, useRef, useState } from 'react'
import { cx } from './ui'

/** Click-to-edit text. Commits on blur or Enter (Cmd+Enter for multiline). */
export function EditableText({ value, onSave, placeholder = 'Add…', multiline, className, mono }: {
  value: string | null; onSave: (v: string | null) => void; placeholder?: string; multiline?: boolean; className?: string; mono?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  useEffect(() => { if (!editing) setDraft(value ?? '') }, [value, editing])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const commit = () => {
    setEditing(false)
    const v = draft.trim() === '' ? null : draft.trim()
    if (v !== (value ?? null)) onSave(v)
  }
  const base = cx('w-full rounded-md px-1.5 py-0.5 -mx-1.5 text-[13px] leading-relaxed', mono && 'font-mono text-[12.5px]', className)

  if (editing) {
    const props = {
      ref, value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setDraft(value ?? ''); setEditing(false) }
        if (e.key === 'Enter' && (!multiline || e.metaKey)) { e.preventDefault(); commit() }
      },
      className: cx(base, 'bg-panel outline-none ring-2 ring-accent/30'),
    }
    return multiline ? <textarea rows={Math.max(3, draft.split('\n').length)} {...props} /> : <input {...props} />
  }
  return (
    <div onClick={() => setEditing(true)} title="Click to edit"
      className={cx(base, 'cursor-text whitespace-pre-wrap hover:bg-line-2', !value && 'text-ink-3')}>
      {value || placeholder}
    </div>
  )
}

/** Yes / No / Unknown segmented control for research signals. */
export function TriToggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean | null) => void }) {
  const opts: [boolean | null, string][] = [[true, 'Yes'], [false, 'No'], [null, '?']]
  return (
    <div className="flex shrink-0 rounded-md border border-line bg-panel p-0.5">
      {opts.map(([v, label]) => (
        <button key={label} onClick={() => onChange(v)}
          className={cx('cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium transition',
            value === v ? (v === true ? 'bg-good-soft text-good' : v === false ? 'bg-line-2 text-ink' : 'bg-line-2 text-ink-3') : 'text-ink-3 hover:text-ink')}>
          {label}
        </button>
      ))}
    </div>
  )
}
