import { useState } from 'react'
import { X } from 'lucide-react'
import type { Lead, Settings, Vertical } from '../lib/types'
import { VERTICALS } from '../lib/verticals'
import { blankLead } from '../lib/store'
import { Button } from './ui'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="anim-fade fixed inset-0 z-50 grid place-items-center bg-ink/20 p-4 backdrop-blur-[2px]" onMouseDown={onClose}>
      <div className="anim-pop w-full max-w-lg rounded-2xl border border-line bg-panel p-6 shadow-float" onMouseDown={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-[26px] leading-none">{title}</h2>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-ink-3 hover:bg-line-2"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const input = 'w-full rounded-lg border border-line bg-panel-2 px-3 py-2 text-[13.5px] outline-none focus:border-ink-3/60'

function Label({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[12.5px] font-medium">{label}</div>
      {children}
      {hint && <div className="mt-1 text-[11.5px] text-ink-3">{hint}</div>}
    </label>
  )
}

export function SettingsDialog({ settings, onSave, onClose }: { settings: Settings; onSave: (s: Settings) => void; onClose: () => void }) {
  const [s, setS] = useState(settings)
  return (
    <Modal title="Settings" onClose={onClose}>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(s) }}>
        <Label label="Your name"><input className={input} value={s.callerName} onChange={e => setS({ ...s, callerName: e.target.value })} /></Label>
        <Label label="Company name" hint="Said in every opener. Leave blank until you've picked one — the script will say “I run a small company”.">
          <input className={input} value={s.companyName} onChange={e => setS({ ...s, companyName: e.target.value })} />
        </Label>
        <Label label="Your callback number" hint="Read out in voicemails.">
          <input className={input} value={s.callerPhone} onChange={e => setS({ ...s, callerPhone: e.target.value })} placeholder="(555) 555-0100" />
        </Label>
        <Label label="What you do, in one breath" hint="Finishes the sentence “Basically, …”. Keep it about their calls, not your tech — owners have heard “AI receptionist” pitches all week.">
          <textarea rows={3} className={input} value={s.oneLiner} onChange={e => setS({ ...s, oneLiner: e.target.value })}
            placeholder="making sure those calls get answered or texted back right away, the real ones get booked, and nobody goes cold" />
        </Label>
        <Label label="Price range, as you'd say it" hint="Answer “how much?” honestly — dodging reads as slippery to owners.">
          <input className={input} value={s.priceRange} onChange={e => setS({ ...s, priceRange: e.target.value })} placeholder="two to five thousand" />
        </Label>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  )
}

const TZ: [string, string][] = [
  ['America/New_York', 'Eastern'], ['America/Chicago', 'Central'], ['America/Denver', 'Mountain'],
  ['America/Phoenix', 'Arizona'], ['America/Los_Angeles', 'Pacific'], ['America/Anchorage', 'Alaska'],
  ['Pacific/Honolulu', 'Hawaii'], ['America/Halifax', 'Atlantic'], ['America/St_Johns', 'Newfoundland'],
]

const STATE_TZ: Record<string, string> = Object.fromEntries([
  ...'CT DE DC FL GA ME MD MA MI NH NJ NY NC OH PA RI SC VT VA WV IN KY ON QC'.split(' ').map(s => [s, 'America/New_York']),
  ...'AL AR IL IA LA MN MS MO OK WI TX TN KS NE SD ND MB SK'.split(' ').map(s => [s, 'America/Chicago']),
  ...'CO MT NM UT WY ID AB'.split(' ').map(s => [s, 'America/Denver']),
  ['AZ', 'America/Phoenix'],
  ...'CA WA OR NV BC'.split(' ').map(s => [s, 'America/Los_Angeles']),
  ['AK', 'America/Anchorage'], ['HI', 'Pacific/Honolulu'],
  ...'NS NB PE'.split(' ').map(s => [s, 'America/Halifax']), ['NL', 'America/St_Johns'],
])
const CA_PROVINCES = new Set('ON QC BC AB MB SK NS NB PE NL'.split(' '))

export function AddLeadDialog({ onAdd, onClose }: { onAdd: (l: Lead) => void; onClose: () => void }) {
  const [f, setF] = useState({ company: '', website: '', vertical: 'hvac' as Vertical, city: '', region: '', phone: '', timezone: 'America/New_York' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.value
    setF(prev => {
      const next = { ...prev, [k]: v }
      if (k === 'region') {
        const r = v.toUpperCase()
        next.region = r
        if (STATE_TZ[r]) next.timezone = STATE_TZ[r]
      }
      return next
    })
  }
  const ok = f.company && f.city && f.region && f.phone
  return (
    <Modal title="Add a lead" onClose={onClose}>
      <form className="space-y-3" onSubmit={e => {
        e.preventDefault()
        if (!ok) return
        const country = CA_PROVINCES.has(f.region) ? 'CA' : 'US'
        onAdd(blankLead({ ...f, website: f.website && !f.website.startsWith('http') ? 'https://' + f.website : f.website, country }))
      }}>
        <Label label="Company"><input autoFocus className={input} value={f.company} onChange={set('company')} /></Label>
        <div className="grid grid-cols-2 gap-3">
          <Label label="Website"><input className={input} value={f.website} onChange={set('website')} placeholder="example.com" /></Label>
          <Label label="Trade">
            <select className={input} value={f.vertical} onChange={set('vertical')}>
              {(['S', 'A', 'B'] as const).map(t => (
                <optgroup key={t} label={`${t}-tier`}>
                  {Object.entries(VERTICALS).filter(([, v]) => v.tier === t).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </optgroup>
              ))}
            </select>
          </Label>
        </div>
        <div className="grid grid-cols-[1fr_90px_1fr] gap-3">
          <Label label="City"><input className={input} value={f.city} onChange={set('city')} /></Label>
          <Label label="State / prov."><input className={input} value={f.region} onChange={set('region')} maxLength={2} placeholder="TX" /></Label>
          <Label label="Time zone">
            <select className={input} value={f.timezone} onChange={set('timezone')}>
              {TZ.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Label>
        </div>
        <Label label="Main business phone" hint="From the official website. Record the source in Research after adding.">
          <input className={input} value={f.phone} onChange={set('phone')} placeholder="(555) 555-0100" />
        </Label>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={!ok}>Add lead</Button>
        </div>
      </form>
    </Modal>
  )
}
