import type { Vertical } from './types'

export type Tier = 'S' | 'A' | 'B'

export const VERTICALS: Record<Vertical, { label: string; tier: Tier; emoji: string }> = {
  restoration: { label: 'Restoration', tier: 'S', emoji: '💧' },
  hvac: { label: 'HVAC', tier: 'S', emoji: '❄️' },
  plumbing: { label: 'Plumbing', tier: 'S', emoji: '🔧' },
  roofing: { label: 'Roofing', tier: 'S', emoji: '🏠' },
  electrical: { label: 'Electrical', tier: 'S', emoji: '⚡' },
  'garage-doors': { label: 'Garage doors', tier: 'S', emoji: '🚪' },
  foundation: { label: 'Foundation', tier: 'A', emoji: '🧱' },
  'windows-doors': { label: 'Windows & doors', tier: 'A', emoji: '🪟' },
  septic: { label: 'Septic', tier: 'A', emoji: '🛢️' },
  tree: { label: 'Tree service', tier: 'A', emoji: '🌳' },
  pest: { label: 'Pest control', tier: 'A', emoji: '🐜' },
  pool: { label: 'Pool', tier: 'A', emoji: '🏊' },
  remodeling: { label: 'Remodeling', tier: 'A', emoji: '🛁' },
  movers: { label: 'Movers', tier: 'A', emoji: '📦' },
  fencing: { label: 'Fencing', tier: 'B', emoji: '🪵' },
  'siding-gutters': { label: 'Siding & gutters', tier: 'B', emoji: '🏚️' },
  flooring: { label: 'Flooring', tier: 'B', emoji: '🟫' },
  insulation: { label: 'Insulation', tier: 'B', emoji: '🧤' },
  painting: { label: 'Painting', tier: 'B', emoji: '🎨' },
  hardscaping: { label: 'Hardscaping', tier: 'B', emoji: '🪨' },
  'general-contractor': { label: 'General contractor', tier: 'B', emoji: '🏗️' },
  solar: { label: 'Solar', tier: 'B', emoji: '☀️' },
  'appliance-repair': { label: 'Appliance repair', tier: 'B', emoji: '🔌' },
}

export const TIER_POINTS: Record<Tier, number> = { S: 25, A: 20, B: 12 }
