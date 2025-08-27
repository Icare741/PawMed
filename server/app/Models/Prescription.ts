import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Patient from './Patient'
import User from './User'
import Consultation from './Consultation'
import PrescriptionItem from './PrescriptionItem'

export default class Prescription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public patientId: number

  @column()
  public practitionerId: number

  @column()
  public consultationId: number | null

  @column.date()
  public prescriptionDate: DateTime

  @column()
  public status: 'active' | 'completed' | 'expired'

  @column()
  public notes: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relations
  @belongsTo(() => Patient, {
    foreignKey: 'patientId'
  })
  public patient: BelongsTo<typeof Patient>

  @belongsTo(() => User, {
    foreignKey: 'practitionerId'
  })
  public practitioner: BelongsTo<typeof User>

  @belongsTo(() => Consultation, {
    foreignKey: 'consultationId'
  })
  public consultation: BelongsTo<typeof Consultation>

  @hasMany(() => PrescriptionItem, {
    foreignKey: 'prescriptionId'
  })
  public items: HasMany<typeof PrescriptionItem>
}
