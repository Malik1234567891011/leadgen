/**
 * Builds a word-for-word call script for one lead from its research.
 * Wording and every rule here come from docs/research/cold-calling.md — read its
 * "Recommended script architecture" before changing lines. Lead-specific fills are
 * wrapped in [[ ]] so the UI can show what was personalized.
 *
 * Honesty lines that must never be edited away: "this is a cold call", "not an SEO /
 * Google thing", "no, they're not expecting me", and instant compliance with
 * "take me off your list".
 */
import type { Lead, Settings, Vertical } from './types'
import type { Scored } from './score'
import { VERTICALS } from './verticals'

export type Flow = 'gatekeeper' | 'owner' | 'service' | 'voicemail'
export interface Line { kind: 'say' | 'them' | 'note' | 'pause'; text: string }
export interface Step { id: string; title: string; goal?: string; lines: Line[]; branches?: { if: string; lines: Line[] }[] }
export interface Objection { id: string; they: string; lines: Line[]; why?: string }
export interface Script {
  defaultFlow: Flow
  prep: { askFor: string; askForTitle: string | null; goal: string; keyQuestion: string; facts: string[]; watchOut: string[] }
  flows: Record<Flow, Step[]>
  objections: Objection[]
  email: { subject: string; body: string } | null
}

const say = (text: string): Line => ({ kind: 'say', text })
const note = (text: string): Line => ({ kind: 'note', text })
const pause = (text: string): Line => ({ kind: 'pause', text })
const f = (s: string | number) => `[[${s}]]`

/* ------------------------------------------------------------ trade copy */

interface TradeCopy {
  trade: string
  /** The problem half of the reason-for-call, in the owner's language. */
  pain: string
  /** The anchor question for this trade. */
  question: (co: string) => string
  /** Trades where slow quote follow-up leaks as much as after-hours calls. */
  quoteDriven?: boolean
  /** Seasonal timing advice for the caller. */
  timing?: string
  /** When things slow down, for “check back in …”. */
  shoulder: string
}

const TRADE: Partial<Record<Vertical, TradeCopy>> = {
  restoration: {
    trade: 'restoration',
    pain: 'In water mitigation, whoever calls back first usually gets the job — and a lot of those calls come in at 2 a.m. when a pipe lets go.',
    question: co => `When a homeowner’s standing in water at 2 a.m. and calls ${co}, what happens?`,
    timing: 'Check the local weather first. After a freeze, flood or hurricane, skip this metro for 1–2 weeks — then come back with the storm as your opener.',
    shoulder: 'the spring',
  },
  hvac: {
    trade: 'HVAC',
    pain: 'When it’s 98 out and every tech’s already booked, the no-AC calls that come in at 7 p.m. are the ones people will pay extra for. Homeowner surveys say most would pay more to get an emergency handled within a day.',
    question: co => `When a no-AC call comes in to ${co} at 7 at night, what happens right now?`,
    timing: 'Best months to sell HVAC: September and March–April. In a heat wave or deep freeze, keep it to 20 seconds and book a callback.',
    shoulder: 'the fall',
  },
  plumbing: {
    trade: 'plumbing',
    pain: 'A sewer backup or a burst pipe doesn’t wait till morning — people just go down the Google list until someone picks up.',
    question: co => `When a burst pipe or a backup call comes in to ${co} at night or on a Sunday, what happens?`,
    timing: 'Avoid hard freezes and Thanksgiving week — plumbers are slammed. Early fall is a good time to call.',
    shoulder: 'the spring',
  },
  roofing: {
    trade: 'roofing',
    pain: 'With roofing it’s less about 2 a.m. and more about speed. After a storm the phone blows up for a couple weeks, and it comes down to who gets back to people first and who follows up on the estimates.',
    question: co => `When a quote request comes in to ${co} through the site or Google, how fast does somebody usually get back to them?`,
    quoteDriven: true,
    timing: 'Don’t call the week after a big hail storm. Before storm season or in winter is ideal.',
    shoulder: 'the winter',
  },
  electrical: {
    trade: 'electrical',
    pain: 'Half the house loses power at 8 p.m. and the homeowner’s calling whoever answers. Same with the bigger stuff — panel upgrades, EV chargers — those requests come in through the website and can sit.',
    question: co => `When someone calls ${co} at 8 at night with the power out, or a panel quote comes in through the site, what happens right now?`,
    quoteDriven: true,
    shoulder: 'the spring',
  },
  'garage-doors': {
    trade: 'garage door',
    pain: 'A broken spring at 6:30 in the morning with the car stuck inside is about the most “call the first guy who answers” situation there is.',
    question: co => `When someone calls ${co} before you open, what happens?`,
    timing: 'Busiest in the first cold snap of the year, when springs break. Call before or after it.',
    shoulder: 'the spring',
  },
}

function tradeCopy(v: Vertical): TradeCopy {
  return TRADE[v] ?? {
    trade: VERTICALS[v]?.label.toLowerCase() ?? 'home service',
    pain: 'People shopping for a quote usually call two or three companies, and the first one to get back to them has a real edge.',
    question: co => `When a quote request comes in to ${co} and nobody can grab it, how fast does somebody get back to them?`,
    quoteDriven: true,
    shoulder: 'a few months',
  }
}

/* ------------------------------------------------------------ helpers */

const firstName = (full: string | null) => full?.trim().split(/\s+/)[0] ?? null

/** Pull a closing time out of published hours, e.g. "Mon–Fri 7am–5pm" → "5". */
function closingTime(hours: string | null): string | null {
  if (!hours) return null
  const m = hours.match(/[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(pm|PM|p\.m\.)/)
  if (!m) return null
  return m[2] && m[2] !== '00' ? `${m[1]}:${m[2]}` : m[1]
}

const weekday = (d: Date, tz: string) => new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' }).format(d)
const localHour = (tz: string) => Number(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(new Date())) % 24

/** Two contractor-friendly slots: before the trucks roll, and end of day. */
function slots(tz: string): [string, string] {
  const days: string[] = []
  const d = new Date()
  while (days.length < 2) {
    d.setDate(d.getDate() + 1)
    const w = weekday(d, tz)
    if (w !== 'Saturday' && w !== 'Sunday') days.push(w)
  }
  const first = days[0] === weekday(new Date(Date.now() + 86400000), tz) ? 'tomorrow' : days[0]
  return [`${first} at 7:15, before you roll out`, `${days[1]} around 4:30`]
}

function nextTry(tz: string): string {
  const d = new Date()
  do d.setDate(d.getDate() + 1); while (['Saturday', 'Sunday'].includes(weekday(d, tz)))
  return `${weekday(d, tz)} morning`
}

export function shortName(company: string) {
  let n = company.replace(/\s*\(.*?\)\s*/g, ' ').trim()
  for (let i = 0; i < 2; i++) n = n.replace(/,?\s*\b(LLC|Inc\.?|Co\.?|Company|Corp\.?|L\.L\.C\.)\s*$/i, '').trim()
  return n
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Voicemails already left — the research says never more than two. */
export const voicemailsLeft = (l: Lead) => l.activity.filter(a => a.outcome === 'voicemail').length
/** Dial attempts so far (anything logged that isn't a note). */
export const attempts = (l: Lead) => l.activity.filter(a => a.outcome !== 'note').length

/* ------------------------------------------------------------ builder */

export function buildScript(l: Lead, st: Settings, score: Scored): Script {
  const t = tradeCopy(l.vertical)
  const s = l.signals
  const me = st.callerName || 'Malik'
  const myCo = st.companyName?.trim()
  const intro = myCo ? `${me} with ${f(myCo)}` : me
  const whoIAm = myCo ? `I run a small company called ${f(myCo)}` : 'I run a small company'
  const dm = firstName(l.dmName)
  const ownerRef = dm ? f(dm) : 'the owner'
  const coPlain = shortName(l.company)
  const co = f(coPlain)
  const city = f(l.city)
  const trade = f(t.trade)
  const close = closingTime(l.hours)
  const [slotA, slotB] = slots(l.timezone)
  const tryAgain = nextTry(l.timezone)
  const bigShop = l.employeeBand === '51-100' || l.employeeBand === '101-250'
  const num = st.callerPhone ? f(st.callerPhone) : f('your number')
  const price = st.priceRange?.trim() || 'two to five thousand'
  const greet = localHour(l.timezone) < 12 ? 'good morning' : 'good afternoon'
  const vmCount = voicemailsLeft(l)
  const n = attempts(l)

  // One true, specific observation. Strongest available wins.
  let observation: string
  if (s.afterHoursGap && s.emergency247 && close) observation = `your site says ${f('24/7 emergency service')}, and the office hours say you close at ${f(close)}`
  else if (s.emergency247) observation = `your site says you do ${f('24/7 emergency service')}`
  else if (s.paidAds) observation = `you’re ${f('running ads on Google')}`
  else if (l.googleReviews) observation = `you’ve got ${f(l.googleReviews.toLocaleString())} reviews on Google`
  else observation = `you’re doing ${trade} around ${city}`

  const keyQuestion = t.question(coPlain)
  const oneLiner = st.oneLiner?.trim()
    || 'making sure those calls get answered or texted back right away, the real ones get booked, and nobody goes cold'

  /* ---------------- prep */
  const facts = [
    ...(l.opportunity ? [l.opportunity] : []),
    ...l.hooks,
    ...(l.hours ? [`Published hours: ${l.hours}`] : []),
  ].slice(0, 7)

  const watchOut: string[] = []
  if (n >= 5) watchOut.push(`That’s ${n} attempts already. The research says stop at 5 and park it until ${t.shoulder}.`)
  if (s.phoneMatchesGoogle === false) watchOut.push(`The website and Google show different numbers. You’re dialing the website one. Details: ${l.phoneSource ?? 'see Research'}.`)
  if (!l.dmName) watchOut.push('No decision maker on file. Ask the front desk who handles how calls get answered, and write the name down.')
  if (bigShop) watchOut.push('Bigger shop, so the owner may not own the phones. The GM, ops or call-center lead may be the real buyer.')
  if (l.existingTools && !/^none/i.test(l.existingTools)) watchOut.push(`Already in place: ${l.existingTools}. Ask how it handles a missed call. Don’t pitch what they already have.`)
  if (s.reviewResponseComplaints) watchOut.push('A review mentions slow callbacks. It’s useful context, but never quote it at them.')
  if (score.disqualifiers.length) watchOut.push(`Scoring flags: ${score.disqualifiers.join(', ')}.`)
  if (t.timing) watchOut.push(t.timing)
  watchOut.push('Only quote numbers you can source by name. Owners have heard “62% of your calls go unanswered” from every reseller.')

  /* ---------------- decision maker answers */
  const owner: Step[] = [
    {
      id: 'open', title: 'Opener', goal: 'Name, own the cold call, ask for 30 seconds',
      lines: [
        say(`Hey ${dm ? f(dm) : 'there'}, it’s ${intro}. I’ll be upfront: this is a cold call. Can I take 30 seconds to tell you why I’m calling, and then you tell me if it’s worth talking?`),
        note('Slow down and use a downward inflection on the ask, so it’s a statement and not a nervous question. Then stop talking. Never say “how have you been” (it implies you’ve met) or a bare “is this a bad time?”.'),
      ],
      branches: [
        { if: 'they sound like they’re driving or on a job', lines: [
          say(`Hey ${dm ? f(dm) : 'there'}, ${me} here${myCo ? `, ${f(myCo)}` : ''}. Heads up, this is a cold call. Want the 20-second version, or should I catch you later?`),
          note('If they say later, use “Call me back later” on the right. Don’t push through someone on a ladder.'),
        ] },
        { if: 'you want to lead with what you noticed', lines: [
          say(`Hey ${dm ? f(dm) : 'there'}, it’s ${intro}. I was looking at ${co} and saw ${observation}. Honest heads-up, this is a cold call. Got 30 seconds for why that made me call you, and then you decide?`),
        ] },
      ],
    },
    {
      id: 'reason', title: 'Reason for the call', goal: 'Their problem, a hedge, then one easy question',
      lines: [
        say(`Thanks. So the reason I’m calling: ${trade} companies pay a lot to make the phone ring. Google, LSAs, all that.`),
        say(t.pain),
        ...(s.afterHoursGap && close ? [say(`And I saw ${observation}.`)] : []),
        say(`I’ve got no idea if that’s you, so I figured I’d just ask: ${f(keyQuestion)}`),
        pause('Stop. Let them answer. Silence is fine.'),
        note('If they sound skeptical: “And just so you know, I’m not an SEO company and I don’t sell leads. I work on the calls you’re already getting.”'),
      ],
      branches: [
        { if: '“It rings my cell” / “I answer it”', lines: [
          say('Oh, so it rings your cell?'),
          note('That’s a mirror: repeat their last words back as a question. Then label it:'),
          say('Sounds like nights are basically you and your phone. And when you’re up on a job or asleep and it rings, do you grab it, or call back after?'),
        ] },
        { if: '“We have an answering service”', lines: [
          say('Good, so nights aren’t just going to voicemail. Can I ask, do they actually book the job on your schedule, or take a message and pass it to your on-call guy?'),
          say('And how long does it usually take for someone to call that person back?'),
          note('Most answering services take messages, so the homeowner keeps dialing. Don’t trash the service. Just ask about the gap.'),
        ] },
        { if: '“It goes to voicemail”', lines: [
          say('So it goes to voicemail, and then someone calls back in the morning?'),
          say('Roughly how fast does that callback happen: first thing, or whenever someone gets to it?'),
        ] },
        { if: '“We don’t get many calls after hours”', lines: [
          say('Makes sense, honestly. After-hours is usually the smaller piece. What about during the day, when you and the guys are all out on jobs? Who grabs the phone?'),
          note('That’s true: ServiceTitan data puts only ~10–14% of HVAC calls outside Mon–Fri 8–5. The bigger leak is usually daytime misses and slow callbacks.'),
        ] },
        { if: '“We don’t do after-hours / emergencies”', lines: [
          say('Makes sense. Is that by choice, like you don’t want to run on-call, or more that there’s nobody to cover it?'),
          say('When those calls come in anyway, does anything happen, like a text back or a first-thing callback?'),
        ] },
        { if: '“We answer every call, 24/7”', lines: [
          say('Love that. Honestly, that’s rare. Is that you on your cell after hours, or do you have someone on call?'),
          say('The only other place I see stuff slip is web-form leads and quotes that go quiet. Is follow-up on estimates pretty tight too?'),
          say('Then honestly you’re in better shape than most. I won’t waste your time. Thanks.'),
          note('Only say the last line if it really is covered. Log “Conversation”.'),
        ] },
      ],
    },
    {
      id: 'discover', title: 'Discovery', goal: 'Pick 1–3, easiest first. Mirror and label in between',
      lines: [
        say('And during the day, when you and the guys are all out, who grabs the phone?'),
        say('If a call does get missed, does somebody call them back? Roughly how fast: minutes, an hour, next morning?'),
        say(`Is most of your work coming off Google (ads, LSA) or more referrals?`),
        say('Is that you handling it, or somebody in the office?'),
        ...(t.quoteDriven ? [say('When a quote request comes in through the website, how fast does someone usually get back to them?')] : []),
        note('Labels that work: “Seems like it’s pretty tight when the office is open, and nights are the wild card.” / “Sounds like the busy season is when stuff slips.” Then pause.'),
        note('Optional data line, only if they’re engaged: “ServiceTitan published numbers a while back showing smaller shops were booking something like a quarter of their calls. Big ones were closer to 60%, and it got way worse after 6 p.m. That’s the gap I work on.”'),
      ],
    },
    {
      id: 'bridge', title: 'The test drive', goal: 'What you do in one breath, then ask for interest',
      lines: [
        say(`Yeah, that’s exactly the gap I work on. Basically, ${f(oneLiner)}.`),
        say(`My guess is you’ve got most of it covered, but would it be crazy to take 15 minutes and let me show you what it’d look like when a 9 p.m. call comes in to ${co}? If it’s not useful, you tell me.`),
        note('“Would it be crazy” is a no-oriented question. Saying “no, not crazy” feels safe.'),
      ],
    },
    {
      id: 'close', title: 'Book it', goal: 'Calendar handy, two specific times, invite while they’re on the phone',
      lines: [
        say('Do you have your calendar handy?'),
        say(`Would ${f(slotA)} work, or is ${f(slotB)} better?`),
        pause('They pick'),
        say('Perfect. What’s the best email for the invite?'),
        note('Read it back letter by letter.'),
        say('And is this the best number to reach you, or is there a cell you’d rather I use?'),
        say('Mind if I text you a quick reminder that morning?'),
        note('Only text if they say yes; that’s your consent. Now send the invite while they’re still on the line:'),
        say('Sending the invite now. Did it come through?'),
        note('Log “Meeting booked” and put the time in Notes. If it’s more than 2 weeks out, confirm a week before and the day before.'),
      ],
      branches: [
        { if: 'they want info first', lines: [
          say('Totally. What’s the one thing you’d want to see to know if it’s worth 15 minutes?'),
          say(`Cool. I’ll send that over today and give you a call ${f(tryAgain)} to see if it’s worth a look. Fair?`),
          note('Send exactly that in 4–5 sentences, same day. The template is at the bottom.'),
        ] },
        { if: 'the office manager / CSR owns the phones', lines: [
          say(`Would it make sense to do it with you${dm ? ` and ${f(dm)}` : ''} together? You’re the one who’d know if it’d actually help.`),
        ] },
        { if: 'they say someone else decides', lines: [
          say('Got it. Who would that be? And would it be okay if I mentioned we spoke?'),
          note('Only say they referred you if they actually agreed to it.'),
        ] },
      ],
    },
  ]

  /* ---------------- someone else answers */
  const gatekeeper: Step[] = [
    {
      id: 'ask', title: 'Ask for them', goal: 'First name, confident, short',
      lines: [
        say(dm ? `Hey, ${greet}. Is ${f(dm)} around?` : `Hey, ${greet}. Who’d be the best person to talk to about how you guys handle incoming calls? Is that the owner?`),
        note('Keep it friendly and matter-of-fact. At a 5–50 person shop, the person answering usually IS the one handling leads, so treat them as a source, not an obstacle.'),
      ],
      branches: [
        { if: '“Who’s calling?”', lines: [say(myCo ? `It’s ${me}, with ${f(myCo)}.` : `It’s ${me}. I run a small company that works with ${trade} companies.`)] },
        { if: '“What’s this regarding?”', lines: [
          say(`Honest answer, it’s a sales call. I work with ${trade} companies on what happens to the calls that come in after hours or when everybody’s out on jobs. Is that something ${ownerRef} handles, or is there somebody else who’d own that?`),
          note('Since 2024 the FTC bans misrepresentation on business-to-business calls too. Never pretend to be a customer, and never imply you know them.'),
        ] },
        { if: '“Is he/she expecting your call?”', lines: [
          say(`No, they’re not. This is a cold call, and I’d rather be upfront about that. Is there a better time to catch ${ownerRef} for two minutes?`),
        ] },
        { if: 'they’re friendly, or say “that’d be me”', lines: [
          say(`Actually, you’d probably know better than ${ownerRef} would. When a call comes in at like 8 at night, where does it go?`),
          say('And during the day, when you’re on another line, does it roll somewhere or just ring?'),
          say(`Super helpful, thank you. Would it be worth me grabbing 10 minutes with you${dm ? ` and ${f(dm)}` : ''} together, or ${dm ? `is ${f(dm)}` : 'is the owner'} the one who’d decide on something like this?`),
          note('Write their answers and their name in Notes. On the owner call you can say “I was talking to [name], and they mentioned nights roll to your cell,” but only if they told you and seemed fine with it.'),
        ] },
        { if: '“They’re out on a job” / “not available”', lines: [
          say(`No worries. When’s ${ownerRef} usually back in the office, or is first thing in the morning better?`),
          note('Call back at exactly the time they give you. That beats any cadence.'),
        ] },
        { if: '“Can I take a message?”', lines: [
          say(`Sure, that’d be great. Could you tell ${ownerRef} ${me} called about how they handle after-hours calls? My number’s ${num}. And is ${ownerRef} easier to catch early, before you guys head out, or end of day?`),
          note('The best time slot is worth more than the message.'),
        ] },
        { if: '“We’re not interested”', lines: [
          say('Totally fair. Can I ask one quick thing so I don’t bug you guys again for no reason: do your after-hours calls go to an answering service, or to someone’s cell?'),
          say('Got it, thank you. Appreciate you.'),
          note('Log the answer. It’s intel for a call months from now.'),
        ] },
        { if: '“Just send an email”', lines: [
          say(`Happy to. What’s the best address to get it in front of ${ownerRef}?`),
          note('Send the email at the bottom within the hour.'),
        ] },
      ],
    },
    {
      id: 'transfer', title: 'When they put you through',
      lines: [
        say(`Hey ${dm ? f(dm) : 'there'}, it’s ${intro}. Thanks for taking it. I’ll be upfront: this is a cold call. Can I take 30 seconds to tell you why I’m calling, and then you tell me if it’s worth talking?`),
        note('Now switch to “Decision maker answers” above.'),
      ],
    },
  ]

  /* ---------------- answering service */
  const service: Step[] = [
    {
      id: 'confirm', title: 'Get off the line fast', goal: 'They may be billed per call',
      lines: [
        say(`Oh, is this ${co}’s answering service? Sorry, I’m not a customer. I’ll try the office during business hours. Have a good one.`),
        note('Don’t pitch the agent, and don’t ask them to book anything. Owners often pay per call or per minute.'),
        note('Write “answering service picked up at [time]” in Notes. It tells you which objection is coming, and that they already spend money on this. Next call, try: “When I called the other evening a service picked up. Do they book jobs, or take messages?”'),
      ],
    },
  ]

  /* ---------------- voicemail */
  const vm1: Line[] = [
    say(`Hey ${dm ? f(dm) : 'there'}, it’s ${intro}. Quick one about how ${co} handles calls that come in ${close ? `after ${f(close)}` : 'after hours'}. Not an SEO or Google thing.`),
    say(`I’ll try you again ${f(tryAgain)}. If it’s easier, I’m at ${num}. That’s ${num}. Thanks.`),
  ]
  const vm2: Line[] = [
    say(`Hey ${dm ? f(dm) : 'there'}, ${me} again${myCo ? `, ${f(myCo)}` : ''}. I work with ${trade} companies on the calls that come in when everyone’s out on jobs or after hours, so they get answered and booked instead of going to the next company.`),
    say(`Figured it’s worth one more try. ${num}. If it’s not a fit, no worries at all. I won’t keep calling.`),
  ]
  const voicemail: Step[] = vmCount >= 2
    ? [{ id: 'vm-none', title: 'Don’t leave a voicemail', goal: `You’ve already left ${vmCount}`,
        lines: [note('After two voicemails, more of them lower your connect and reply rates (Gong, 300M calls). Hang up and log “No answer”.')] }]
    : [{
        id: 'vm', title: vmCount === 0 ? 'Voicemail #1 (~15 seconds)' : 'Voicemail #2, your last one', goal: 'Name, a plain reason, when you’ll try again',
        lines: [
          ...(vmCount === 0 ? vm1 : vm2),
          note('Say the number slowly, twice. Don’t pitch; the voicemail’s job is to make your name familiar for the next call. Then log “Voicemail”.'),
        ],
        branches: vmCount === 0 ? [{ if: 'you want to preview voicemail #2 (for attempt 3)', lines: vm2 }] : undefined,
      }]
  voicemail.push({
    id: 'cadence', title: 'Cadence', goal: `This is attempt ${n + 1}`,
    lines: [
      note(`Make 5 attempts over about 3 weeks, rotating the time of day: day 1 early morning (leave VM #1), day 3 late afternoon, day 7–8 midday or early morning (leave VM #2), day 12–14 at the slot you haven’t tried, day 18–21. Then park it until ${t.shoulder}.`),
      note('93% of conversations happen by the 3rd attempt (Cognism, 200k calls). Logging an outcome sets the next follow-up date automatically.'),
    ],
  })

  /* ---------------- objections */
  const objections: Objection[] = [
    { id: 'not-interested', they: 'Not interested', lines: [
      say('Totally fair. Most people aren’t when someone calls out of the blue. Can I ask, is it more that nights are already covered, or just not something you think about much?'),
      note(`If it’s still a no: “All good. Appreciate you picking up${dm ? `, ${dm}` : ''}. Have a good one.” Log “Not interested”.`),
    ], why: 'About half of all objections are brush-offs to the interruption, not the idea (Gong, 300M calls). Ask one easy question, then respect the answer.' },
    { id: 'answer-all', they: 'We answer all our calls', lines: [
      say('Love that. Honestly, that’s rare. Is that you on your cell after hours, or do you have someone on call?'),
      say('And when you’re up on a job and it rings, do you grab it, or call back after?'),
      note('If it really is covered: “Sounds like you’ve got it handled. The only other place I see stuff slip is web-form leads and quotes that go quiet. Is follow-up on estimates pretty tight too?” If yes: “Then you’re in better shape than most. I won’t waste your time.”'),
    ], why: 'Don’t argue. Ask about the edges: nights, on a job, two calls at once, quotes.' },
    { id: 'service', they: 'We have an answering service', lines: [
      say('Good, so nights aren’t just going to voicemail. Can I ask, do they actually book the job on your schedule, or take a message and pass it to your on-call guy?'),
      say('And how long does it usually take for someone to call that person back?'),
      say('That callback gap is usually where people call the next company. Worth 15 minutes to see if it’s tighter than what you’ve got? If not, you keep what you have.'),
    ] },
    { id: 'software', they: 'We use ServiceTitan / Housecall Pro / Jobber / Podium', lines: [
      say('Nice, that’s a solid setup. Are you using their AI answering piece for after-hours, or mainly the scheduling and invoicing side?'),
      note(`If they use it: “How’s it doing on actually booking jobs at night, versus taking messages?” If they’re happy: “Sounds like you’re covered. I won’t pretend otherwise.” If they’re not using it: “Would it be worth 15 minutes to see what it looks like set up around how ${coPlain} actually runs?”`),
      note('Don’t claim any integration you haven’t built.'),
    ], why: 'All four now sell AI answering. Find out whether it’s switched on and actually booking jobs.' },
    { id: 'email', they: 'Just send me an email', lines: [
      say('Happy to. So I don’t send you something generic, can I ask one quick thing first?'),
      say(keyQuestion),
      say(`Perfect, I’ll send something short about exactly that. What’s the best email? And if it looks useful, would you mind if I called ${f(tryAgain)} to see if it’s worth 15 minutes?`),
    ], why: '“Send info” is usually a polite exit. One question tells you if there’s anything real (Josh Braun).' },
    { id: 'price', they: 'How much is it?', lines: [
      say(`Fair question. Usually somewhere in the ${f(price)} range, depending on what you need. Whether it’s worth it really comes down to how many calls are slipping, and I honestly don’t know that for you yet. Can I ask what happens right now when someone calls at night?`),
    ], why: 'Owners already distrust vendors, and a dodge sounds slippery. Give the range, then go back to their numbers.' },
    { id: 'busy', they: 'I’m busy / on a job', lines: [
      say('Totally, I’ll get out of your hair. Is first thing tomorrow before you head out better, or end of day?'),
      say('Great, I’ll call you at [time]. Talk then.'),
      note('Log “Call back”, set the date, and call at exactly that time.'),
    ] },
    { id: 'later', they: 'Call me back later', lines: [
      say(`Sure. What’s better, ${f(slotA)}, or ${f(slotB)}?`),
    ], why: 'A vague “later” never happens. A specific time does.' },
    { id: 'how-number', they: 'How did you get my number?', lines: [
      say(`It’s the number on your Google listing and website. I’m calling ${trade} companies around ${city} directly. If you’d rather I not call again, just say so and I’ll take you off my list.`),
    ] },
    { id: 'google', they: 'Is this Google? / SEO?', lines: [
      say(`No, not Google, and not SEO. I’m ${me}. ${cap(whoIAm)}. I don’t sell leads or rankings. I work on what happens to the calls you already get.`),
    ], why: 'Fake “Google listing” robocalls are why so many owners pick up hostile. Never imply any Google affiliation.' },
    { id: 'sales', they: 'Is this a sales call?', lines: [
      say(`Yeah, it is. Honest answer. I’m the founder, and I work on one thing: what happens to the calls ${trade} companies miss. Want the 20-second version, and you tell me if it’s a waste of time?`),
    ] },
    { id: 'robot', they: 'Is this a robot?', lines: [
      say(`Nope, real person. ${me}. I’m dialing these myself.`),
    ] },
    { id: 'too-busy', they: 'We’re too busy / plenty of work', lines: [
      say('That’s a good problem to have. Honestly, that’s usually when calls slip, when everyone’s slammed. Do you ever find you’re missing or turning away jobs because nobody can get to the phone?'),
      note(`Alternative: “Is the goal more jobs, or more of the good jobs and less chaos?” If it’s a real no: “Makes sense. Mind if I check back in ${t.shoulder}, when things slow down?”`),
    ] },
    { id: 'after-hours', they: 'We don’t do after-hours', lines: [
      say('Makes sense. Is that by choice, like you don’t want to run on-call, or more that there’s nobody to cover it?'),
      say('When those calls come in anyway, does anything happen, like a text back or a first-thing callback?'),
    ] },
    { id: 'tried', they: 'We tried something like that', lines: [
      say('Oh really, what happened with it?'),
      note('Listen closely. Whatever went wrong is the objection you’ll need to answer in the meeting.'),
    ] },
    { id: 'remove', they: 'Take me off your list', lines: [
      say('Done. You won’t hear from me again. Sorry for the interruption.'),
      note('End the call and hit “Do not call” below, before your next dial. Never rebut this. The same goes for profanity or “never call again”.'),
    ], why: 'The FCC requires honoring it within 10 business days. Our standard is the same call, permanently.' },
    { id: 'hostile', they: '(Swearing / instant hang-up)', lines: [
      note('Swearing or “never call again”: treat it as Do not call.'),
      note('A silent hang-up is often a reflex against robocalls. Log “No answer”, and retry at most once, on a different day and time slot, with the short honest opener. Never call back the same day. Take a 60-second breather before the next dial.'),
    ] },
  ]

  /* ---------------- follow-up email */
  const email = {
    subject: `${coPlain}: calls after hours`,
    body: [
      `Hi ${dm ?? 'there'},`,
      '',
      `${me} here${myCo ? ` from ${myCo}` : ''}. Thanks for picking up earlier.`,
      '',
      `You asked for something short, so: I work with ${t.trade} companies on the calls that come in when everyone's on a job or after hours. The work is ${oneLiner}.`,
      '',
      `If it's worth 15 minutes, I'll show you exactly what happens when a 9 p.m. call comes in to ${coPlain}. ${cap(slotA)} or ${slotB} both work on my end. If not, no hard feelings.`,
      '',
      `I'll give you a quick call ${tryAgain} either way.`,
      '',
      me,
      ...(st.callerPhone ? [st.callerPhone] : []),
    ].join('\n'),
  }

  return {
    // A published direct line usually rings the decision maker; the main line usually rings the office.
    defaultFlow: l.directLine ? 'owner' : 'gatekeeper',
    prep: {
      askFor: dm ? l.dmName! : bigShop ? 'the GM or whoever runs the office' : 'the owner',
      askForTitle: l.dmTitle,
      goal: 'Find out what happens to their missed and after-hours calls, then book 15 minutes. Don’t sell on this call.',
      keyQuestion,
      facts,
      watchOut,
    },
    flows: { gatekeeper, owner, service, voicemail },
    objections,
    email,
  }
}
