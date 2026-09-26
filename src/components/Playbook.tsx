import type { ReactNode } from 'react'
import type { Settings } from '../lib/types'
import { cx } from './ui'

/** The rules behind every script. Full sourced research: docs/research/cold-calling.md */
export function Playbook({ settings }: { settings: Settings }) {
  const missing = [!settings.companyName && 'company name', !settings.callerPhone && 'callback number'].filter(Boolean)
  return (
    <main className="scroll-thin flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[920px] px-8 py-10">
        <div className="text-[13px] text-ink-3">Before the first dial</div>
        <h1 className="font-serif text-[46px] leading-[1.05] tracking-tight">The playbook</h1>
        <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed text-ink-2">
          Every lead's script is built from these rules. You're not selling on the call. You're sorting: find out what happens to their missed
          and after-hours calls, and book 15 minutes with the ones who have a gap.
        </p>
        {missing.length > 0 && (
          <div className="mt-5 rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-[13px] text-warn">
            Set your {missing.join(' and ')} in Settings. The scripts say them out loud.
          </div>
        )}

        <H>Six rules</H>
        <div className="grid grid-cols-3 gap-3">
          <Rule n="1" title="Own the cold call" stat="11.2% vs 2.2%">
            "I'll be upfront: this is a cold call. Can I take 30 seconds…" Permission-based openers beat "did I catch you at a bad time?" by about 5× across Gong's 300M calls.
          </Rule>
          <Rule n="2" title="Their problem, not your product" stat="16% vs 5.5%">
            Problem language wins and buzzwords lose. Say "calls that come in when everyone's on a job", never "AI platform".
          </Rule>
          <Rule n="3" title="Ask, never assert" stat="0 assumptions">
            You don't know they miss calls. Hedge with "I've got no idea if that's you" and then ask what happens at 9 p.m.
          </Rule>
          <Rule n="4" title="1–3 easy questions" stat="no Δ by count">
            Asking more questions doesn't win more calls. Use multiple choice they can answer from a truck: "voicemail, a service, or someone's cell?"
          </Rule>
          <Rule n="5" title="Two specific times" stat="“calendar handy?”">
            Get the nod first, then offer 7:15 before they roll out or 4:30 end of day. Send the invite while they're on the line.
          </Rule>
          <Rule n="6" title="“Take me off” = done" stat="same call">
            No rebuttal, ever. Hit Do not call before the next dial. That's the law and it's decent.
          </Rule>
        </div>

        <H>When to dial <Sub>(their local time)</Sub></H>
        <div className="overflow-hidden rounded-2xl border border-line">
          <Row k="7:00 – 8:15" v="Owners, before crews roll. The best block." tone="good" extra="Before 8 only if it's clearly a business line." />
          <Row k="10:00 – 11:30" v="Office staff, CSRs, GMs at 20–50 person shops." tone="warn" />
          <Row k="4:00 – 5:30" v="Owners heading back, reviewing tomorrow's schedule." tone="good" />
          <Row k="Avoid" v="Monday before 10 (dispatch chaos), Friday after 3, and any metro in an active heat wave, freeze or storm." tone="bad" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-[12.5px] leading-snug">
          <Season t="HVAC" v="Sell in September and March–April. Skip heat waves and deep freezes." />
          <Season t="Roofing" v="Before storm season or in winter. Never the week after hail." />
          <Season t="Restoration" v="Check the weather. After a flood or freeze, wait 1–2 weeks and use it as your opener." />
          <Season t="Plumbing" v="Early fall. Avoid hard freezes and Thanksgiving week." />
          <Season t="Garage doors" v="Before or after the first cold snap, when springs break." />
          <Season t="Electrical" v="Avoid storm outages and summer load peaks." />
        </div>

        <H>Cadence <Sub>5 attempts, ~3 weeks, then park it</Sub></H>
        <div className="rounded-2xl border border-line px-6 py-5">
          <div className="relative flex justify-between">
            <div className="absolute top-[11px] right-3 left-3 h-px bg-line" />
            {[['Day 1', 'Early AM', 'VM #1'], ['Day 3', 'Late PM', ''], ['Day 7–8', 'Midday', 'VM #2'], ['Day 12–14', 'Untried slot', ''], ['Day 18–21', 'Last try', '']].map(([d, t, vm], i) => (
              <div key={d} className="relative flex w-[110px] flex-col items-center text-center">
                <div className={cx('tnum grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold', vm ? 'bg-accent text-bg' : 'border border-line bg-panel text-ink-2')}>{i + 1}</div>
                <div className="mt-2 text-[13px] font-medium">{d}</div>
                <div className="text-[12px] text-ink-3">{t}</div>
                {vm && <div className="mt-1 text-[11px] font-medium text-accent">{vm}</div>}
              </div>
            ))}
          </div>
          <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
            Leave at most two voicemails; a third lowers connect and reply rates (Gong). 93% of conversations happen by attempt 3 (Cognism, 200k calls).
            Logging "No answer" or "Voicemail" schedules the next attempt for you, and a time the front desk gives you beats the cadence.
          </p>
        </div>

        <H>Numbers you can say out loud</H>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-good/30 bg-good-soft/50 px-5 py-4">
            <div className="text-[11px] font-semibold tracking-wide text-good uppercase">Verified — OK to cite by name</div>
            <ul className="mt-2 space-y-2 text-[13px] leading-snug">
              <li><b>14%</b> of home-services calls go unanswered. CallRail, 1.1M leads, 2025.</li>
              <li>Small shops (&lt;5 techs) book <b>24%</b> of calls vs <b>59%</b> for 25+ techs, and after 6 p.m. small shops book <b>9%</b>. ServiceTitan, 3,000+ businesses, 2022.</li>
              <li><b>72%</b> of homeowners would pay more to fix an emergency within 24h. Housecall Pro, 2026.</li>
              <li>Web leads contacted within an hour are <b>~7×</b> as likely to qualify. HBR, 2,241 firms.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-bad/25 bg-bad-soft/50 px-5 py-4">
            <div className="text-[11px] font-semibold tracking-wide text-bad uppercase">Don't cite</div>
            <ul className="mt-2 space-y-2 text-[13px] leading-snug">
              <li>"<b>85%</b> of missed callers never call back": no traceable original source. Say "a lot of people just call the next company" instead.</li>
              <li>"<b>35–62%</b> of calls come after hours": vendor claims. ServiceTitan data says ~10–14% for HVAC. The bigger leak is daytime misses.</li>
              <li>Anything about <i>their</i> business you haven't seen with your own eyes.</li>
            </ul>
          </div>
        </div>

        <H>Compliance <Sub>not legal advice, see research §9</Sub></H>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] leading-snug">
          <Check>Manual, live dialing only. No autodialer, no prerecorded or AI voice.</Check>
          <Check>Call only numbers the business publishes (website, Google profile). Never data-broker cells.</Check>
          <Check>Say your real name and company. "Yes, it's a sales call" when asked. Never imply Google or a prior relationship.</Check>
          <Check>If a number could be the owner's personal cell, call only between 8 a.m. and 9 p.m. their time.</Check>
          <Check>Do-not-call requests are honored on the same call and kept forever. The DNC flag in this app is that list.</Check>
          <Check>No cold texts. Text only after they say "text me".</Check>
          <Check>Don't record calls unless you announce it. About 12 states require every party's consent.</Check>
          <Check>Canada: register with the National DNCL operator before the first call, even for B2B. Those leads stay held until then.</Check>
          <Check>Register your caller ID at freecallerregistry.com to avoid "Spam Likely" labels.</Check>
        </div>

        <H>Expectations</H>
        <p className="max-w-[680px] text-[14px] leading-relaxed text-ink-2">
          In big B2B datasets, average reps need hundreds of dials per meeting and top reps need about 45. Small-business owners answer their own phones far more often,
          so you should do much better, but most calls still end in a no. That's the interruption, not you: half of all objections are reflexive brush-offs.
          Set a daily goal for <b className="text-ink">conversations</b>, not meetings. Run calls in blocks, and stand up for a minute after a hostile one.
        </p>
        <p className="mt-6 text-[12px] text-ink-3">Every number above is sourced in <code className="font-mono">docs/research/cold-calling.md</code>.</p>
      </div>
    </main>
  )
}

const H = ({ children }: { children: ReactNode }) => <h2 className="mt-12 mb-4 flex items-baseline gap-2 font-serif text-[28px] leading-none">{children}</h2>
const Sub = ({ children }: { children: ReactNode }) => <span className="font-sans text-[13px] text-ink-3">{children}</span>

function Rule({ n, title, stat, children }: { n: string; title: string; stat: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="tnum font-serif text-[26px] leading-none text-ink-3">{n}</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">{stat}</span>
      </div>
      <div className="mt-3 text-[14px] font-semibold">{title}</div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">{children}</p>
    </div>
  )
}

function Row({ k, v, tone, extra }: { k: string; v: string; tone: 'good' | 'warn' | 'bad'; extra?: string }) {
  const dot = { good: 'bg-good', warn: 'bg-warn', bad: 'bg-bad' }[tone]
  return (
    <div className="flex items-start gap-4 border-b border-line px-5 py-3 last:border-0">
      <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', dot)} />
      <span className="tnum w-[110px] shrink-0 text-[13.5px] font-medium">{k}</span>
      <span className="text-[13.5px] text-ink-2">{v}{extra && <span className="block text-[12px] text-ink-3">{extra}</span>}</span>
    </div>
  )
}

const Season = ({ t, v }: { t: string; v: string }) => (
  <div className="rounded-xl bg-panel-2 px-3.5 py-2.5"><div className="font-medium">{t}</div><div className="text-ink-3">{v}</div></div>
)

const Check = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2"><span className="text-accent">✓</span><span className="text-ink-2">{children}</span></div>
)
