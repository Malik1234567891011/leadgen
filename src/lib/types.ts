export type Vertical =
  | 'restoration' | 'hvac' | 'plumbing' | 'roofing' | 'electrical' | 'garage-doors'
  | 'foundation' | 'windows-doors' | 'septic' | 'tree' | 'pest' | 'pool' | 'remodeling' | 'movers'
  | 'fencing' | 'siding-gutters' | 'flooring' | 'insulation' | 'painting' | 'hardscaping'
  | 'general-contractor' | 'solar' | 'appliance-repair'

export type EmployeeBand = '1-2' | '3-4' | '5-15' | '16-50' | '51-100' | '101-250' | '250+' | 'unknown'

export type CallStatus =
  | 'new' | 'no-answer' | 'voicemail' | 'gatekeeper' | 'callback'
  | 'conversation' | 'meeting' | 'not-interested' | 'disqualified'

/** Research signals. null = not checked / unknown. */
export interface Signals {
  paidAds: boolean | null
  recentReviews: boolean | null
  emergency247: boolean | null
  residential: boolean | null
  freeEstimate: boolean | null
  onlineBooking: boolean | null
  chatOrText: boolean | null
  financing: boolean | null
  multipleServiceAreas: boolean | null
  phonePrimaryCta: boolean | null
  afterHoursGap: boolean | null
  reviewResponseComplaints: boolean | null
  locallyOwned: boolean | null
  franchise: boolean | null
  sophisticatedContactCenter: boolean | null
  phoneMatchesGoogle: boolean | null
}

export interface Source { label: string; url: string }

export interface Activity {
  at: string // ISO
  outcome: CallStatus | 'note'
  note?: string
}

export interface Lead {
  id: string
  company: string
  website: string
  vertical: Vertical
  city: string
  region: string
  country: 'US' | 'CA'
  timezone: string
  hours: string | null
  hoursSource: string | null
  phone: string
  phoneSource: string | null
  googleRating: number | null
  googleReviews: number | null
  latestReviewAge: string | null
  paidAdsNote: string | null
  reviewComplaintQuote: string | null
  ownershipNote: string | null
  employeesEstimate: string | null
  employeeBand: EmployeeBand
  locations: number | null
  existingTools: string | null
  dmName: string | null
  dmTitle: string | null
  dmSource: string | null
  directLine: string | null
  directLineSource: string | null
  opportunity: string | null
  hooks: string[]
  sources: Source[]
  signals: Signals
  researchedAt: string | null
  researchNotes: string | null

  // CRM
  status: CallStatus
  lastContact: string | null
  followUp: string | null // yyyy-mm-dd
  dnc: boolean
  canadaCallReady: boolean
  notes: string
  activity: Activity[]
  /** LinkedIn outreach to the decision maker. Absent = not looked up yet. */
  linkedin?: LinkedIn
}

export interface LinkedIn {
  /** sent = invite sent · connected = accepted · not-found = no confident profile match · skipped = deliberately not sent */
  status: 'sent' | 'connected' | 'not-found' | 'skipped'
  url: string | null
  at: string // ISO
  note?: string
}

export interface Settings {
  callerName: string
  companyName: string
  /** Your callback number, read out in voicemails. */
  callerPhone: string
  /** One plain sentence: what you help with. Used in the script. */
  oneLiner: string
  /** Said when they ask “how much?”, e.g. “two to five thousand”. */
  priceRange: string
}
