import { test } from '@japa/runner'

test('GET /api/swagger retourne la documentation', async ({ client }) => {
  const response = await client.get('/api/swagger')
  response.assertStatus(200)
})
