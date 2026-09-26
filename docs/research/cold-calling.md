# Cold calling home-service owners: research and scripts

Researched 2026-09-25. Scope: Malik makes manual, live calls to publicly listed numbers of locally owned U.S. residential home-service companies (5–50 employees). The goal of each call is a short discovery conversation and a booked 15-minute follow-up. The goal is not to sell on the call.

## How to read this

- **[DATA]** means a measured number from a named dataset. The dataset size is given where the source gives it.
- **[OPINION]** means practitioner advice: a named trainer, a forum or a vendor. It may be good advice, but nobody measured it.
- **[VENDOR]** means a number published by a company that sells missed-call or answering products. Treat these with suspicion. Many are recycled from each other and the original source can't be found.
- **Caveat that applies to almost everything below:** the big cold-call datasets (Gong, 30MPC, Cognism, Orum, Nooks) are mostly **B2B software SDRs calling office workers at desks**. A plumbing owner who answers his own cell from a crawlspace is a different kind of buyer. I use those datasets to answer "what does the phone psychology look like". I don't treat them as benchmarks for this ICP. Where the contractor context should change the advice, I say so.
- Reddit could not be fetched (the domain blocks automated access). Owner sentiment below comes from a secondary compilation of Reddit and LinkedIn quotes, from contractor/sales forums and from trade press. It is thinner than I'd like.

---

## 0. Stats ledger: what's verified and what isn't

Before putting any number in a script, check its status here. The rule for the calls: **quote no statistic you can't source by name.** Owners have heard "62% of your calls go unanswered!" from every AI-receptionist reseller.

| Claim | Status | Source / notes |
|---|---|---|
| Home services have a **14% missed-call rate** | **[DATA] Verified.** CallRail report "From Conversations to Conversions," Jan 2025, **1.1M leads** across 7 industries. Healthcare 32%, legal 28%, home services 14%, real estate 9%. | https://www.plumbermag.com/online_exclusives/2025/01/callrail-releases-report-analyzing-which-marketing-efforts-best-convert-leads-into-business , https://www.callrail.com/blog/callrail-releases-benchmark-report |
| "**Up to 85%** of callers whose calls go unanswered won't call back" | **Widely repeated, and the original source is unclear.** CallRail's own release repeats it with the words "up to" but doesn't show underlying data. Aggregators trace it variously to 411 Locals, BIA/Kelsey or Forbes, never to one clear primary study. Use it softly ("a lot of people just call the next company") and don't cite it as a fact. | https://www.plumbermag.com/online_exclusives/2025/01/callrail-releases-report-analyzing-which-marketing-efforts-best-convert-leads-into-business , https://www.hicira.com/missed-call-statistics |
| 78% of consumers have abandoned a business after an unanswered call; 21% immediately call another business; 42% leave a voicemail | **[DATA] survey.** CallRail survey of **1,000 U.S. consumers**, Sept 2025. Not specific to home services. | https://www.callrail.com/blog/missed-calls-cost-businesses-more-than-ever |
| **72% of homeowners would pay more to resolve an emergency within 24 hours** (29% "much more," 42% "somewhat more") | **[DATA] Verified.** Housecall Pro 2026 "State of Home Service Spending," survey of **1,100+ U.S. homeowners**, May 2026. No detailed methodology published. **Watch out:** the same report's *headline* is a different 72% ("72% plan to stay in their current home"). Don't mix them up. | https://www.globenewswire.com/news-release/2026/05/13/3293775/0/en/72-of-homeowners-plan-to-stay-put-as-aging-homes-drive-repair-focused-spending-housecall-pro-report-finds.html , https://www.achrnews.com/articles/166259-10-takeaways-from-housecall-pros-latest-survey |
| Same HCP report: 58% contact a pro after a sudden failure; 68% seek more quotes when the price is higher than expected; 79% expect to repair/replace at least one system in 2026 | [DATA], same survey | same as above |
| **Call booking rate averages 42%.** Shops with **<5 techs book 24%**, shops with 25+ techs book 59%. After 6 p.m., small shops drop to **9%** (large shops to 21%). | **[DATA]**, ServiceTitan, **3,000+ trade businesses**, June 2022. Old, and ServiceTitan-customer-biased, but it's the strongest first-party number on the gap between small and large shops. By trade: plumbing 43%, electrical 41%, HVAC 38%, garage door 31%. | https://www.servicetitan.com/blog/data-call-booking-rates |
| Only **9.8%–14.1%** of inbound calls to residential HVAC shops arrive **outside Mon–Fri 8–5** (Oct low, June peak, 2025). After-hours calls cluster **5–9 p.m.** with a secondary bump **6–8 a.m.** | **[DATA]**, ServiceTitan platform data, 2025. **This contradicts vendor claims** that "35–40%" of calls come after hours or that "62% of missed calls happen after hours." After-hours is a *minority* of volume. The bigger leak is probably **daytime calls missed while everyone is on jobs**, plus low booking rates. | https://www.servicetitan.com/toolbox/state-of-the-trades/trends/hvac-summer-after-hours-call-spike |
| 27% of calls to home-services businesses go unanswered; <3% of callers sent to voicemail leave a message | **[VENDOR]**, Invoca blog, May 2024. Methodology not given. Conflicts with CallRail's 14%. | https://www.invoca.com/blog/how-much-missed-sales-calls-cost-home-services-businesses |
| Google LSA: "Missed calls may negatively affect your responsiveness," which is a ranking factor | **[DATA/official]**, Google Local Services help center. The claim that the penalty "lasts ~90 days" is **[VENDOR]** and unverified. | https://support.google.com/localservices/answer/7527305?hl=en |
| Speed to lead: contacting a web lead within **1 hour** makes a firm ~**7x** as likely to qualify it as contacting an hour later, and >**60x** as likely as waiting 24h+ | **[DATA]**, HBR 2011 (Oldroyd, McElheran, Elkington), audit of **2,241 U.S. firms**. Web leads, not phone calls. 23% of firms never responded. | https://hbr.org/2011/03/the-short-life-of-online-sales-leads |
| Speed to lead: calling within **5 min vs 30 min** gives 100x the odds of contact and 21x the odds of qualifying | **[DATA]**, MIT/InsideSales Lead Response Management study, 2007, 6 companies, 15,000+ leads. Old and small, but it's the original. | https://www.smartac.com/blog/the-difference-between-a-lead-and-a-job-is-usually-60-seconds , https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf |
| "Homeowners with an emergency call 2–3 competitors within 10–15 minutes" | **[VENDOR], unverified.** Plausible, but I found no primary source. | (appears in aggregator summaries only) |
| Top lead sources for home services: Google Ads (47% of qualified leads), organic (23%), GBP (15%) | [DATA], CallRail 2025, 1.1M leads | https://www.plumbermag.com/online_exclusives/2025/01/callrail-releases-report-analyzing-which-marketing-efforts-best-convert-leads-into-business |
| Tommy Mello (A1 Garage Door, ~$200M): average home-service company books ~43% of calls, his team ~87%. He pays CSRs on booking rate and pays someone to take calls at night. | **[OPINION]** from a well-known operator. It matches the ServiceTitan 42% average. | https://www.handymanstartup.com/grow-garage-door-company-tommy-mello/ |

**Takeaway for scripting:** the most defensible framing isn't "you're missing calls." It's this: **a lot of paid calls either don't get answered or don't get booked, and small shops book far fewer than big ones, especially after 6 p.m.** Then *ask* the owner where he sits.

**Competitive landscape the owner already lives in** (this matters for objections):
- ServiceTitan sells AI Voice Agents for after-hours and overflow calls ([servicetitan.com](https://www.servicetitan.com/features/pro/contact-center/voice-agents)).
- Housecall Pro sells CSR AI as a paid 24/7 answering add-on ([help.housecallpro.com](https://help.housecallpro.com/en/articles/9740104-csr-ai-overview)).
- Jobber launched an AI Receptionist in Aug 2025 ([prnewswire](https://www.prnewswire.com/news-releases/jobber-launches-ai-powered-receptionist-to-answer-calls-and-texts-for-busy-home-service-businesses-302531125.html)).
- Podium sells an "AI Employee" ([podium.com](https://www.podium.com/product/ai-employee)).
- GoHighLevel resellers sell "missed-call text-back / AI receptionist" at $150–$500/mo, with setups on Fiverr for ~$90 ([myvoiceaiconnect](https://www.myvoiceaiconnect.com/gohighlevel-ai-receptionist), [fiverr](https://www.fiverr.com/photoviex/ghl-expert-for-ai-voice-agent-ai-employee-ai-calling-agent-gohighlevel-wo)).

**Implication:** "we text back your missed calls" is a commodity pitch that owners have heard. A $2–5k offer has to sound like "I'll fix *how your leads get handled*," not "here's an AI receptionist."

---

## 1. Openers

### What the data says

**Gong, 90,380 cold calls (success = meeting booked, baseline 1.5%)** ([gong.io/blog/cold-call-opening-lines](https://www.gong.io/blog/cold-call-opening-lines)) [DATA]:
- "Did I catch you at a bad time?" → 0.9% success, **40% below baseline**.
- "How are you?" → 5.2%, 3.4x.
- "The reason for my call is…" → **2.1x**.
- "How have you been?" → 10.01%, **6.6x**. Gong calls this a "pattern interrupt" because it implies a prior relationship.

**Gong + 30MPC, 300M+ calls** ([Gong/30MPC PDF guide](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf), [gong.io blog](https://www.gong.io/blog/the-best-and-worst-cold-call-openers-backed-by-data-from-300m-calls)) [DATA, success definition not stated]:
- "Did I catch you at a bad time?" 2.15%.
- "How's it going?" 7.6%.
- **Permission-based opener 11.18%**.
- **"Heard the name tossed around?" 11.24%**.
- Their permission-based talk track: *"I'm gonna be honest, this is a cold call, but it is a well-researched one. Can I get 30 seconds to tell you why [X] prompted me to call you specifically, then you can tell me whether or not it makes sense for us to speak?"*

**Nooks platform data:** permission-based openers convert **13.9% vs 5.8%** without, i.e. 2.4x ([nooks.ai](https://www.nooks.ai/blog-posts/want-2-4x-more-cold-call-meetings-start-with-a-simple-question)) [DATA, sample described only as "thousands"].

**Gong, 100k calls** ([Gong "9 secret elements" PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)) [DATA]:
- Say your **full name + company** up front.
- Successful cold calls run 5:50 vs 3:14 for unsuccessful ones.
- Talk:listen on successful cold calls is **55:45**.
- Reps on successful calls use "we" 35% more.
- Surprise: **"zero statistical difference in the number of questions asked on successful and unsuccessful cold calls"**. Gong's advice is to sell the meeting, not run discovery.

**Problem language beats buzzwords:** 16% success for problem language ("frustrated, overwhelmed, hate"), 12% for social proof, 5.5% for buzzwords like "all-in-one platform" ([Gong/30MPC PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)) [DATA].

### Contradictions you should know about

- **"Is now a bad time?"** Gong says it's the worst opener. Chris Voss's school recommends it as a "no-oriented" question that makes the prospect feel in control ([klenty summary of Voss](https://www.klenty.com/blog/6-negotiation-tactics-for-salespeople-from-chris-voss/)) [OPINION]. Nooks even lists it among permission-based openers. Jason Bay teaches a hybrid he calls the "Gong opener": *"I don't suppose I caught you at the WORST time, did I?"* ([30MPC newsletter on Jason Bay](https://www.30mpc.com/newsletter/jason-bays-cold-calling-framework-1-3)). **Resolution:** a bare "is this a bad time?" hands the owner an easy exit. Owning the interruption *and* asking for a small, specific slice of time ("30 seconds, then you decide") is what performs.
- **"How have you been?" (6.6x)** only works *because* it implies you've met. **That violates our honesty rule.** Don't use it. 30MPC bans "How's your day going?" outright ([SellingSherpa summary of *Cold Calling Sucks*](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)).
- **"Heard the name tossed around?" (11.24%)** needs real social proof ("we work with a few other HVAC shops in {city}"). **Malik can't say it honestly until he has customers in that vertical and region.** Use the permission-based opener until then.

### Which opener fits a busy contractor owner, and why

[OPINION, synthesized] The **permission-based opener with disarming honesty** fits best:
1. The owner is probably in a truck or on a job, so a clear, short request with an exit ("30 seconds, then you tell me") respects that.
2. Owners are pounded by SEO robocalls and fake "Google listing" calls. Business owners report 10–20 a day ([Search Engine Land](https://searchengineland.com/google-files-suit-against-seo-firm-accused-of-robocalling-launches-complaint-center-for-users-230796)). An immediate, human "this is a cold call" separates Malik from the robots.
3. A 20-something founder saying "I'm the founder, not an agency" earns a bit of curiosity and sympathy. [OPINION]

### Tone, pace, tonality [mostly OPINION]
- Use **downward inflection** on the permission ask. A rising tone makes a confident ask sound nervous ([Jason Bay via 30MPC](https://www.30mpc.com/newsletter/jason-bays-cold-calling-framework-1-3)). Claims such as "downward inflection = 3.6x" and "top reps speak 14% slower" circulate attributed to Gong, but I couldn't find them in Gong primary material. Treat them as unverified.
- Speak **slower than feels natural**, especially in the first 10 seconds. Use first name only for the owner. Smile. Keep the vocabulary plain: "calls," "jobs," "after hours," "the next guy on Google." Avoid "solution," "platform," "optimize," "leverage."
- **Don't rush the reason for the call.** Gong's successful calls have *longer* monologues: 53s vs 25s ([gong.io/blog/cold-call-stats](https://www.gong.io/blog/cold-call-stats)).
- Contractors respond to straight talk and short sentences. If he's clearly driving or on a ladder, **offer to call back at a specific time rather than pushing through**. [OPINION, [WarriorForum contractor-calling thread](https://www.warriorforum.com/offline-marketing/1099914-best-time-call-businesses-contractors.html)]

---

## 2. Gatekeepers in small businesses

**[DATA]** Reaching a gatekeeper instead of the prospect reduces the chance of booking by **39%** (Gong/30MPC, 300M calls, [PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)). Their advice is to dial off-hours or direct/mobile numbers to avoid gatekeepers.

**At a 5–50-person home-service shop, "the gatekeeper" is usually a CSR, dispatcher or office manager.** That person is often *the person who answers the leads*. They know exactly what happens to the 8 p.m. calls, whether the answering service books or just takes messages, and how often callbacks slip. **They are a source of information, not an obstacle.** [OPINION]

### Frameworks
- 30MPC's three gatekeeper attempts are (1) the **slide-by** ("Hey, could you get me over to Aubrey? It's Nick."), (2) **context**, and (3) **social proof**. If you're blocked, call early or late, or try another channel ([SellingSherpa summary](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)) [OPINION].
- Gatekeepers are "well-positioned contacts who … can become advocates" ([skipcall](https://skipcall.io/en/blog/cold-call-gatekeeper-script)). "Be specific and honest; it works better anyway" ([callin.io](https://callin.io/gatekeeper-script-for-cold-calling/)) [OPINION].

### Our honesty rules at the front desk
- Never pretend to be a customer.
- Never imply you know the owner ("Is Mike in? … tell him it's Malik" is fine; "he knows what it's about" is not).
- Never say you're "following up" on something that didn't happen.
- If asked "is he expecting you?", say no.
- If asked "is this a sales call?", say yes.

The slide-by (first name, confident, brief) is honest as long as you answer every follow-up question truthfully.

Word-for-word lines are in the **Recommended script architecture** section.

### 24/7 answering services
If the call is picked up by an answering service ("Thank you for calling ABC Plumbing, this is Jen, how can I help?" from a call center), **don't pitch the agent**. The owner is often **billed per call or minute**. Identify yourself as not a customer, ask for business hours if they'll give them, and get off the line fast. **Log "uses answering service during business hours."** That tells you the objection you'll hear, and that he already spends money on this problem. [OPINION]

---

## 3. Problem statement / reason for the call

### The data
- Stating a reason for the call early gives a **2.1x** higher success rate ([Gong](https://www.gong.io/blog/cold-call-opening-lines)) [DATA].
- Problem language: **16%** vs buzzwords 5.5% ([Gong/30MPC](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)) [DATA].

### The frameworks
- **30MPC "Problem Proposition"** ([30mpc.com](https://www.30mpc.com/newsletter/how-to-build-the-perfect-cold-call-pitch)) [OPINION]:
  1. A **triggering problem** described with "hairy lollipop specificity", i.e. so concrete the listener recognizes his own Tuesday.
  2. A **one-sentence solution** ("we do X so the problem goes away").
  3. An **interest-based CTA**: "My guess is you're all set, but open to taking a look?" Spend about 80% of the pitch on the problem.
- **Josh Braun "Poke the Bear"** ([joshbraun.com](https://joshbraun.com/poke-the-bear-cold-call-script/)) [OPINION]: permission → "I speak with {title}s all the time who are {pain}" → an open question such as "How does that compare with your experience?" → tease a different approach. Braun's core idea is that **the competitor is the status quo**, so show the cost of doing nothing ([joshbraun.com](https://joshbraun.com/overcoming-the-status-quo-on-a-cold-call/)).
- **Gong's "don't make assumptions"** ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)): hedge with phrases like "I'm trying to put the pieces together…" This fits our rule of never claiming they ARE missing calls.

### Framing for this ICP
Their world is:
- They **pay** for every ring (Google Ads, LSA pay-per-lead).
- The phone rings when everyone is on a job.
- Emergencies don't keep business hours.
- **Whoever calls back first usually gets the job.**

Frame everything around *leads they already paid for*, not "more leads." That also separates Malik from the SEO/lead-gen spam. Strong lines are under **Vertical pain lines** in the script section.

---

## 4. Discovery questions

**Tension in the data:**
- Gong's 100k-call study found no difference in question count between winning and losing calls. It recommends selling the meeting, not doing discovery ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)).
- Braun, Bay and 30MPC all use **one or two sharp problem questions** ("poke the bear") as the engine of the call.

**Resolution:**
- Ask **one to three easy, concrete, factual questions** that make the owner picture the gap himself. Don't run a 10-question interview.
- Gong also advises: "Limit open-ended questions… keep your questions simple to answer" ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)).
- Use **multiple-choice questions**. They're easy to answer from a truck and they reveal the process. 30MPC's "Mr. Miyagi" method also uses multiple-choice questions to open up objections ([SellingSherpa](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)).

Ranked question bank (easiest first):
1. **"When someone calls at 9 at night right now, what happens: voicemail, an answering service, or does it ring somebody's cell?"** This is the anchor question.
2. "And during the day, when you and the guys are all out on jobs, who grabs the phone?"
3. "If a call does get missed, does anyone call them back? Roughly how fast: minutes, an hour, next morning?"
4. "Is most of your work coming off Google (ads, LSA) or more referrals and repeat customers?" This tells you whether they pay for calls.
5. "Who owns that, you or someone in the office?" This tells you who owns lead conversion.
6. "Do you ever look at a missed-call number, like in CallRail or ServiceTitan, or is it more of a gut feel?"
7. For answering-service users: "Do they actually book it on your schedule, or take a message and pass it to the on-call guy?"
8. For web-form/estimate-heavy trades (roofing, remodel, electrical upgrades): "When a quote request comes in through the website, how fast does someone usually get back to them?"

**Tactical-empathy tools** [OPINION, Voss school: [klenty summary](https://www.klenty.com/blog/6-negotiation-tactics-for-salespeople-from-chris-voss/)]:
- **Mirror.** Repeat the last 2–3 words as a question: "It goes to your cell?"
- **Label.** "Sounds like nights are basically you and your phone." / "Seems like the busy season is when stuff slips."
- **No-oriented question for the ask.** "Would it be crazy to take 15 minutes Thursday?" The owner is comfortable saying "no, that's not crazy."
- **Pause** after a label. Silence does the work.

---

## 5. Objection handling

### What the data says
**Gong/30MPC, 300M calls** ([PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf), [blog](https://www.gong.io/blog/we-found-the-top-objections-across-300m-cold-calls-heres-how-to-handle-them-all)) [DATA]:
- **Dismissive objections are 49.5%** of all objections: "not interested," "send info," "where'd you get my number," "is this a cold call," hang-ups. "Most objections are dismissive brush-offs where prospects are objecting to the interruption itself."
- Situational objections (price, bandwidth, fit) are 42.6%. Existing-solution objections are 7.9%.
- **The top 5 objections account for 74%**. "Not interested" and "product fit" come up most (roughly 16–17% each).
- Median successful call is **4.8 minutes**, meaning you usually have to get through **about 2 objections** to land a meeting.

### Structure the sources converge on
**Acknowledge / agree → lower the pressure → ask a question.**
- 30MPC "Mr. Miyagi" ([SellingSherpa](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)): **(1) Agree** with the objection to remove the pressure, **(2) Incentivize conversation** with a multiple-choice question, **(3) Sell the test drive**: "You probably won't outgrow your solution for a while. But would you be opposed to taking a look?"
- Josh Braun on "send me an email" ([joshbraun.com](https://joshbraun.com/defusing-send-me-an-email/)): **mirror** ("An email?"), then *"So I don't do you a disservice by sending you irrelevant info, would it be okay if I asked you a couple quick questions?"*, then poke the bear. Braun's principle is "understanding, not overcoming."
- Gong's templates ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)):
  - Validate: "I totally understand if you're busy right now. When is a better time for you?"
  - Label: "Thanks for calling that out, it sounds like I missed the mark, could you tell me what your main priorities are right now?"
  - Secondary ask: "…do you know who is in charge of projects like this?"
- 30MPC data sheet on "not interested": *"That's fair, most people say that before they hear why I'm calling specifically"* ([30MPC](https://www.30mpc.com/interactive-resources/how-to-master-cold-calls-data-from-300m-calls-30mpc)).

### Rules for this ICP [OPINION]
- **Handle a brush-off once, maybe twice, then exit warmly.** The data says ~2 objections, but an owner on a job site who says no twice means no. A warm exit keeps the door open for the next season.
- **"Take me off your list" and "don't call me again" are never objections to handle.** Comply instantly (see §9).
- **Give price honestly when asked.** Deflecting "how much?" with "it depends" reads as slippery to owners who are already suspicious of vendors. A range plus "whether it's worth it depends on X" is honest *and* moves back to discovery.

Word-for-word handling for every objection is in the script section below.

---

## 6. Closing for the meeting

- **"Do you have your calendar handy?"** Gong calls it "the most powerful question you can use to wrap a cold call" ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)) [DATA-derived claim]. Gong also says to send the invite while still on the phone: "it's harder to decline an invitation you've already accepted."
- **Interest-based CTA first, then specific times.** Gong's cold-email data shows interest CTAs outperform (30% vs 15% for specific-date CTAs). On calls, 30MPC and Gong both get the "nod" first ("open to taking a look?") and then go straight to concrete times ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf), [30MPC](https://www.30mpc.com/newsletter/how-to-build-the-perfect-cold-call-pitch)).
- **Offer two specific times that fit the contractor's day** (early morning before trucks roll, or late afternoon). Don't ask "when works for you?"
- **Confirm contact details ethically.** Ask for the email for the invite. Ask whether *this* number is best or whether he'd prefer a cell. **Ask permission before texting** a reminder ("Mind if I text you a reminder that morning?"). That gives you consent for the text and he'll actually see it.
- **Confirmations:** for meetings more than 2 weeks out, confirm a week before and a day before. For same-week meetings, confirm the day before ([SellingSherpa summary of 30MPC](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)) [OPINION].
- **If he wants info first:** send it, but tie the email to one specific question and set a follow-up call on the spot. "Send me info" is usually a brush-off (Gong's "dismissive" category), so treat it as "I'm not convinced yet," not as a real next step.

---

## 7. Voicemail and follow-up cadence

### Data
From Gong/30MPC, 300M calls ([voicemail post](https://www.gong.io/blog/should-you-leave-voicemails-when-cold-calling-heres-what-the-data-says), [PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)) [DATA]:
- Voicemails rarely produce callbacks.
- Leaving voicemails **lowers connect rates on later dials**: 5.17% vs 7.18%. Rotate numbers if you leave many.
- Leaving a voicemail **raises the email reply rate** from 2.73% to 5.87%.
- **Leave at most two.** Three or more drops replies below baseline (2.2%).
- 30MPC's "double tap": VM #1 (~15s) is context only. VM #2 (~30s) is context plus social proof. Both point to an email and never ask for a callback.

Connect rate by attempt number, same dataset: 1st call 7.1%, 2nd 7.2%, 3rd 6.3%, 4th 5.9%, 5th 5%. They recommend moving on after 5 dials. 30MPC's cadence is **5 dials over 4 weeks** ([SellingSherpa](https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/)).

**Cognism 2026, 200k+ calls** ([cognism.com](https://www.cognism.com/reports/cold-calling-report-2026)) [DATA]: 93% of the conversations you'll ever have with a prospect happen by the 3rd attempt, and 98.6% by the 5th.

### Adapting it for contractor owners [OPINION]
- **Email is a weak channel for this ICP.** One founder sent 800+ emails to plumbers, got a 45% open rate and **zero replies** ([substack](https://itteba.substack.com/p/i-emailed-800-plumbers-and-got-0)). So the voicemail's job is mainly **name recognition for the next call** and to set up the time you'll call back. It's not really for driving email replies.
- A contractor-sales practitioner recommends leaving **"JUST your name, phone number, and the time you called"** ([WarriorForum](https://www.warriorforum.com/offline-marketing/1099914-best-time-call-businesses-contractors.html)).
- A good middle ground: **~15 seconds, with name, a plain-English reason, "not an SEO call," and when you'll try again**.
- **Don't cold-text** as a follow-up channel (see §9). Text only after he gives permission on a call.

**Recommended cadence** (5 attempts over ~3 weeks, varying the time of day):

| Attempt | When | Action |
|---|---|---|
| 1 | Day 1, early morning (7:00–7:45) | Call. If voicemail, leave VM #1. |
| 2 | Day 3, late afternoon (4:00–5:30) | Call, no VM. |
| 3 | Day 7–8, midday (11:30–12:30) or early morning | Call. If voicemail, leave VM #2 (last one). |
| 4 | Day 12–14, the time slot not yet tried | Call, no VM. |
| 5 | Day 18–21 | Call, no VM. Then **park until next season** (e.g. HVAC shoulder season) with a note. |

If a gatekeeper tells you a good time, override the schedule and call exactly then.

---

## 8. Timing

### Generic B2B data (office workers, so apply with care)
- Gong 300M: connect rate peaks at **10 a.m. (~8%)** and declines to ~6% by 6 p.m. ([PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)) [DATA].
- Gong 100k (older): **Wed/Thu** give a 49% better booking rate, and **11–12 and 4–5 p.m.** have the highest success ([PDF](https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf)) [DATA]. This contradicts the 300M "morning is best."
- Cognism: best 10–11 a.m., then 2–3 p.m. Tuesday is best for meetings, Friday best for conversations, Monday worst ([cognism.com](https://www.cognism.com/blog/best-time-to-cold-call)) [DATA, sample not disclosed].
- Orum: 10 a.m.–12 p.m. and 4–5 p.m. local ([orum.com](https://www.orum.com/reports-and-guides/the-state-of-cold-calling)) [DATA].

### Contractor-specific [OPINION, consistent across practitioners]
- **7:00–7:45 a.m.** is the best time to catch owners: "By 8:00 they're on a job site." Use that call to book a longer talk later ([WarriorForum](https://www.warriorforum.com/offline-marketing/1099914-best-time-call-businesses-contractors.html)).
- Planning windows **before ~7 a.m.** and wrap-up **after 4 p.m.** are best, when owners are reviewing schedules instead of running equipment ([ServiceTitan roofing script guide](https://www.servicetitan.com/blog/cold-calling-scripts-for-roofing)).
- Lunch is contested. One practitioner says calling then will anger them, another says noon is second-best. Test it.
- The ServiceTitan data showing a **6–8 a.m. inbound bump** tells you the office line is live early at many shops ([ServiceTitan](https://www.servicetitan.com/toolbox/state-of-the-trades/trends/hvac-summer-after-hours-call-spike)).

**Recommended blocks:**
- **7:00–8:15 a.m.** local for owners.
- **10:00–11:30 a.m.** for office staff, gatekeepers and office-based owners of larger (20–50) shops.
- **4:00–5:30 p.m.** local for owners heading back.
- Avoid **Monday before 10 a.m.** (dispatch chaos) and **Friday after 3**.
- Never call before 8 a.m. to a number that might be a personal cell. See §9: 8 a.m. is the TCPA residential floor. Only start at 7 with numbers that are clearly business lines.

### Seasonality [DATA where cited]
- **HVAC:**
  - Peak call volume comes during heat waves (summer) and cold snaps (January).
  - Off-hours share peaks in June (14.1%) and bottoms out in Oct (9.8%) ([ServiceTitan](https://www.servicetitan.com/toolbox/state-of-the-trades/trends/hvac-summer-after-hours-call-spike)).
  - By *technician trips*, **October** is the busiest month (maintenance and tune-ups) and **September** is a notable dip ([Samsara, 65M HVAC trips](https://www.samsara.com/blog/peak-season-for-hvac)).
  - **Best windows to sell to HVAC:** Sept and the spring shoulder (Mar–Apr). Owners have headspace and still remember the peak pain. Avoid calling during an active heat wave or deep freeze.
- **Plumbing:**
  - Winter freezes drive burst pipes.
  - The day after Thanksgiving ("Brown Friday") brings a **~50% spike** in service calls at Roto-Rooter ([PR Newswire](https://www.prnewswire.com/news-releases/brown-friday-after-thanksgiving-the-busiest-day-of-the-year-for-plumbers-302622030.html)) [DATA, vendor].
  - Avoid Thanksgiving week and hard freezes. Early fall is a good time to sell ahead of winter.
- **Restoration:**
  - Frozen or burst pipes are the top winter water-damage cause ([industry sources](https://www.americonrestoration.com/common-water-damage-people-experience-during-winter/)).
  - Hurricane season runs Jun–Nov on the Gulf and Atlantic coasts, and storm surges hit fast.
  - **Check local weather before a calling block.** If there's a major event in {city}, skip that metro for 1–2 weeks and come back with the storm as your {observation}.
- **Roofing:**
  - Hail claims peak May–June nationally. Texas hail runs roughly Mar–Jun, the Upper Midwest Apr–Sep ([justclaims](https://justclaims.ai/blog/hail-season-in-texas/), [Griffith Roofing](https://www.griffithroofing.com/dallas-hail-season/)).
  - Call roofers **just before storm season, or in winter**, not in the week after a big hail event.
- **Garage doors:** cold snaps break springs, so they're busiest in the first cold weeks. [OPINION]
- **Electrical:** storms and outages cause spikes, and summer load brings spikes too. [OPINION]

---

## 9. Compliance guardrails (U.S. and Canada)

*Not legal advice. This is a practical summary of primary and secondary sources. If calling becomes a real volume channel, spend an hour with a TCPA attorney.*

### United States

**FTC Telemarketing Sales Rule (TSR)**
- B2B calls are *mostly* exempt.
- **The 2024 amendment (effective May 16, 2024) extended the TSR's ban on material misrepresentations to B2B calls** ([FTC](https://www.ftc.gov/business-guidance/blog/2024/03/revised-rule-proposed-amendment-expand-fight-against-illegal-telemarketing), [Federal Register](https://www.federalregister.gov/documents/2024/04/16/2024-07180/telemarketing-sales-rule), [Hunton](https://www.hunton.com/insights/legal/telemarketing-sales-rule-changes-remove-exception-for-business-to-business-calls-and-impose-new-recordkeeping-requirements)).
- **Practical meaning:**
  - No false claims about who you are, what the product does, results, or affiliation. **Never imply you're Google or "with Google."**
  - The FTC and Google have both gone after "Google listing" callers ([Search Engine Land](https://searchengineland.com/google-files-suit-against-seo-firm-accused-of-robocalling-launches-complaint-center-for-users-230796)).
  - Don't claim they're missing calls unless you know it.

**TCPA and the National Do Not Call Registry**
- The DNC rules protect "residential telephone subscribers." Genuine business lines are generally outside them.
- But many small contractors **list the owner's personal cell as the business number**, and courts are split:
  - The **Ninth Circuit presumes mixed-use cell numbers are residential** ([Leech Tishman](https://www.leechtishman.com/insights/blog/ninth-circuit-rules-that-for-do-not-call-purposes-mixed-use-cellular-numbers-are-presumptively-residential/)).
  - A Florida federal court (Sept 2026) held cell phones aren't "residential" at all ([Duane Morris](https://blogs.duanemorris.com/classactiondefense/2026/09/21/florida-federal-court-holds-that-the-tcpas-do-not-call-provisions-do-not-apply-to-cell-phone-users/)).
  - Greenspoon Marder's advice: "assume … that DNC rules may apply to personal cell phones and texts" ([gmlaw.com](https://www.gmlaw.com/news/the-tcpas-do-not-call-rules-cell-phones-and-texts-why-courts-still-disagree-and-what-it-means-for-businesses-and-consumers/)).
- **Practical rules:**
  1. Dial only numbers **published as the business's number** (website, GBP, LSA).
  2. **Manual dialing only.** No autodialer and no prerecorded or AI voice to cells.
  3. If a number looks like a personal cell (sole operator, no office), **scrub it against the National DNC Registry**, or at least call only 8 a.m.–9 p.m. recipient-local time. The TCPA residential window is 8 a.m.–9 p.m.
  4. **Keep an internal do-not-call list** and honor requests immediately. The FCC's rule requires company-specific DNC requests to be honored within a reasonable time not exceeding **10 business days**, effective **April 11, 2026** ([Copilevitz Lam & Raney](https://clrkc.com/fcc-updates-internal-do-not-call-list-time-period/), [eCFR 64.1200](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200)). Our standard is **same call, permanently**.
  5. **Don't cold-text.** Texts count as "calls" under the TCPA, and several state mini-TCPAs (e.g. Florida, Oklahoma) are aggressive. Text only after he says "text me."

**State laws**
- Most state telemarketer-registration laws exempt B2B calls, but not all.
- Some states require you to *apply* for the exemption.
- A few (FL, OK, MD, WA and others) are stricter ([dnc.com FAQ](https://www.dnc.com/faq/are-there-exemptions-b2b-calls), [Blacklist Alliance](https://www.blacklistalliance.com/blog/demystifying-telemarketer-state-registration-requirements), [LeadCompliant](https://leadcompliant.com/articles/state-laws/states-that-require-telemarketer-registration-before-calling)).
- Before scaling beyond a handful of states, check registration rules for your target states.

**Call recording** (if you record calls to review your own delivery)
- ~11–12 states require **all-party consent**: CA, DE, FL, IL, MD, MA, MT, NV, NH, PA, WA, plus CT for phone calls ([RecordingLaw](https://www.recordinglaw.com/party-two-party-consent-states/)).
- Simplest rule: **don't record, or announce it** ("heads up, I record calls for notes, that okay?").

**Caller ID**
- Call from a real, callback-able number.
- **Register it at the Free Caller Registry** (freecallerregistry.com, covering the major U.S. carriers) to reduce "Spam Likely" labels. It takes 2–4 weeks and isn't a guarantee ([800.com help](https://support.800.com/en-us/hc/articles/41086077816205-how-to-register-your-business-number-with-the-free-caller-registry-and-major-carriers), [Trellus](https://www.trellus.ai/post/register-numbers-free-caller)).

### Canada (CRTC Unsolicited Telecommunications Rules)
- **B2B calls are exempt from the National DNCL rules (Part II)** but still subject to the Telemarketing Rules and ADAD rules ([CRTC bulletin 2009-283](https://crtc.gc.ca/eng/archive/2009/2009-283.htm), [CRTC business alerts](https://crtc.gc.ca/eng/phone/telemarketing/biz.htm)).
- **Register with the National DNCL operator even if you only make exempt calls.** The CRTC's guidance is that all telemarketers must register ([CRTC register page](https://crtc.gc.ca/eng/phone/telemarketing/tobligations/register-inscrire.htm)). The CRTC pages blocked automated fetch, so I confirmed this via search snippets. Re-verify before the first Canadian call.
- **Internal DNC list:** add the number within **14 days** of a request and keep it for **3 years** ([CRTC key rules](https://crtc.gc.ca/eng/phone/telemarketing/tobligations/rules-regles.htm), [Lexology](https://www.lexology.com/library/detail.aspx?g=a440d5e3-4742-4d66-9b92-7a9fcc66b95c)).
- **Identify yourself and the purpose of the call at the start.**
- **Calling hours for consumer calls:** 9:00 a.m.–9:30 p.m. weekdays, 10 a.m.–6 p.m. weekends. Follow them for businesses too.

### Honesty rules baked into the script
- Always: real name, real company, "this is a cold call / a sales call" when asked.
- Never claim a prior relationship, a referral, a Google affiliation, or a statistic about *their* business you haven't seen.
- "Take me off your list" ends the call and goes in the log immediately.

---

## 10. Common solo-founder mistakes, and mindset

**The math is brutal, so plan for it.** [DATA] From the Gong/30MPC 300M-call guide ([PDF](https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf)):
- Average reps need **~402 dials per meeting**. Top reps need ~45.
- Average reps connect on 5.4% of dials and top reps on 13.3%.
- Average reps convert 4.6% of conversations to meetings, top reps 16.7%.

SMB owners answer their own phones far more often than enterprise VPs, so Malik's connect rate should be much better than these B2B numbers. **Track your own** dials → connects → conversations → meetings from day one.

**Common mistakes** [OPINION, synthesized from the sources above]:
1. **Pitching the product.** Talking features ("AI," "automations," "CRM integration") instead of the owner's Tuesday night. Problem language wins: 16% vs 5.5% for buzzwords.
2. **Sounding like the other 20 calls he got today.** SEO, "Google listing," lead-gen. Say early and plainly what you're *not*.
3. **Asserting their problem.** "You're missing calls" invites "no we're not." Ask instead: "When someone calls at 9 p.m., what happens?"
4. **Rushing.** Nervous speed signals low status. Slow down on the opener and the reason.
5. **Folding at the first "not interested."** Winning calls usually survive ~2 objections. But don't bulldoze. One reframe, then a warm exit.
6. **Making the call a 12-question survey.** One to three easy questions, then the meeting ask.
7. **Leaving without a specific next step.** "I'll send you some info" with no follow-up date is a dead lead. Use two concrete times and ask "calendar handy?"
8. **Giving up after 1–2 tries.** A Chirp/Ryan Fenn observation, via SmartAC, is that contractors themselves stop following up their own leads after 2–3 attempts ([smartac](https://www.smartac.com/blog/the-difference-between-a-lead-and-a-job-is-usually-60-seconds)). Don't mirror their mistake. Use 5 attempts across ~3 weeks.
9. **Calling during their emergencies.** A heat wave, hail storm or freeze is when they're slammed. Call before or after.
10. **No pre-call research.** Gong's "3x3" means three minutes, three facts. For this ICP:
    - Owner's first name (website About page, GBP, BBB, state license lookup).
    - Whether they advertise "24/7 emergency service."
    - Whether they run LSAs ("Google Guaranteed"/"Google Screened").
    - Whether they have online booking or chat.
11. **Not logging DNC requests.** That's a legal risk, and it's embarrassing to call back someone who asked you not to.
12. **Using unverifiable stats.** Owners have heard "62% of calls go unanswered." Use verified numbers or none.

**Mindset** [OPINION]:
- Josh Braun: *"It's not your job to talk everyone into booking a meeting with you… It's okay if people want to talk with you. It's also okay if they don't."* ([joshbraun.com](https://joshbraun.com/how-to-cold-call-without-sounding-salesy/)).
- Treat each call as **sorting, not convincing.** Detachment makes you sound less salesy, which gets more meetings.
- The rejection is about the interruption, not you: half of all objections are brush-offs to the interruption itself ([Gong](https://www.gong.io/blog/we-found-the-top-objections-across-300m-cold-calls-heres-how-to-handle-them-all)).
- Run calls in blocks (e.g. 7:00–8:15), with a stand-up break after any hostile call.
- Review 2–3 of your own calls per week, with recording consent.
- Set a daily **conversations** goal, not a meetings goal.

---

## Recommended script architecture for this ICP

Placeholders:
- **{ownerFirst}**: owner's first name.
- **{company}**: *their* company.
- **{myCompany}**: Malik's company name.
- **{vertical}**: e.g. "plumbing."
- **{city}**: their city.
- **{observation}**: one true, specific thing you saw, e.g. "your site says 24/7 emergency service" / "you're running Local Services Ads" / "you've got 400-something reviews on Google."
- **{priceRange}**: final pricing when set.

Lines are written to be *said*, so they include contractions and fragments. Don't read them. Know them well enough to paraphrase.

> **Honesty lines that must never be paraphrased away:** "this is a cold call," "not an SEO/Google thing," "no, he's not expecting me," and immediate compliance with "take me off your list." Only use "the owners I talk to…" style lines once they are literally true. Until then use the "from what I've seen / what I keep hearing" variants.

### A. Pre-call (30–60 seconds)
Find {ownerFirst}. Check hours and "24/7" claims on the site and GBP, LSA badge, online booking, and the local weather/storm situation. Pick one {observation}. Decide: is this a business line or likely the owner's cell? That determines the earliest call time (§9).

### B. Gatekeeper / front desk

**Opening (the slide-by: first name, confident, short):**
> "Hey, good morning. Is {ownerFirst} around?"

*Rationale:* 30MPC's slide-by. Asking by first name is honest and normal. Don't add anything that implies you know him.

**"Who's calling?"**
> "It's Malik, with {myCompany}."

**"What's this regarding?"**
> "Honest answer, it's a sales call. I work with {vertical} companies on what happens to the calls that come in after hours or when everybody's out on jobs. Is that something {ownerFirst} handles, or is there somebody else who'd own that?"

*Rationale:* honest (TSR misrepresentation rule), specific, and it offers the gatekeeper a role.

**Enlisting the CSR/dispatcher (use it when she's friendly or says "that'd be me"):**
> "Actually, you'd probably know better than he would. When a call comes in at like 8 at night, where does it go?"
> *(then)* "And during the day, when you're on another line, does it roll somewhere or just ring?"
> *(then)* "Super helpful, thank you. Would it be worth me grabbing 10 minutes with you and {ownerFirst} together, or is he the one who'd decide on something like this?"

*Rationale:* she knows the real process. Her answers become the {observation} for the owner call ("I was talking to Jess and she mentioned nights roll to your cell"). Only say that if she said it and seemed okay with it.

**"Is he expecting your call?"**
> "No, he's not. This is a cold call, I'd rather be upfront about that. Is there a better time to catch him for two minutes?"

**"Can I take a message?"**
> "Sure, that'd be great. Could you tell him Malik called about how they handle after-hours calls? My number's {myNumber}. And is he easier to catch early, before they head out, or end of day?"

*Rationale:* you get the best time slot, which is more valuable than the message.

**"He's not available / he's on a job."**
> "No worries. When's he usually back in the office, or is first thing in the morning better?"

**"We're not interested" (from the gatekeeper):**
> "Totally fair. Can I ask one quick thing so I don't bug you guys again for no reason: do your after-hours calls go to an answering service, or to someone's cell?"
> *(whatever the answer)* "Got it, thank you. Appreciate you."

Log the answer as intel.

**Reaching a 24/7 answering service:**
> "Oh, is this {company}'s answering service? Sorry, I'm not a customer, I'll try the office during business hours. Have a good one."

*Rationale:* don't burn the owner's per-call fees or the agent's time. Log "answering service during hours."

### C. Owner opener (permission-based, owning the cold call)

**Default:**
> "Hey {ownerFirst}, it's Malik with {myCompany}. I'll be upfront: this is a cold call. Can I take 30 seconds to tell you why I'm calling, and then you tell me if it's worth talking?"

**Shorter, for when he sounds like he's in a truck or on a job:**
> "Hey {ownerFirst}, Malik here, {myCompany}. Heads up, this is a cold call. Want the 20-second version, or should I catch you later?"

**With an observation (once you've done research):**
> "Hey {ownerFirst}, it's Malik with {myCompany}. I was looking at {company} and saw {observation}. Honest heads-up, this is a cold call. Got 30 seconds for why that made me call you, and then you decide?"

*Rationale:*
- Permission-based openers perform ~2–5x better than generic greetings across Gong, 30MPC and Nooks data (§1).
- Full name and company go up front (Gong).
- "Cold call" separates you instantly from robocalls and fake Google-listing calls.
- **No** "how have you been," **no** bare "is this a bad time," **no** "how's your day going."

### D. Reason for the call (problem proposition, then one question)

**Core version:**
> "Thanks. So the reason I'm calling: {vertical} companies pay a lot to make the phone ring, with Google, LSAs, all that. What I keep hearing is the expensive part isn't getting the call, it's the calls that come in when everybody's on a job or it's after hours. Those people usually just call the next company on Google. I've got no idea if that's you, so I figured I'd just ask: when someone calls {company} at 9 at night right now, what happens?"

**Founder variant (disarms the "another agency" reflex):**
> "…and just so you know, I'm not an SEO company and I don't sell leads. I work on the calls you're already getting."

**Optional data line (use sparingly and only if he's engaged):**
> "ServiceTitan published numbers a while back showing the smaller shops were booking something like a quarter of their calls. The big ones were booking closer to 60%, and the gap got way worse after 6 p.m. That's the gap I work on."

(Source: ServiceTitan 2022 booking-rate data; see the ledger. Say "a while back," because it's from 2022.)

*Rationale:*
- States the reason early (Gong 2.1x).
- Uses problem language, not product.
- **Hedges ("no idea if that's you")** so you're never asserting they miss calls.
- Ends on the anchor question, which is easy to answer from a truck.

### E. Vertical pain lines (swap into D in place of the generic middle)

- **Water / fire / mold restoration:**
  > "In water mitigation, whoever calls back first usually gets the job, and a lot of those calls come in at 2 a.m. when a pipe lets go. When a homeowner's standing in water at 2 a.m. and calls you, what happens?"

  Adjuster/TPA angle: "…and if it's a TPA or adjuster referral, how fast do you have to get back to them?"

- **HVAC:**
  > "When it's 98 out and every tech's already booked, the no-AC calls that come in at 7 p.m. are the ones people pay extra for. Homeowner surveys say most would pay more to get an emergency handled within a day. What happens to those evening calls at {company} right now?"

  Winter variant: "…no-heat calls at 10 p.m. in January…"

- **Plumbing / drain / sewer:**
  > "A sewer backup or a burst pipe doesn't wait until morning. People just go down the Google list until someone picks up. When one of those comes in at night or on a Sunday, what happens?"

- **Roofing:**
  > "With roofing it's less about 2 a.m. and more about speed. After a storm the phone blows up for a couple weeks, and it comes down to who gets back to people first and who follows up on the estimates. When a quote request comes in through the site or LSA, how fast does somebody usually get back to them?"

- **Electrical:**
  > "Half the house loses power at 8 p.m. and the homeowner's calling whoever answers. Same with the bigger stuff like panel upgrades and EV chargers: those requests come in through the website and can sit. What happens with those right now?"

- **Garage doors:**
  > "A broken spring at 6:30 in the morning with the car stuck inside is about the most 'call the first guy who answers' situation there is. When someone calls {company} before you open, what happens?"

### F. Discovery (pick 1–3, easiest first; label and mirror in between)

> 1. "When someone calls at 9 at night, what happens: voicemail, answering service, or does it ring somebody's cell?"
> 2. "And during the day, when you and the guys are all out, who grabs the phone?"
> 3. "If a call does get missed, does somebody call them back? Roughly how fast: minutes, an hour, next morning?"
> 4. "Is most of your work coming off Google (ads, LSA) or more referrals?"
> 5. "Is that you handling it, or somebody in the office?"
> 6. "Do you ever see a missed-call number, like in CallRail or ServiceTitan, or is it more gut feel?"

**Labels to use after his answer:**
> "Sounds like nights are basically you and your cell phone."
> "Seems like it's pretty tight when the office is open, and nights are the wild card."
> "So it goes to voicemail and then someone calls back in the morning?" *(mirror, as a question)*

**Bridge to the meeting (the "test drive"):**
> "Yeah, that's exactly the gap I work on. Basically, making sure those calls get answered or texted back right away, the real ones get booked, and nobody goes cold. My guess is you've got most of it covered, but would it be crazy to take 15 minutes and let me show you what it'd look like when a 9 p.m. call comes in? If it's not useful, you tell me."

*Rationale:* 30MPC's interest-based CTA ("my guess is you're all set, but…") plus Voss's no-oriented "would it be crazy."

### G. Objections (acknowledge → lower pressure → question)

**"Not interested."**
> "Totally fair. Most people aren't when someone calls out of the blue. Can I ask, is it more that nights are already covered, or just not something you think about much?"

If he's still a no:
> "All good. Appreciate you picking up, {ownerFirst}. Have a good one."

**"We answer all our calls."**
> "Love that, honestly that's rare. Is that you on your cell after hours, or do you have someone on call?"
> *(then)* "And when you're up on a job and it rings, do you grab it, or call back after?"

If truly covered:
> "Sounds like you've got it handled. The only other place I see stuff slip is web-form leads and quotes that go quiet. Is follow-up on estimates pretty tight too?"

If yes again:
> "Then honestly you're in better shape than most. I won't waste your time. Thanks."

**"We already have an answering service."**
> "Good, so nights aren't just going to voicemail. Can I ask, do they actually book the job on your schedule, or take a message and pass it to your on-call guy?"
> *(if message-taking)* "And how long does it usually take for someone to call that person back?"
> *(bridge)* "That callback gap is usually where people call the next company. Worth 15 minutes to see if it's tighter than what you've got? If not, you keep what you have."

**"We use ServiceTitan / Housecall Pro / Jobber / Podium."**
> "Nice, that's a solid setup. Are you using their AI answering piece for after-hours, or mainly the scheduling and invoicing side?"
> *(if using it)* "How's it doing on actually booking jobs at night versus taking messages?"
> *(if happy)* "Sounds like you're covered. I won't pretend otherwise. Thanks for the time."
> *(if not using it / unhappy)* "Got it. Would it be worth 15 minutes to see what it looks like set up around how {company} actually runs?"

*Note:* don't claim integrations until they're real.

**"Send me an email."**
> "Happy to. So I don't send you something generic, can I ask one quick thing first?"
> *(ask anchor question 1)*
> *(then)* "Perfect, I'll send something short about exactly that. What's the best email? And if it looks useful, would you mind if I called Thursday morning to see if it's worth 15 minutes?"

*Rationale:* Braun's "so I don't do you a disservice."

**"How much is it?"**
> "Fair question. It's a one-time setup, usually somewhere in the {priceRange} range depending on what you need. Whether it's worth it really comes down to how many calls are slipping, and I honestly don't know that for you yet. Can I ask what happens right now when someone calls at night?"

*Rationale:* owners distrust dodges, so give the range. The product isn't final, so keep {priceRange} as a variable.

**"I'm busy / I'm on a job."**
> "Totally, I'll get out of your hair. Is first thing tomorrow before you head out better, or end of day?"
> *(pick a time)* "Great, I'll call you at 7:15 tomorrow. Talk then."

Then call **exactly** at that time.

**"How did you get my number?"**
> "It's the number on your Google listing and website. I'm calling {vertical} companies around {city} directly. If you'd rather I not call again, just say so and I'll take you off my list."

**"Is this Google? / Are you an SEO company?"**
> "No, not Google, and not SEO. I'm Malik, I run a small company called {myCompany}. I don't sell leads or rankings. I work on what happens to the calls you already get."

**"We're too busy already / we've got plenty of work."**
> "That's a good problem to have. Honestly that's usually when calls slip, when everyone's slammed. Do you ever find you're missing or turning away jobs because nobody can get to the phone?"

Alternative framing:
> "Is the goal more jobs, or more of the *good* jobs and less chaos?"

If it's a real no:
> "Makes sense. Mind if I check back in {shoulderSeason}, when things slow down?"

**"Is this a sales call?"**
> "Yeah, it is. Honest answer. I'm the founder, and I work on one thing: what happens to the calls {vertical} companies miss. Want the 20-second version, and you tell me if it's a waste of time?"

**"Call me back later."**
> "Sure. What's better, tomorrow around 7:30, or Thursday afternoon?"

Get a specific slot, put it on the calendar, and call on time.

**"We don't do after-hours / we don't take emergency calls."**
> "Makes sense. Is that by choice, like you don't want to run on-call, or more that there's nobody to cover it?"
> *(then)* "When those calls come in anyway, does anything happen, like a text back or a first-thing callback?"

**"Take me off your list" / "Don't call me again."**
> "Done. You won't hear from me again. Sorry for the interruption."

End the call. Log it in the DNC list before the next dial. No rebuttal, ever.

**Hostile / swearing / immediate hang-up**
- **Profanity or "never call again":** treat as DNC. Log it and move on.
- **Hang-up with no words** (often reflexive, a robocall reflex): treat it as a no-connect. At most, one retry on a different day and in a different time slot, opening with the short honest opener.
- Never call back the same day.
- Take a 60-second breather before the next dial.

### H. Meeting close

> "So what I'd suggest: 15 minutes, I show you what happens when a call comes in at 9 p.m. or when you're all on jobs, and you tell me if it'd actually help. Do you have your calendar handy?"
> "Would tomorrow at 7:15, before you roll out, work, or is Thursday around 4:30 better?"
> *(he picks)* "Perfect. What's the best email for the invite?" *(read it back letter by letter)*
> "And is this the best number to reach you, or is there a cell you'd rather I use?"
> "Mind if I text you a quick reminder that morning?" *(only text if he says yes)*
> "Sending the invite now. It'll come from {myEmail}. Did it come through?"

*Rationale:* get the nod first, then Gong's "calendar handy?", then two contractor-friendly times. Sending the invite live makes it harder to ghost. Asking before texting gets consent.

**If he wants info first:**
> "Totally. What's the one thing you'd want to see to know if it's worth 15 minutes?"
> *(send exactly that, 4–5 sentences, same day)*
> "Cool. I'll send that over today and give you a call Thursday morning to see if it's worth a look. Fair?"

**If it's the office manager who owns the phones:**
> "Would it make sense to do it with you and {ownerFirst} together? You're the one who'd know if it'd actually help."

### I. Voicemail (maximum two per prospect, ~15 seconds)

**VM #1 (attempt 1):**
> "Hey {ownerFirst}, it's Malik with {myCompany}. Quick one about how {company} handles calls that come in after hours. Not an SEO or Google thing. I'll try you again Thursday morning. If it's easier, I'm at {myNumber}, that's {myNumber}. Thanks."

**VM #2 (attempt 3, final):**
> "Hey {ownerFirst}, Malik again, {myCompany}. I work with {vertical} companies on the calls that come in when everyone's out on jobs or after hours, so they get answered and booked instead of going to the next company. Figured it's worth one more try. {myNumber}. If it's not a fit, no worries at all, I won't keep calling."

*Rationale:*
- Gong: no more than 2 voicemails, and short ones.
- Contractor practitioners: name, number, time, nothing more.
- VM #2 promises to stop, which is honest and lowers the owner's guard for a callback.
- Don't give the pitch in a voicemail.

### J. Cadence summary
5 attempts over about 3 weeks, rotating through early morning, late afternoon and midday. Leave voicemails on attempts 1 and 3 only. Stop after 5, then park until next season. Any DNC request stops the sequence permanently.

---

## Sources (main)

- Gong Labs:
  - opening lines, 90,380 calls: https://www.gong.io/blog/cold-call-opening-lines
  - openers, 300M calls: https://www.gong.io/blog/the-best-and-worst-cold-call-openers-backed-by-data-from-300m-calls
  - cold-call stats: https://www.gong.io/blog/cold-call-stats
  - objections: https://www.gong.io/blog/we-found-the-top-objections-across-300m-cold-calls-heres-how-to-handle-them-all
  - voicemails: https://www.gong.io/blog/should-you-leave-voicemails-when-cold-calling-heres-what-the-data-says
- Gong/30MPC "How to Master Cold Calls" (300M calls) PDF: https://www.gong.io/files/gong-guide-how-to-master-cold-calls.pdf
- Gong "9 Secret Elements" (100k calls) PDF: https://www.gong.io/files/gong-guide-9-secret-elements-of-cold-calls.pdf
- 30MPC:
  - https://www.30mpc.com/interactive-resources/how-to-master-cold-calls-data-from-300m-calls-30mpc
  - https://www.30mpc.com/newsletter/how-to-build-the-perfect-cold-call-pitch
  - https://www.30mpc.com/newsletter/jason-bays-cold-calling-framework-1-3
  - *Cold Calling Sucks* summary: https://sellingsherpa.com/index.php/2024/09/15/cold-calling-sucks-book-summary/
- Josh Braun:
  - https://joshbraun.com/poke-the-bear-cold-call-script/
  - https://joshbraun.com/defusing-send-me-an-email/
  - https://joshbraun.com/overcoming-the-status-quo-on-a-cold-call/
  - https://joshbraun.com/how-to-cold-call-without-sounding-salesy/
- Nooks: https://www.nooks.ai/blog-posts/want-2-4x-more-cold-call-meetings-start-with-a-simple-question
- Cognism: https://www.cognism.com/reports/cold-calling-report-2026 , https://www.cognism.com/blog/best-time-to-cold-call
- Orum: https://www.orum.com/reports-and-guides/the-state-of-cold-calling
- CallRail:
  - https://www.callrail.com/blog/callrail-releases-benchmark-report
  - https://www.plumbermag.com/online_exclusives/2025/01/callrail-releases-report-analyzing-which-marketing-efforts-best-convert-leads-into-business
  - https://www.callrail.com/blog/missed-calls-cost-businesses-more-than-ever
- Housecall Pro 2026 report: https://www.globenewswire.com/news-release/2026/05/13/3293775/0/en/72-of-homeowners-plan-to-stay-put-as-aging-homes-drive-repair-focused-spending-housecall-pro-report-finds.html
- ServiceTitan:
  - https://www.servicetitan.com/blog/data-call-booking-rates
  - https://www.servicetitan.com/toolbox/state-of-the-trades/trends/hvac-summer-after-hours-call-spike
- Samsara HVAC seasonality: https://www.samsara.com/blog/peak-season-for-hvac
- Google LSA ranking: https://support.google.com/localservices/answer/7527305?hl=en
- HBR 2011: https://hbr.org/2011/03/the-short-life-of-online-sales-leads
- Compliance:
  - FTC TSR 2024: https://www.ftc.gov/business-guidance/blog/2024/03/revised-rule-proposed-amendment-expand-fight-against-illegal-telemarketing
  - Federal Register: https://www.federalregister.gov/documents/2024/04/16/2024-07180/telemarketing-sales-rule
  - eCFR 64.1200: https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200
  - FCC 10-business-day DNC rule: https://clrkc.com/fcc-updates-internal-do-not-call-list-time-period/
  - Greenspoon Marder on cell phones and DNC: https://www.gmlaw.com/news/the-tcpas-do-not-call-rules-cell-phones-and-texts-why-courts-still-disagree-and-what-it-means-for-businesses-and-consumers/
  - CRTC: https://crtc.gc.ca/eng/phone/telemarketing/tobligations/rules-regles.htm
- Contractor practitioner sources:
  - https://www.warriorforum.com/offline-marketing/1099914-best-time-call-businesses-contractors.html
  - https://www.handymanstartup.com/grow-garage-door-company-tommy-mello/
  - https://m3thods.substack.com/p/analysis-small-trades-hvac-plumbing
  - https://itteba.substack.com/p/i-emailed-800-plumbers-and-got-0
