import { Registry, collectDefaultMetrics, Histogram, Counter } from 'prom-client'

class MetricsService {
  public registry: Registry
  public httpRequestDuration: Histogram<string>
  public httpRequestCounter: Counter<string>

  constructor() {
    this.registry = new Registry()
    collectDefaultMetrics({ register: this.registry })

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.registry],
    })

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    })
  }

  public async metrics(): Promise<string> {
    return this.registry.metrics()
  }
}

export default new MetricsService()


