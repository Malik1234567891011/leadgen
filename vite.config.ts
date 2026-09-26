import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * The "database" is two JSON files in data/, so leads stay diffable in git
 * and can be added by scripts or by hand. The dev server exposes a tiny API
 * over them; writes are atomic (tmp + rename).
 */
const LEADS = resolve(__dirname, 'data/leads.json')
const SETTINGS = resolve(__dirname, 'data/settings.json')

const read = <T,>(file: string, fallback: T): T =>
  existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : fallback

const write = (file: string, data: unknown) => {
  writeFileSync(file + '.tmp', JSON.stringify(data, null, 2) + '\n')
  renameSync(file + '.tmp', file)
}

const body = (req: IncomingMessage) =>
  new Promise<any>((ok, fail) => {
    let s = ''
    req.on('data', c => (s += c))
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}) } catch (e) { fail(e) } })
  })

const send = (res: ServerResponse, status: number, data: unknown) => {
  res.statusCode = status
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(data))
}

const DEFAULT_SETTINGS = { callerName: 'Malik', companyName: '', callerPhone: '', oneLiner: '', priceRange: 'two to five thousand' }

function leadsApi(): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/')) return next()
    try {
      if (req.method === 'GET' && url === '/api/state') {
        return send(res, 200, { leads: read(LEADS, []), settings: { ...DEFAULT_SETTINGS, ...read(SETTINGS, {}) } })
      }
      if (req.method === 'PUT' && url === '/api/settings') {
        const next = { ...DEFAULT_SETTINGS, ...read(SETTINGS, {}), ...(await body(req)) }
        write(SETTINGS, next)
        return send(res, 200, next)
      }
      if (req.method === 'POST' && url === '/api/leads') {
        const leads = read<any[]>(LEADS, [])
        const lead = await body(req)
        leads.push(lead)
        write(LEADS, leads)
        return send(res, 200, lead)
      }
      const m = url.match(/^\/api\/leads\/([^/]+)$/)
      if (m && req.method === 'PATCH') {
        const leads = read<any[]>(LEADS, [])
        const i = leads.findIndex(l => l.id === decodeURIComponent(m[1]))
        if (i < 0) return send(res, 404, { error: 'not found' })
        const patch = await body(req)
        leads[i] = { ...leads[i], ...patch, signals: { ...leads[i].signals, ...(patch.signals ?? {}) } }
        write(LEADS, leads)
        return send(res, 200, leads[i])
      }
      if (m && req.method === 'DELETE') {
        const leads = read<any[]>(LEADS, []).filter(l => l.id !== decodeURIComponent(m[1]))
        write(LEADS, leads)
        return send(res, 200, { ok: true })
      }
      send(res, 404, { error: 'unknown route' })
    } catch (e) {
      send(res, 500, { error: String(e) })
    }
  }
  return {
    name: 'leads-api',
    configureServer: s => { s.middlewares.use(handle) },
    configurePreviewServer: s => { s.middlewares.use(handle) },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadsApi()],
  server: { port: 5190, watch: { ignored: ['**/data/**'] } },
})
