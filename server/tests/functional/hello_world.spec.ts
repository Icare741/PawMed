import { test } from '@japa/runner'

test('GET /api/health répond (200 ou 400 selon l\'état)', async ({ client, assert }) => {
  const response = await client.get('/api/health')
  const status = response.status()
  assert.isTrue([200, 400].includes(status))
})
