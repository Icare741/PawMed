import reducer, {
  fetchPatients,
  fetchPatient,
  deletePatient,
  setCurrentPatient,
} from '../PatientsReducer'

describe('PatientsReducer', () => {
  test('fetchPatients.fulfilled remplace la liste', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const next = reducer(state, {
      type: fetchPatients.fulfilled.type,
      payload: [{ id: 1, name: 'A' }],
    } as any)
    expect(next.patients).toEqual([{ id: 1, name: 'A' }])
    expect(next.isLoading).toBe(false)
    expect(next.error).toBeNull()
  })

  test('setCurrentPatient définit le patient courant', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any)
    const next = reducer(state, setCurrentPatient({ id: 2, name: 'B' } as any))
    expect(next.currentPatient?.id).toBe(2)
  })

  test('deletePatient.fulfilled retire un patient et nettoie currentPatient', () => {
    const initial = reducer(undefined, { type: '@@INIT' } as any)
    const withList = { ...initial, patients: [{ id: 1 }, { id: 2 }] as any, currentPatient: { id: 2 } as any }
    const next = reducer(withList, { type: deletePatient.fulfilled.type, payload: 2 } as any)
    expect(next.patients.map((p: any) => p.id)).toEqual([1])
    expect(next.currentPatient).toBeNull()
  })
})


