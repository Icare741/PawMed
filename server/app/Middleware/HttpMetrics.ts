import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Metrics from 'App/Services/Metrics'

export default class HttpMetrics {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const url = ctx.request.url()

    // Eviter d'instrumenter l'endpoint de métriques lui-même
    if (url.startsWith('/api/metrics')) {
      await next()
      return
    }

    const method = ctx.request.method()
    const route = ctx.route?.pattern || url
    const endTimer = Metrics.httpRequestDuration.startTimer({ method, route })

    try {
      await next()
    } finally {
      const statusCode = String(ctx.response.response.statusCode || 0)
      endTimer({ status_code: statusCode })
      Metrics.httpRequestCounter.labels(method, route, statusCode).inc()
    }
  }
}


