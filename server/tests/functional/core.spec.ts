import { test } from '@japa/runner'

test.group('Core protected routes require auth', () => {
  test('GET /api/patients -> 401 sans token', async ({ client }) => {
    const res = await client.get('/api/patients')
    res.assertStatus(401)
  })

  test('GET /api/prescriptions -> 401 sans token', async ({ client }) => {
    const res = await client.get('/api/prescriptions')
    res.assertStatus(401)
  })

  test('GET /api/consultations -> 401 sans token', async ({ client }) => {
    const res = await client.get('/api/consultations')
    res.assertStatus(401)
  })
})


