import { useCallback, useEffect, useState } from 'react'
import type { Lead, Settings } from './types'

export function useStore() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [settings, setSettings] = useState<Settings>({ callerName: 'Malik', companyName: '', callerPhone: '', oneLiner: '', priceRange: 'two to five thousand' })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/state')
      const d = await r.json()
      setLeads(d.leads)
      setSettings(d.settings)
      setError(null)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    load()
    // Leads are also added outside the app (research scripts), so pick them up on refocus.
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  const patchLead = useCallback(async (id: string, patch: Partial<Lead>) => {
    setLeads(ls => ls.map(l => (l.id === id ? { ...l, ...patch, signals: { ...l.signals, ...(patch.signals ?? {}) } } : l)))
    const r = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch),
    })
    if (!r.ok) setError('Save failed — is the dev server running?')
  }, [])

  const addLead = useCallback(async (lead: Lead) => {
    setLeads(ls => [...ls, lead])
    await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) })
  }, [])

  const deleteLead = useCallback(async (id: string) => {
    setLeads(ls => ls.filter(l => l.id !== id))
    await fetch(`/api/leads/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }, [])

  const saveSettings = useCallback(async (s: Settings) => {
    setSettings(s)
    await fetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(s) })
  }, [])

  return { leads, settings, loaded, error, patchLead, addLead, deleteLead, saveSettings, reload: load }
}

export type Store = ReturnType<typeof useStore>

export function blankLead(p: Pick<Lead, 'company' | 'website' | 'vertical' | 'city' | 'region' | 'country' | 'timezone' | 'phone'>): Lead {
  return {
    id: slug(p.company) + '-' + Math.random().toString(36).slice(2, 6),
    ...p,
    hours: null, hoursSource: null, phoneSource: null,
    googleRating: null, googleReviews: null, latestReviewAge: null,
    paidAdsNote: null, reviewComplaintQuote: null, ownershipNote: null,
    employeesEstimate: null, employeeBand: 'unknown', locations: null, existingTools: null,
    dmName: null, dmTitle: null, dmSource: null, directLine: null, directLineSource: null,
    opportunity: null, hooks: [], sources: [],
    signals: {
      paidAds: null, recentReviews: null, emergency247: null, residential: null, freeEstimate: null,
      onlineBooking: null, chatOrText: null, financing: null, multipleServiceAreas: null, phonePrimaryCta: null,
      afterHoursGap: null, reviewResponseComplaints: null, locallyOwned: null, franchise: null,
      sophisticatedContactCenter: null, phoneMatchesGoogle: null,
    },
    researchedAt: null, researchNotes: null,
    status: 'new', lastContact: null, followUp: null, dnc: false, canadaCallReady: false, notes: '', activity: [],
  }
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
