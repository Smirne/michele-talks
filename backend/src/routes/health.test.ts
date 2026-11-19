import { describe, expect, it } from 'vitest'
import { healthRouter } from './health'

describe('GET /health', () => {
  it('reports a healthy status', async () => {
    const res = await healthRouter.request('/')
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe('healthy')
    expect(typeof json.timestamp).toBe('string')
  })
})
