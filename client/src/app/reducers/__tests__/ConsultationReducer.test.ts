import reducer, {
  fetchConsultations,
  fetchConsultationStats,
  createConsultation,
  updateConsultation,
} from '../ConsultationReducer'

describe('ConsultationReducer', () => {
  test('fetchConsultations.fulfilled met à jour la liste', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const next = reducer(state, { type: fetchConsultations.fulfilled.type, payload: [{ id: 1 }] } as any)
    expect(next.consultations).toEqual([{ id: 1 }])
  })

  test('fetchConsultationStats.fulfilled met à jour les stats', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const stats = { dailyConsultations: 1, newPatients: 1, consultationHours: 2, nextAvailability: 'x' }
    const next = reducer(state, { type: fetchConsultationStats.fulfilled.type, payload: stats } as any)
    expect(next.stats).toEqual(stats)
  })

  test('createConsultation.fulfilled ajoute en tête', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const withOne = reducer(state, { type: fetchConsultations.fulfilled.type, payload: [{ id: 1 }] } as any)
    const next = reducer(withOne, { type: createConsultation.fulfilled.type, payload: { id: 2 } } as any)
    expect(next.consultations.map((c: any) => c.id)).toEqual([2, 1])
  })

  test('updateConsultation.fulfilled remplace dans la liste', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const base = { ...state, consultations: [{ id: 1 }, { id: 2 }] as any }
    const next = reducer(base, { type: updateConsultation.fulfilled.type, payload: { id: 2, x: true } } as any)
    expect(next.consultations.find((c: any) => c.id === 2)).toEqual({ id: 2, x: true })
  })
})


