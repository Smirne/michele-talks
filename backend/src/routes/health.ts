import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const healthSchema = z.object({
  status: z.literal('healthy'),
  timestamp: z.string().datetime(),
})

const healthRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: { 'application/json': { schema: healthSchema } },
      description: 'Service is healthy',
    },
  },
  tags: ['Health'],
  summary: 'Health check',
})

export const healthRouter = new OpenAPIHono()

healthRouter.openapi(healthRoute, async c => {
  return c.json(
    {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
    },
    200
  )
})
