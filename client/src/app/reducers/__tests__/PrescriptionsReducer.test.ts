import reducer, {
  fetchPrescriptions,
  fetchPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
  setCurrentPrescription,
} from '../PrescriptionsReducer'

describe('PrescriptionsReducer', () => {
  test('fetchPrescriptions.fulfilled remplit la liste', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const next = reducer(state, { type: fetchPrescriptions.fulfilled.type, payload: [{ id: 1 }] } as any)
    expect(next.prescriptions).toEqual([{ id: 1 }])
  })

  test('setCurrentPrescription définit la courante', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const next = reducer(state, setCurrentPrescription({ id: 10 } as any))
    expect(next.currentPrescription?.id).toBe(10)
  })

  test('createPrescription.fulfilled ajoute en tête', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const withOne = reducer(state, { type: fetchPrescriptions.fulfilled.type, payload: [{ id: 1 }] } as any)
    const next = reducer(withOne, { type: createPrescription.fulfilled.type, payload: { id: 2 } } as any)
    expect(next.prescriptions.map((p: any) => p.id)).toEqual([2, 1])
  })

  test('updatePrescription.fulfilled remplace dans la liste et la courante', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const base = { ...state, prescriptions: [{ id: 1 }, { id: 2 }] as any, currentPrescription: { id: 2 } as any }
    const next = reducer(base, { type: updatePrescription.fulfilled.type, payload: { id: 2, x: true } } as any)
    expect(next.prescriptions.find((p: any) => p.id === 2)).toEqual({ id: 2, x: true })
    expect(next.currentPrescription).toEqual({ id: 2, x: true } as any)
  })

  test('deletePrescription.fulfilled supprime et nettoie la courante', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const base = { ...state, prescriptions: [{ id: 1 }, { id: 2 }] as any, currentPrescription: { id: 2 } as any }
    const next = reducer(base, { type: deletePrescription.fulfilled.type, payload: 2 } as any)
    expect(next.prescriptions.map((p: any) => p.id)).toEqual([1])
    expect(next.currentPrescription).toBeNull()
  })
})


