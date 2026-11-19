import { errorHandler } from '@/middleware/error-handler'
import { requestLogger } from '@/middleware/logger'
import { createRouter } from '@/routes'
import { OpenAPIHono } from '@hono/zod-openapi'

export const createApp = () => {
  const app = new OpenAPIHono()

  // Global middleware
  app.use('*', requestLogger)
  app.onError(errorHandler)

  // Routes
  app.route('/', createRouter())

  // OpenAPI spec
  app.doc('/openapi.json', {
    openapi: '3.1.0',
    info: {
      title: 'Michele Talks',
      version: '0.1.0',
    },
  })

  return app
}
